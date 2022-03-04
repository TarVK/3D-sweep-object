import {IJSON} from "../_types/IJSON";
import {validatorsEqual} from "./validatorsEqual";
import {IJSONValidationError} from "./_types/IJSONValidationError";
import {
    IJSONObjectValidationNode,
    IJSONObjectValidationNodeData,
    IJSONValidationNode,
    IUpdateChanges,
    IUpdateResult,
} from "./_types/IJSONValidationNode";
import {
    IJSONErrorChange,
    IJSONValidator,
    IJSONValueChange,
    IValidationResult,
} from "./_types/IJSONValidator";

/**
 * Creates a new JSON object validation node
 * @param value The initial value of the validation node
 * @returns The JSON object validation node
 */
export function createJSONObjectValidationNode(
    value: Record<string, IJSON>
): IJSONObjectValidationNode {
    const data: IJSONObjectValidationNodeData = {
        children: {},
        childOrder: [],
        checkedFields: new Map(),
    };
    const createChangeMerger = ({
        value,
        errors,
    }: {
        value: Record<string, IJSON>;
        errors: Map<string, IJSONValidationError>;
    }) => {
        const valueChanges: IJSONValueChange[] = [];
        const errorChanges: IJSONErrorChange[] = [];
        const update: IUpdateChanges = {
            valueChanges,
            errorChanges,
        };

        const mergeChanges = (changes: IUpdateChanges) => {
            update.valueChanges.push(...changes.valueChanges);
            update.errorChanges.push(...changes.errorChanges);
        };

        const handleChildChanges = (key: string, result: IUpdateChanges) => {
            result.errorChanges.forEach(errorChange => {
                const path = [key, ...errorChange.path];
                if (errorChange.error) errors.set(path.join("."), errorChange.error);
                else errors.delete(path.join("."));

                errorChanges.push({path, error: errorChange.error});
            });
            result.valueChanges.forEach(valueChange => {
                const path = [key, ...valueChange.path];
                if (valueChange.path.length == 0) {
                    if (valueChange.type == "delete") delete value[key];
                    else value[key] = valueChange.value!;
                }

                valueChanges.push({...valueChange, path});
            });
        };
        const handleChildDeletion = (key: string, child: IJSONValidationNode) => {
            delete value[key];
            update.valueChanges.push({type: "delete", path: [key]});

            for (let childPath of child.errors.keys()) {
                const path = [key, ...childPath];
                errors.delete(path.join("."));
                update.errorChanges.push({path, error: undefined});
            }
        };
        const handleChildInsertion = (
            key: string,
            child: IJSONValidationNode,
            isUpdate: boolean = false
        ) => {
            value[key] = child.value;
            update.valueChanges.push({
                type: isUpdate ? "update" : "insert",
                path: [key],
                value: child.value,
            });

            for (let [childPath, error] of child.errors) {
                const path = [key, ...childPath];
                errors.set(path.join("."), error);
                update.errorChanges.push({path, error});
            }
        };
        const handleDefaultInsertion = (key: string, childValue: IJSON) => {
            value[key] = childValue;
            update.valueChanges.push({type: "insert", path: [key], value: childValue});
        };
        const handleDefaultDeletion = (key: string) => {
            delete value[key];
            update.valueChanges.push({type: "delete", path: [key]});
        };

        return {
            update,
            mergeChanges,
            handleChildChanges,
            handleChildDeletion,
            handleChildInsertion,
            handleDefaultInsertion,
            handleDefaultDeletion,
        };
    };
    const updateValue = (value: Record<string, IJSON>) => {
        const keys = Object.keys(value);
        const keySet = new Set(keys);
        const oldKeys = data.childOrder;
        data.childOrder = keys;

        const {update, handleChildChanges, handleChildDeletion, handleChildInsertion} =
            createChangeMerger(node);

        for (let key of keys) {
            let child = data.children[key];
            const childData = value[key];
            if (!child) {
                child = data.children[key] = createJSONValueValidationNode(childData);
                if (data.checkedFields.has(key)) {
                    child.setValidator(data.checkedFields.get(key)!);
                    handleChildInsertion(key, child, true);
                }
            } else {
                const changes = child.update({
                    type: "update",
                    path: [],
                    value: childData,
                });
                if (data.checkedFields.has(key)) handleChildChanges(key, changes);
            }
        }
        for (let deletedKey of oldKeys) {
            if (keySet.has(deletedKey)) continue;
            const child = data.children[deletedKey];
            if (data.checkedFields.has(deletedKey))
                handleChildDeletion(deletedKey, child);

            delete data.children[deletedKey];
        }

        return update;
    };

    const validate = <R>(
        validator: IJSONValidator<IJSON, R> | undefined
    ): IUpdateResult<R> | IUpdateChanges => {
        const noLongerChecked = new Set(data.checkedFields.keys());
        const newChecked = new Map<string, IJSONValidator>();

        const {update, handleChildChanges, handleChildDeletion, handleChildInsertion} =
            createChangeMerger(node);

        // Validate the data, which in turn updates validators of children and registers updates
        const result = validator?.validate(
            node.data,
            data.childOrder,
            (key, validator) => {
                noLongerChecked.delete(key);
                newChecked.set(key, validator);

                let validationResult: IValidationResult<any>;
                const child: IJSONValidationNode = data.children[key];
                const newlyChecked = !data.checkedFields.has(key);

                if (child) {
                    const changes = child.setValidator(validator);
                    if (newlyChecked) handleChildInsertion(key, child);
                    else handleChildChanges(key, changes);
                    validationResult = changes.validation;
                } else {
                    if (newlyChecked)
                        update.valueChanges.push({
                            type: "insert",
                            path: [key],
                            value: validator.default,
                        });
                    else {
                        const prevValidator = data.checkedFields.get(key)!;
                        if (!validatorsEqual(prevValidator, validator))
                            update.valueChanges.push({
                                type: "update",
                                path: [key],
                                value: validator.default,
                            });
                    }
                    validationResult = {
                        errors: [],
                        data: validator.absentResult,
                    };
                }

                return validationResult;
            }
        );

        // Handle value deletions
        for (let deletedKey of noLongerChecked) {
            const child = data.children[deletedKey];
            handleChildDeletion(deletedKey, child);
        }

        data.checkedFields = newChecked;

        return {...update, validation: result};
    };

    const node: IJSONObjectValidationNode = {
        type: "object",
        value: {},
        data,
        errors: new Map(),
        update(change) {
            const {
                update,
                mergeChanges,
                handleChildChanges,
                handleChildInsertion,
                handleChildDeletion,
            } = createChangeMerger(node);

            if (change.path.length == 0) {
                if (change.type != "update")
                    throw Error(
                        "Object insertion and deletion should be handled by the parent"
                    );

                mergeChanges(updateValue(change.value as any));
            } else if (change.path.length > 1) {
                const [key, ...path] = change.path;
                const childChange = {...change, path};
                const child = data.children[key];
                if (!child) throw Error(`Targeted child "${key}" does not exist`);
                const changes = child.update(childChange);
                if (data.checkedFields.has(key)) handleChildChanges(key, changes);
            } else {
                const key = change.path[0];
                if (change.type == "insert") {
                    const child = (data.children[key] = createJSONValueValidationNode(
                        change.value
                    ));
                    if (data.checkedFields.has(key)) {
                        child.setValidator(data.checkedFields.get(key)!);
                        handleChildInsertion(key, child, true);
                    }

                    if (change.index !== undefined)
                        data.childOrder.splice(change.index, 0, key);
                    else data.childOrder.push(key);
                } else if (change.type == "update") {
                    const childChange = {...change, path: []};
                    const child = data.children[key];
                    if (!child) throw Error(`Targeted child "${key}" does not exist`);
                    const changes = child.update(childChange);
                    if (data.checkedFields.has(key)) handleChildChanges(key, changes);
                } else {
                    const child = data.children[key];
                    if (!child) throw Error(`Targeted child "${key}" does not exist`);
                    handleChildDeletion(key, child);

                    const index = data.childOrder.indexOf(key);
                    if (index != -1) data.childOrder.splice(index, 1);
                    delete data.children[key];
                }
            }

            const validator = data.validation?.validator;
            if (validator) mergeChanges(validate(validator));

            return update;
        },
        setValidator<R>(validator: IJSONValidator<IJSON, R> | undefined): any {
            if (data.validation?.validator == validator) {
                return {
                    valueChanges: [],
                    errorChanges: [],
                    validation: data.validation?.result,
                };
            }

            const newValidation = validate(validator);
            if ("validation" in newValidation)
                data.validation = {
                    validator: validator!,
                    result: newValidation.validation,
                };
            else data.validation = undefined;

            return newValidation;
        },
    };

    // Initialize the children
    updateValue(value);
    return node;
}

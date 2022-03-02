import {IJSON} from "../_types/IJSON";
import {
    IJSONObjectValidationNode,
    IJSONObjectValidationNodeData,
    IJSONValidationNode,
    IUpdateResult,
} from "./_types/IJSONValidationNode";
import {
    IJSONErrorChange,
    IJSONValidator,
    IJSONValueChange,
    IValidationResult,
} from "./_types/IJSONValidator";

/**
 * Creates a new json object validation node
 * @param fields The fields to be checked
 * @returns The JSON object validation node
 */
export function createJSONObjectValidationNode(
    value: unknown,
    validator: IJSONValidator<Record<string, IJSON>>
): IJSONObjectValidationNode {
    const data: IJSONObjectValidationNodeData = {
        fields: {},
        fieldsOrder: [],
        validator,
        checkedFields: new Set(),
        validation: validator.validate(validator.default, [], {}),
    };
    const node: IJSONObjectValidationNode = {
        type: "object",
        value: validator.default,
        data,
        update<R>(validator: IJSONValidator<IJSON, R>, change?: IJSONValueChange) {
            if (!change && validator.id == data.validator.id)
                return {
                    errorChanges: [],
                    valueChanges: [],
                    validation: data.validation as IValidationResult<R>,
                };

            const updates = {
                valueChanges: [] as IJSONValueChange[],
                errorChanges: [] as IJSONErrorChange[],
            };

            let childChange:
                | {
                      key: string;
                      change: IJSONValueChange;
                  }
                | undefined;

            if (change) {
                if (change.path.length == 0) {
                    if (change.type == "update") {
                        if (typeof change.value != "object" || !change.value)
                            throw Error("Object should receive object values");
                        data.fieldsOrder = Object.keys(change.value);
                    } else
                        throw Error(
                            "Insert and delete should be handled by the parent node"
                        );
                } else {
                    const {
                        type,
                        path: [key, ...path],
                        value,
                    } = change;
                    if (type == "insert" && !data.fields[key]) {
                        const index = Number(path[0]);
                        if (isNaN(index) || path.length != 1)
                            throw Error(
                                "New object additions should specify an index of what position they were inserted at"
                            );

                        data.fieldsOrder.splice(index, 0, key);
                    } else if (type == "delete" && path.length == 0) {
                        const index = data.fieldsOrder.indexOf(key);
                        if (index != -1) data.fieldsOrder.splice(index, 1);
                    } else {
                        childChange = {
                            key,
                            change: {type, path, value},
                        };
                    }
                }
            }

            const newCheckedFields = new Set<string>();
            const deletedFields = new Set(data.checkedFields);
            const validation = validator.validate(
                node.value,
                data.fieldsOrder,
                (name, validator) => {
                    newCheckedFields.add(name);
                    deletedFields.delete(name);

                    const child = data.fields[name];
                    if (child) {
                        const hasChange = childChange?.key == name;
                        let result: IUpdateResult<unknown>;
                        if (hasChange)
                            result = child.update(validator, childChange!.change);
                        else {
                            const isDeleted = !data.fieldsOrder.includes(name);
                            if (isDeleted)
                                result = child.update(validator, {
                                    type: "update",
                                    path: [],
                                    value: undefined,
                                });
                            else result = child.update(validator);
                        }

                        if (data.checkedFields.has(name)) {
                            result.valueChanges.forEach(({path, type, value}) =>
                                updates.valueChanges.push({
                                    path: [name, ...path],
                                    type,
                                    value,
                                })
                            );
                            result.errorChanges.forEach(({path, error}) =>
                                updates.errorChanges.push({path: [name, ...path], error})
                            );
                        } else {
                            updates.valueChanges.push({
                                type: "insert",
                                path: [name],
                                value: child.value,
                            });
                            updates.errorChanges.push(
                                ...child.getErrors().map(({path, error}) => ({
                                    path: [name, ...path],
                                    error,
                                }))
                            );
                        }

                        return result.validation;
                    }

                    const newChild = createJSONValueValidationNode(undefined, validator);
                    data.fields[name] = newChild;
                    updates.valueChanges.push({
                        type: "insert",
                        path: [name],
                        value: newChild.value,
                    });
                    updates.errorChanges.push(
                        ...newChild
                            .getErrors()
                            .map(({path, error}) => ({path: [name, ...path], error}))
                    );
                    return newChild.validation;
                }
            );

            // Delete old fake fields
            for (let deleted of deletedFields) {
                const deletedChild = data.fields[deleted];
                if (deletedChild) {
                    updates.valueChanges.push({
                        type: "delete",
                        path: [deleted],
                        value: undefined,
                    });
                    updates.errorChanges.push(
                        ...deletedChild.getErrors().map(({path, error}) => ({
                            path: [deleted, ...path],
                            error: undefined,
                        }))
                    );
                }

                // Only delete the node if it was a default value node
                if (deletedChild.value == undefined) delete data.fields[deleted];
            }

            // Make sure the child is inserted, even if not used
            if (childChange && !newCheckedFields.has(childChange.key)) {
                if (
                    childChange.change.type == "insert" &&
                    !data.fields[childChange.key]
                ) {
                    const newChild = createJSONValueValidationNode(undefined, validator);
                    data.fields[childChange.key] = newChild;
                }
            }

            // Update shit
            data.validation = validation;
            data.checkedFields = newCheckedFields;

            return {
                valueChanges: updates.valueChanges,
                errorChanges: updates.errorChanges,
                validation,
            };
        },
    };
    return node;
}

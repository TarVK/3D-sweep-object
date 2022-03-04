import {
    IJSONNumberValidationNode,
    IJSONNumberValidationNodeData,
    IUpdateChanges,
} from "./_types/IJSONValidationNode";

/**
 * Creates a new JSON number validation node
 * @param value The initial value fo the validation node
 * @returns The JSON number validation node
 */
export function createJSONNumberValidationNode(value: number): IJSONNumberValidationNode {
    const data: IJSONNumberValidationNodeData = {
        value,
    };
    const node: IJSONNumberValidationNode = {
        type: "number",
        value,
        data,
        errors: new Map(),
        update(change) {
            if (change.path.length != 0) throw Error("Numbers don't have any children");

            if (change.type != "update")
                throw Error("Insertion/deletion should be handled by the parent");

            if (change.value == data.value)
                return {
                    errorChanges: [],
                    valueChanges: [],
                };

            data.value = change.value as number;
            const validator = data.validation?.validator;
            if (!validator) {
                node.value = data.value;
                return {
                    errorChanges: [],
                    valueChanges: [change],
                };
            }

            const validation = validator.validate(data.value, [], (key, validator) => ({
                errors: [],
                data: validator.absentResult,
            }));
            data.validation = {
                validator,
                result: validation,
            };

            const update: IUpdateChanges = {
                errorChanges: [],
                valueChanges: [],
            };

            for (let [path, error] of node.errors)
                update.errorChanges.push({path: [], error: undefined});
            node.errors.clear();

            const oldValue = node.value;
            if (validation.errors) {
                node.value = validator.default;
                for (let error of validation.errors) {
                    update.errorChanges.push({path: [], error});
                    node.errors.set();
                }
            } else {
                node.value = data.value;
            }

            if (oldValue != node.value) {
                update.valueChanges.push({type: "update", path: [], value: node.value});
            }
        },
    };

    return node;
}

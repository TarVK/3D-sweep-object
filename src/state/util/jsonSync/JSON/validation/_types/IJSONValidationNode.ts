import {IJSON} from "../../_types/IJSON";
import {
    IJSONDescendentError,
    IJSONErrorChange,
    IJSONValidator,
    IJSONValueChange,
    IValidationResult,
} from "./IJSONValidator";

export type IJSONValidationNode<T extends IJSON = IJSON, E = any> = {
    type: string;
    value: T; // The allowed value under the current validator
    update<R>(
        validator: IJSONValidator<IJSON, R>,
        change?: IJSONValueChange
    ): IUpdateResult<R>;
    getErrors(): IJSONDescendentError[];
    /** Any additional data that this node type needs for proper updating */
    data: E;
};

export type IUpdateResult<R> = {
    valueChanges: IJSONValueChange[];
    errorChanges: IJSONErrorChange[];
    validation: IValidationResult<R>;
};

// export type IJSONObjectValidationNode = IJSONValidationNode<{[key: string]: IJSON}> & {
//     fields: Record<string, IJSONValidationNode>;
// };

export type IJSONObjectValidationNode = IJSONValidationNode<
    {[key: string]: IJSON},
    IJSONObjectValidationNodeData
>;
export type IJSONObjectValidationNodeData = {
    fields: Record<string, IJSONValidationNode>;
    fieldsOrder: string[];
    checkedFields: Set<string>;
    validator: IJSONValidator;
    validation: IValidationResult<unknown>;
};

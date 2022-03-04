import {IJSON} from "../../_types/IJSON";
import {IJSONValidationError} from "./IJSONValidationError";
import {
    IJSONDescendentError,
    IJSONErrorChange,
    IJSONValidator,
    IJSONValueChange,
    IValidationResult,
} from "./IJSONValidator";

/*
 Note, if a validation node's validator is undefined, the node isn't used in the output of the parent. So in terms of communicated changes, the field should be considered non-existent. Therefore the field should appropriately dispatch insert and delete changes when adding or removing the validator. 

 */
export type IJSONValidationNode<T extends IJSON = IJSON, E = any> = {
    /** The node type */
    type: string;
    /** The currently validated value */
    value: T;
    /** The current validation errors within this node */
    errors: Map<string, IJSONValidationError>;
    /**
     * Dispatches an update within this node
     * @param change The change to be dispatched
     * @returns The changes caused by this value update
     */
    update(change: IJSONValueChange): IUpdateChanges;
    /**
     * Sets the validator to be used by this node
     * @param validator The validator that should from now on be used by the node
     * @returns The changes caused by setting this validator
     */
    setValidator<R>(validator: IJSONValidator<IJSON, R>): IUpdateResult<R>;
    /**
     * Sets the validator to be used by this node
     * @param validator The validator that should from now on be used by the node
     * @returns The changes caused by setting this validator
     */
    setValidator(validator: undefined): IUpdateChanges;
    /** Any additional data that this node type needs for proper updating */
    data: E;
};

export type IUpdateChanges = {
    valueChanges: IJSONValueChange[];
    errorChanges: IJSONErrorChange[];
};
export type IUpdateResult<R> = IUpdateChanges & {
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
    childOrder: string[];
    children: Record<string, IJSONValidationNode>;
    checkedFields: Map<string, IJSONValidator>;
    validation?: {
        validator: IJSONValidator;
        result: IValidationResult<unknown>;
    };
};

export type IJSONNumberValidationNode = IJSONValidationNode<
    number,
    IJSONNumberValidationNodeData
>;
export type IJSONNumberValidationNodeData = {
    value: number;
    validation?: {
        validator: IJSONValidator<number>;
        result: IValidationResult<unknown>;
    };
};

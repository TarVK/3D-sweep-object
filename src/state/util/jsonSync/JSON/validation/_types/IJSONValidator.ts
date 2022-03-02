import {IJSON} from "../../_types/IJSON";
import {IJSONValidationError} from "./IJSONValidationError";

export type IJSONValidator<D = IJSON, R = unknown> = {
    /** The identifier for this validator kind, such that we can detect validator replacement */
    id: IValidatorID;
    /** The default data in case that validation fails */
    default: D;
    /**
     * Checks whether the given data follows the exact structure/requirements
     * @param data
     */
    validate: (
        data: D | unknown,
        childKeys: string[],
        checkChild: <C>(
            key: string,
            validator: IJSONValidator<IJSON, C>
        ) => IValidationResult<C>
    ) => IValidationResult<R>;
};

export type IValidatorID = symbol | IValidatorID[];

export type IValidationResult<D> = {
    errors: IJSONValidationError[];
    data: D;
};
export type IJSONErrorChange = {
    path: string[];
    error: IJSONValidationError | undefined;
};
export type IJSONValueChange = {
    type: "insert" | "update" | "delete";
    path: string[];
    value: IJSON | undefined;
};

export type IJSONDescendentError = {
    path: string[];
    error: IJSONValidationError;
};

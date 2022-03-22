import {IInteractionModeController} from "./IInteractionModeController";

/**
 * Constructs an interaction mode controller
 */
export type IInteractionModeControllerConstructor<T, M> = (
    state: T
) => IInteractionModeController<M>;

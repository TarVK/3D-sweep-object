import {useDataHook} from "model-react";
import {useCrossSectionEditorState} from "../CrossSectionEditorStateContext";
import {createAddHandler} from "./toolHandlers/createAddHandler";
import {createDeleteHandler} from "./toolHandlers/createDeleteHandler";
import {createEditHandler} from "./toolHandlers/createEditHandler";
import {useCombinedHandlers} from "./useCombinedHandlers";

/**
 * A hook that defines all the interaction handlers to control the cross section
 * @returns The UI interaction handlers
 */
export const useCrossSectionInteractionHandlers = () => {
    const state = useCrossSectionEditorState();
    const [h] = useDataHook();
    const handlers = useCombinedHandlers(state, state.getSelectedTool(h), [
        createEditHandler,
        createAddHandler,
        createDeleteHandler,
    ]);
    return handlers;
};

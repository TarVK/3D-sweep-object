import {createContext, useContext} from "react";
import {CrossSectionEditorState} from "../../state/CrossSectionEditorState";

export const CrossSectionEditorStateContext = createContext(
    new CrossSectionEditorState()
);

/**
 * Retrieves the cross section editor's state
 * @returns The state
 */
export const useCrossSectionEditorState = () =>
    useContext(CrossSectionEditorStateContext);

import {CrossSectionEditorState} from "../../../../../state/CrossSectionEditorState";
import {ICrossSectionEditorTool} from "../../../../../state/_types/ICrossSectionEditorTool";
import {IInteractionModeController} from "../_types/IInteractionModeController";

/**
 * Creates an add point handler for polygons
 * @param state The state to be controlled by this handler
 * @returns The create handler
 */
export function createAddHandler(
    state: CrossSectionEditorState
): IInteractionModeController<ICrossSectionEditorTool> {
    return {
        mode: ["add"],
        onMouseDown: (e, p) => {
            const crossSection = state.getSelectedCrossSection();
            const target = state.snap(p);
            const segment = crossSection.addPoint(target);

            state.selectHandle({segment, handle: "none"});
        },
        onMouseMove: (e, p) => {},
        onMouseUp: (s, p) => {},
    };
}

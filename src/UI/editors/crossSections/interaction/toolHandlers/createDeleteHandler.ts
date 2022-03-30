import {CrossSectionEditorState} from "../../../../../state/CrossSectionEditorState";
import {ICrossSectionEditorTool} from "../../../../../state/_types/ICrossSectionEditorTool";
import {IInteractionModeController} from "../_types/IInteractionModeController";

/**
 * Creates a delete point handler for polygons
 * @param state The state to be controlled by this handler
 * @returns The delete handler
 */
export function createDeleteHandler(
    state: CrossSectionEditorState
): IInteractionModeController<ICrossSectionEditorTool> {
    return {
        mode: ["delete"],
        onMouseDown: (e, p) => {
            if (e.button != 0) return;

            const crossSection = state.getSelectedCrossSection();
            const segments = crossSection.getSegments();
            if (segments.length <= 3) return;

            const closest = segments.reduce(
                (best, segment) => {
                    const handle = segment.getHandle(p);
                    if (handle.distance < best.distance) return {...handle, segment};
                    return best;
                },
                {distance: Infinity, segment: null, handle: null}
            );
            if (closest.segment) crossSection.deleteSegment(closest.segment);
        },
        onMouseMove: (e, p) => {},
        onMouseUp: (s, p) => {},
    };
}

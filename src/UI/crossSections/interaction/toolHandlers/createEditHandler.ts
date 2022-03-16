import {CrossSectionEditorState} from "../../../../state/CrossSectionEditorState";
import {ICrossSectionEditorTool} from "../../../../state/_types/ICrossSectionEditorTool";
import {IInteractionModeController} from "../_types/IInteractionModeController";

/**
 * Creates an edit handler for polygons
 * @param state The state to be controlled by this handler
 * @returns The create handler
 */
export function createEditHandler(
    state: CrossSectionEditorState
): IInteractionModeController<ICrossSectionEditorTool> {
    // TODO: define this elsewhere
    const reachDistance = 20;

    return {
        mode: ["edit"],
        onMouseDown: (e, p) => {
            const segments = state.getSelectedCrossSection().getSegments();
            const {scale} = state.getTransformation();
            const closest = segments.reduce(
                (best, segment) => {
                    const handle = segment.getHandle(p);
                    if (handle.distance < best.distance) return {...handle, segment};
                    return best;
                },
                {distance: Infinity, segment: null, handle: null}
            );

            if (
                closest.distance * scale < reachDistance &&
                closest.segment &&
                closest.handle
            )
                state.selectHandle(closest);
        },
        onMouseMove: (e, p) => {
            if (e.buttons != 1) return;

            const selected = state.getSelectedHandle();
            if (!selected) return;

            const {segment, handle} = selected;
            const target = state.snap(p);
            segment.moveHandle(handle, target);
        },
        onMouseUp: (s, p) => {
            state.selectHandle(null);
        },
    };
}

import {CrossSectionEditorState} from "../../../../../state/CrossSectionEditorState";
import {ICrossSectionEditorTool} from "../../../../../state/_types/ICrossSectionEditorTool";
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
            const closestHandle = segments.reduce(
                (best, segment) => {
                    const handle = segment.getHandle(p);
                    if (handle.distance < best.distance) return {...handle, segment};
                    return best;
                },
                {distance: Infinity, segment: null, handle: null}
            );

            if (
                closestHandle.segment &&
                closestHandle.handle &&
                closestHandle.distance * scale < reachDistance
            ) {
                state.selectHandle(closestHandle);
                return;
            }

            // If the handle is out of reach, select the closest segment
            const closestSegment = segments.reduce(
                (best, segment) => {
                    const distance = segment.getDistance(p);
                    if (distance < best.distance) return {distance, segment};
                    return best;
                },
                {distance: Infinity, segment: null}
            );
            if (closestSegment.segment && closestSegment.distance * scale < reachDistance)
                state.selectHandle({...closestSegment, handle: "none"});
        },
        onMouseMove: (e, p) => {
            if (![1, 2].includes(e.buttons)) return;

            const selected = state.getSelectedHandle();
            if (!selected || selected.handle == "none") return;

            const {segment, handle} = selected;
            const target = state.snap(p);
            segment.moveHandle(handle, target, e.buttons == 1);

            return true;
        },
        onMouseUp: (s, p) => {
            const selected = state.getSelectedHandle();
            if (selected) state.selectHandle({...selected, handle: "none"});
        },
    };
}

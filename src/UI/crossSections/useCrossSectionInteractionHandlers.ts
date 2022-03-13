import {useDataHook} from "model-react";
import {MouseEvent, useCallback} from "react";
import {useCrossSectionEditorState} from "./CrossSectionEditorStateContext";
import {IInteractionHandler} from "./plane/_types/IInteractionHandler";

export const useCrossSectionInteractionHandlers = () => {
    const reachDistance = 20;

    const state = useCrossSectionEditorState();
    const onMouseDown = useCallback<IInteractionHandler>(
        (e, p) => {
            const tool = state.getSelectedTool();
            if (tool == "edit") {
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
            }
        },
        [state]
    );

    const onMouseMove = useCallback<IInteractionHandler>(
        (e, p) => {
            if (e.buttons != 1) return;

            const tool = state.getSelectedTool();
            if (tool == "edit") {
                const selected = state.getSelectedHandle();
                if (!selected) return;

                const {segment, handle} = selected;
                segment.moveHandle(handle, p);
            }
        },
        [state]
    );

    const onMouseUp = useCallback<IInteractionHandler>(
        (s, p) => {
            const tool = state.getSelectedTool();
            if (tool == "edit") {
                state.selectHandle(null);
            }
        },
        [state]
    );

    return {onMouseDown, onMouseDrag: onMouseMove, onMouseUp};
};

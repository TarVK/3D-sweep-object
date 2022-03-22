import {useDataHook, useMemoDataHook} from "model-react";
import {FC, useCallback, useRef, useState} from "react";
import {BezierSegmentState} from "../../../state/BezierSegmentState";
import {StraightSegmentState} from "../../../state/StraightSegmentState";
import {Vec2} from "../../../util/Vec2";
import {useCrossSectionEditorState} from "../CrossSectionEditorStateContext";
import {CrossSectionApproximationPoints} from "./CrossSectionApproximationPoints";
import {CrossSectionPolygon} from "./CrossSectionPolygon";
import {BezierLineSegment} from "./segments/BezierLineSegment";
import {StraightLineSegment} from "./segments/StraightLineSegment";

export const CrossSection: FC = () => {
    const [h] = useDataHook();
    const state = useCrossSectionEditorState();
    const [size, setSize] = useState<Vec2>(new Vec2(0, 0));
    const containerRef = useRef<SVGElement>();

    const setContainer = useCallback((container: SVGElement | null) => {
        if (container) {
            const rect = container.getBoundingClientRect();
            setSize(new Vec2(rect.width, rect.height));
            containerRef.current = container;
        }
    }, []);

    const {scale, offset} = state.getTransformation(h);

    const [segments] = useMemoDataHook(
        h => {
            const segments = state.getSelectedCrossSection(h).getSegments(h);
            return segments
                .map((segment, i) => {
                    if (segment instanceof StraightSegmentState)
                        return <StraightLineSegment key={i} segment={segment} />;
                    if (segment instanceof BezierSegmentState)
                        return <BezierLineSegment key={i} segment={segment} />;
                    return undefined;
                })
                .filter(Boolean);
        },
        [state]
    );

    return (
        <svg
            style={{position: "absolute"}}
            width="100%"
            height="100%"
            ref={setContainer}
            viewBox={`${-offset.x / scale - size.x / scale / 2} ${
                offset.y / scale - size.y / scale / 2
            } ${size.x / scale} ${size.y / scale}`}>
            <CrossSectionPolygon />
            <CrossSectionApproximationPoints />
            {segments}
        </svg>
    );
};

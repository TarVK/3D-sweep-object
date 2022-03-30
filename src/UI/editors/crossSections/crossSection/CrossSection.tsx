import {useDataHook, useMemoDataHook} from "model-react";
import {FC, useCallback, useEffect, useRef, useState} from "react";
import {ArcSegmentState} from "../../../../state/segments/ArcSegmentState";
import {BezierSegmentState} from "../../../../state/segments/BezierSegmentState";
import {StraightSegmentState} from "../../../../state/segments/StraightSegmentState";
import {Vec2} from "../../../../util/Vec2";
import {useWindowSize} from "../../../hooks/useWindowSize";
import {useCrossSectionEditorState} from "../CrossSectionEditorStateContext";
import {CrossSectionApproximationPoints} from "./CrossSectionApproximationPoints";
import {CrossSectionPolygon} from "./CrossSectionPolygon";
import {ArcLineSegment} from "./segments/ArcLineSegment";
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

    const windowSize = useWindowSize();
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const update = () => {
            const rect = container.getBoundingClientRect();
            setSize(new Vec2(rect.width, rect.height));
        };
        update();
        setTimeout(update); // Requires rerender first
    }, [windowSize]);

    const {scale, offset} = state.getTransformation(h);

    const [segments] = useMemoDataHook(
        h => {
            const segments = state.getSelectedCrossSection(h).getSegments(h);
            const selectedHandle = state.getSelectedHandle(h);
            const selectedSegment = selectedHandle?.segment;
            return segments
                .map((segment, i) => {
                    const selected = selectedSegment == segment;
                    const props = {key: i, selected};
                    if (segment instanceof StraightSegmentState)
                        return <StraightLineSegment {...props} segment={segment} />;
                    if (segment instanceof BezierSegmentState)
                        return <BezierLineSegment {...props} segment={segment} />;
                    if (segment instanceof ArcSegmentState)
                        return <ArcLineSegment {...props} segment={segment} />;
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

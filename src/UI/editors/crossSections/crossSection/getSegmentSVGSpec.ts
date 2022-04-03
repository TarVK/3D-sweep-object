import {IDataHook} from "model-react";
import {ArcSegmentState} from "../../../../state/segments/ArcSegmentState";
import {BezierSegmentState} from "../../../../state/segments/BezierSegmentState";
import {ISegment} from "../../../../state/_types/ISegment";
import {Vec2} from "../../../../util/linearAlgebra/Vec2";

/**
 * Retrieves the SVG specification of a given segment.
 * Handles segment types: straight line and bezier, falls back to straight lines
 * @param segment The segment to get the svg specification for
 * @param includeStart Whether to include the start in the path
 * @param hook The hook to subscribe to changes
 * @returns The specification text
 */
export function getSegmentSVGSpec(
    segment: ISegment<Vec2>,
    includeStart?: boolean,
    hook?: IDataHook
): string {
    let path: string;

    if (segment instanceof BezierSegmentState) {
        const {x: x2, y: y2} = segment.getStartControl(hook);
        const {x: x3, y: y3} = segment.getEndControl(hook);
        const {x: x4, y: y4} = segment.getEnd(hook);
        path = `C ${x2} ${-y2}, ${x3} ${-y3}, ${x4} ${-y4}`;
    } else if (segment instanceof ArcSegmentState) {
        const spec = segment.getSpec(hook);
        const {x: x2, y: y2} = segment.getEnd(hook);
        if (spec.origin) {
            const {radius, delta} = spec;
            const largeArcFlag = Math.abs(delta) > Math.PI ? 1 : 0;
            const sweepFlag = delta < 0 ? 1 : 0;
            path = `A ${radius} ${radius}, 0, ${largeArcFlag} ${sweepFlag}, ${x2} ${-y2}`;
        } else path = `L ${x2} ${-y2}`;
    } else {
        const {x: x2, y: y2} = segment.getEnd(hook);
        path = `L ${x2} ${-y2}`;
    }

    if (includeStart) {
        const {x: x1, y: y1} = segment.getStart(hook);
        path = `M ${x1} ${-y1} ` + path;
    }

    return path;
}

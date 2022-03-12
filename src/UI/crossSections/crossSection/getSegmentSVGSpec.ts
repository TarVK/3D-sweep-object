import {BezierSegmentState} from "../../../state/BezierSegmentState";
import {ISegment} from "../../../state/_types/ISegment";
import {Vec2} from "../../../util/Vec2";

/**
 * Retrieves the SVG specification of a given segment.
 * Handles segment types: straight line and bezier, falls back to straight lines
 * @param segment The segment to get the svg specification for
 * @returns The specification text
 */
export function getSegmentSVGSpec(segment: ISegment<Vec2>): string {
    if (segment instanceof BezierSegmentState) {
        const {x: x2, y: y2} = segment.getStartControl();
        const {x: x3, y: y3} = segment.getEndControl();
        const {x: x4, y: y4} = segment.getEnd();
        return `C ${x2} ${-y2}, ${x3} ${-y3}, ${x4} ${-y4}`;
    }

    const {x: x2, y: y2} = segment.getEnd();
    return `L ${x2} ${-y2}`;
}

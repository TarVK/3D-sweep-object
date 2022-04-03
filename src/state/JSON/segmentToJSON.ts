import {IDataHook} from "model-react";
import {Vec2} from "../../util/linearAlgebra/Vec2";
import {Vec3} from "../../util/linearAlgebra/Vec3";
import {ArcSegmentState} from "../segments/ArcSegmentState";
import {BezierSegmentState} from "../segments/BezierSegmentState";
import {ISegment} from "../_types/ISegment";
import {IBezierJSON} from "./_types/IBezierJSON";
import {ISegmentJSON} from "./_types/ISegmentJSON";
import {IStraightLineJSON} from "./_types/IStraightLineJSON";
import {TVecToPoint} from "./_types/TVecToPoint";

/**
 * Transforms a given segment state into a plain JSON representation
 * @param segment The segment to be transformed to JSON
 * @param hook The hook to subscribe to changes
 * @returns The pure JSON representation of the segment
 */
export function segmentToJSON<P extends Vec2 | Vec3>(
    segment: ISegment<P>,
    hook?: IDataHook
): ISegmentJSON<TVecToPoint<P>> {
    if (segment instanceof BezierSegmentState)
        return bezierSegmentToJSON<P>(segment, hook);
    if (segment instanceof ArcSegmentState) {
        return {
            type: "arc",
            start: convertPoint(segment.getStart(hook)),
            control: convertPoint(segment.getControl(hook)) as any,
            end: convertPoint(segment.getEnd(hook)),
        };
    }

    const straightJSON: IStraightLineJSON<TVecToPoint<P>> = {
        type: "straight",
        start: convertPoint(segment.getStart(hook)),
        end: convertPoint(segment.getEnd(hook)),
    };
    return straightJSON;
}

/**
 * Transforms a given bezier segment state into a plain JSON representation
 * @param segment The segment to be transformed to JSON
 * @param hook The hook to subscribe to changes
 * @returns The pure JSON representation of the segment
 */
export function bezierSegmentToJSON<P extends Vec2 | Vec3>(
    segment: BezierSegmentState<P>,
    hook?: IDataHook
): IBezierJSON<TVecToPoint<P>> {
    const bezierJSON: IBezierJSON<TVecToPoint<P>> = {
        type: "bezier",
        start: convertPoint(segment.getStart(hook)),
        startControl: convertPoint(segment.getStartControl(hook)),
        endControl: convertPoint(segment.getEndControl(hook)),
        end: convertPoint(segment.getEnd(hook)),
    };
    return bezierJSON;
}

const convertPoint = <P extends Vec2 | Vec3>(vec: P): TVecToPoint<P> => {
    if (vec instanceof Vec3) {
        return {
            x: vec.x,
            y: vec.y,
            z: vec.z,
        } as TVecToPoint<P>;
    }
    return {
        x: vec.x,
        y: vec.y,
    } as TVecToPoint<P>;
};

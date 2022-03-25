import {IDataHook} from "model-react";
import {Vec2} from "../../util/Vec2";
import {Vec3} from "../../util/Vec3";
import {BezierSegmentState} from "../BezierSegmentState";
import {ISegment} from "../_types/ISegment";
import {I2DPointJSON} from "./_types/I2DPointJSON";
import {I3DPointJSON} from "./_types/I3DPointJSON";
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

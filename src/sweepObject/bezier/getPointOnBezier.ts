import {Vec2} from "../../util/Vec2";
import {Vec3} from "../../util/Vec3";
import {IBezier} from "./_types/IBezier";

/**
 * Retrieves the point in the bezier corresponding to the given position fraction
 * @param bezier The bezier curve to get a point on
 * @param position The fraction between 0 and 1
 * @returns The point on the bezier curve
 */
export function getPointOnBezier<D extends Vec2 | Vec3>(
    bezier: IBezier<D>,
    position: number
): D {
    const p = position;
    const pi = 1 - p;

    return bezier.start
        .mul(pi * pi * pi)
        .add(bezier.startControl.mul(3 * pi * pi * p) as Vec3)
        .add(bezier.endControl.mul(3 * pi * p * p) as Vec3)
        .add(bezier.end.mul(p * p * p) as Vec3) as D;
}

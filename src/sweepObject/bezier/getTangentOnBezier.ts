import {Vec2} from "../../util/Vec2";
import {Vec3} from "../../util/Vec3";
import {IBezier} from "./_types/IBezier";

/**
 * Retrieves the tangent on the bezier corresponding to the given position fraction
 * @param bezier The bezier curve to get a point on
 * @param position The fraction between 0 and 1
 * @returns The tangent on the bezier curve
 */
export function getTangentOnBezier<D extends Vec2 | Vec3>(
    bezier: IBezier<D>,
    position: number
): D {
    const p = position;
    const pi = 1 - p;

    return bezier.start
        .mul(-3 * pi * pi)
        .add(bezier.startControl.mul(3 * (p - 1) * (3 * p - 1)) as Vec3)
        .add(bezier.endControl.mul(3 * (2 * p - 3 * p * p)) as Vec3)
        .add(bezier.end.mul(3 * p * p) as Vec3) as D;
}

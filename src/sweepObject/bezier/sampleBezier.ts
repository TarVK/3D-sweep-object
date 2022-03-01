import {Vec2} from "../../util/Vec2";
import {Vec3} from "../../util/Vec3";
import {getPointOnBezier} from "./getPointOnBezier";
import {getTangentOnBezier} from "./getTangentOnBezier";
import {IBezier} from "./_types/IBezier";
import {IBezierNode} from "./_types/IBezierNode";

/**
 * Samples a bezier curve using with the given number of points
 * @param bezier The specification of the bezier curve
 * @param count The number of points to be sampled
 * @returns The list of sample points
 */
export function sampleBezier<D extends Vec2 | Vec3>(
    bezier: IBezier<D>,
    count: number
): IBezierNode<D>[] {
    const startPoint: D = bezier.start;
    const dir: D = getTangentOnBezier(bezier, 0);

    const out: IBezierNode<D>[] = [{point: startPoint, dir}];

    let frac = 0;
    const fracIncrement = 1 / (count - 1);
    for (let i = 1; i < count - 1; i++) {
        frac += fracIncrement;
        const point = getPointOnBezier(bezier, frac);
        const dir = getTangentOnBezier(bezier, frac);
        out.push({point, dir});
    }

    if (count > 1) {
        const point = bezier.end;
        const dir = getTangentOnBezier(bezier, 1);
        out.push({point, dir});
    }

    return out;
}

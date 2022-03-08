import {Vec2} from "../Vec2";
import {Vec3} from "../Vec3";
import {getPointOnBezier} from "./getPointOnBezier";
import {IBezier} from "./_types/IBezier";

/**
 * Projects the given point to the closest point on the bezier
 * @param bezier The bezier to project to
 * @param point The point to be projected
 */
export function projectOnBezier<D extends Vec2 | Vec3>(
    bezier: IBezier<D>,
    point: D
): {point: D; position: number} {
    const target = point as Vec3; // Prevents casting later

    const points = 100;
    const steps = points - 1;
    const LUT = new Array(points)
        .fill(0)
        .map((_, i) => getPointOnBezier(bezier, i / steps));

    // Get the closest point from a rough check
    const coarseClosest = LUT.reduce(
        (best, p, i) => {
            const distance = p.sub(target).length();
            return best.distance > distance ? {point: p, index: i, distance} : best;
        },
        {point, index: -1, distance: Infinity}
    );

    // Perform a fine check
    const startFrac = (coarseClosest.index - 1) / steps;
    const endFrac = (coarseClosest.index + 1) / steps;
    const stepSize = 0.1 / steps;

    let closest = {
        frac: coarseClosest.index / steps,
        point: coarseClosest.point,
        distance: coarseClosest.distance,
    };

    for (let t = startFrac; t < endFrac; t += stepSize) {
        const p = getPointOnBezier(bezier, t);
        const distance = p.sub(target).length();

        if (distance < closest.distance)
            closest = {
                frac: t,
                point: p,
                distance,
            };
    }

    if (closest.frac < 0) return {point: bezier.start, position: 0};
    if (closest.frac > 1) return {point: bezier.end, position: 1};
    return {point: closest.point, position: closest.frac};
}

import {Vec2} from "../linearAlgebra/Vec2";
import {Vec3} from "../linearAlgebra/Vec3";
import {getPointOnBezier} from "./getPointOnBezier";
import {getTangentOnBezier} from "./getTangentOnBezier";
import {IBezier} from "./_types/IBezier";
import {IBezierApproximationConfig} from "./_types/IBezierApproximationConfig";
import {IBezierNode} from "./_types/IBezierNode";

/**
 * Approximates a bezier curve using a list of straight line connected points
 * @param bezier The specification of the bezier curve
 * @param config The configuration for the approximation
 * @returns The list of points that approximate this bezier
 */
export function approximateBezier<D extends Vec2 | Vec3>(
    bezier: IBezier<D>,
    config: IBezierApproximationConfig
): IBezierNode<D>[] {
    const {spacing} = config;

    let frac = 0;
    let lastPoint: D = bezier.start;
    let dir: D = getTangentOnBezier(bezier, frac);
    let lastSpeed = dir.length();

    const out: IBezierNode<D>[] = [{point: lastPoint, dir}];

    while (frac < 1) {
        const underEstimate = findUnderEstimate(
            bezier,
            lastPoint,
            lastSpeed,
            frac,
            config
        );
        const remaining = spacing - underEstimate.distance;

        let linearInterpolation: number = 0;
        if (remaining > 0) {
            const overestimation = findOverEstimate(
                bezier,
                underEstimate.point,
                underEstimate.speed,
                underEstimate.frac,
                remaining
            );

            linearInterpolation =
                ((overestimation.frac - underEstimate.frac) * remaining) /
                overestimation.distance;
        }

        // Update the points and add to the output
        frac = underEstimate.frac + linearInterpolation;
        lastPoint = getPointOnBezier(bezier, frac);
        dir = getTangentOnBezier(bezier, frac);
        lastSpeed = dir.length();

        if (frac < 1) out.push({point: lastPoint, dir});
    }

    lastPoint = bezier.end;
    dir = getTangentOnBezier(bezier, 1);
    out.push({point: lastPoint, dir});

    return out;
}

/**
 * Finds an underestimation of the next fraction position to achieve the requested distance
 * @param bezier The bezier curve to use
 * @param last The previous point that's part of the approximation
 * @param lastSpeed The speed that corresponds to the last point
 * @param lastFrac The previous fraction that the point corresponds to
 * @param config The configuration for the approximation
 * @returns The obtained underestimation
 */
function findUnderEstimate<D extends Vec2 | Vec3>(
    bezier: IBezier<D>,
    last: D,
    lastSpeed: number,
    lastFrac: number,
    {spacing, approximationAttempts = 3}: IBezierApproximationConfig
): {point: D; speed: number; frac: number; distance: number} {
    let speed = lastSpeed;
    let frac = lastFrac;
    let point = last;
    let totalDistance = 0;
    let remaining = spacing;

    for (let i = 0; i < approximationAttempts; i++) {
        const incEstimate = remaining / speed;

        // Decrease estimation fraction until the estimation no longer overshoots
        let estimateFrac = 1;
        let overshot: boolean;
        let newFrac: number;
        let distance: number;
        let newPoint: D;
        do {
            const inc = incEstimate * estimateFrac;
            newFrac = frac + inc;
            newPoint = getPointOnBezier(bezier, newFrac);
            distance = newPoint.sub(point as Vec3).length();
            overshot = distance > remaining;

            estimateFrac /= 2;
        } while (overshot);

        remaining -= distance;
        point = newPoint;
        frac = newFrac;
        const direction = getTangentOnBezier(bezier, frac);
        speed = direction.length();
        totalDistance += distance;
    }

    return {speed, frac, point, distance: totalDistance};
}

/**
 * Finds an overestimation of the next fraction position to achieve the requested distance
 * @param bezier The bezier curve to use
 * @param underEstimate The underestimation of the next point
 * @param underEstimateSpeed The bezier speed corresponding to the underestimate
 * @param underEstimateFrac The fraction of the underestimation
 * @param remaining The minimum distance to be away from the underestimate
 * @returns The obtained overestimation
 */
function findOverEstimate<D extends Vec2 | Vec3>(
    bezier: IBezier<D>,
    underEstimate: D,
    underEstimateSpeed: number,
    underEstimateFrac: number,
    remaining: number
): {point: D; frac: number; distance: number} {
    // Find a small value that overshoots the distance
    const incEstimate = remaining / underEstimateSpeed;
    let distance = 0;
    let estimateFrac = 1;
    let overshot: boolean;
    let newFrac: number;
    let nextPoint: D;
    do {
        const inc = incEstimate * estimateFrac;
        newFrac = underEstimateFrac + inc;
        nextPoint = getPointOnBezier(bezier, newFrac);
        distance = nextPoint.sub(underEstimate as Vec3).length();
        overshot = distance > remaining;

        estimateFrac *= 2;
    } while (!overshot);

    return {point: nextPoint, frac: newFrac, distance};
}

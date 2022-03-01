import {Vec3} from "../util/Vec3";
import {approximateBezier} from "./bezier/approximateBezier";
import {sampleBezier} from "./bezier/sampleBezier";
import {IBezierNode} from "./bezier/_types/IBezierNode";
import {ISweepLine} from "./_types/ISweepLine";

/**
 * Approximates the given sweep line
 * @param sweepLine The sweep line to be approximated
 * @param sampleCount The number of points to sample
 * @returns The approximation points
 */
export function approximateSweepLine(
    sweepLine: ISweepLine,
    sampleCount: number
): IBezierNode<Vec3>[] {
    const nodes: IBezierNode<Vec3>[] = [];
    let first = true;
    for (let segment of sweepLine) {
        const points = sampleBezier(segment, sampleCount);
        const dropFirstDuplicatePoint = !first;
        if (dropFirstDuplicatePoint) points.shift();
        nodes.push(...points);
        first = false;
    }

    return nodes;
}

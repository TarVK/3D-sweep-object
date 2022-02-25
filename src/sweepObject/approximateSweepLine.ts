import {Vec3} from "../util/Vec3";
import {approximateBezier} from "./bezier/approximateBezier";
import {IBezierNode} from "./bezier/_types/IBezierNode";
import {ISweepLine} from "./_types/ISweepLine";

/**
 * Approximates the given sweep line
 * @param sweepLine The sweep line to be approximated
 * @param spacing The distance between approximation points
 * @returns The approximation points
 */
export function approximateSweepLine(
    sweepLine: ISweepLine,
    spacing: number
): IBezierNode<Vec3>[] {
    const nodes: IBezierNode<Vec3>[] = [];
    let first = true;
    for (let segment of sweepLine) {
        const points = approximateBezier(segment, {spacing: spacing});
        const dropFirstDuplicatePoint = !first;
        if (dropFirstDuplicatePoint) points.shift();
        nodes.push(...points);
        first = false;
    }

    return nodes;
}

import {Vec2} from "../linearAlgebra/Vec2";

/**
 * Checks whether c lies to the left (-1), right (1) or on (0) segment ab.
 * @param start The start point of the segment
 * @param end The end point of the segment
 * @param r The point to check
 * @returns The side that the point is on
 */
export function getSideOfLine(start: Vec2, end: Vec2, r: Vec2): -1 | 0 | 1 {
    const res = (end.x - start.x) * (r.y - start.y) - (end.y - start.y) * (r.x - start.x);
    return res < 0 ? 1 : res > 0 ? -1 : 0;
}

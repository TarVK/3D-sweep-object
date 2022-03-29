import {Vec2} from "../Vec2";

/**
 * Finds teh intersection by two lines
 * @param a The line passing through the given points
 * @param b The line passing through the given points
 * @returns The intersection point if there's any
 */
export function getLineIntersection(
    a: {start: Vec2; end: Vec2},
    b: {start: Vec2; end: Vec2}
): Vec2 | undefined {
    // src: https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection#Given_two_points_on_each_line
    const D =
        (a.start.x - a.end.x) * (b.start.y - b.end.y) -
        (a.start.y - a.end.y) * (b.start.x - b.end.x);
    if (D == 0) return undefined;

    const ai = a.start.x * a.end.y - a.start.y * a.end.x;
    const bi = b.start.x * b.end.y - b.start.y * b.end.x;
    const x = ai * (b.start.x - b.end.x) - (a.start.x - a.end.x) * bi;
    const y = ai * (b.start.y - b.end.y) - (a.start.y - a.end.y) * bi;

    return new Vec2(x / D, y / D);
}

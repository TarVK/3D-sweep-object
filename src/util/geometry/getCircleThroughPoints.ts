import {Vec2} from "../Vec2";
import {getLineIntersection} from "./getLineIntersection";

/**
 * Calculates what circle passes through all 3 given points
 * @param a The first point that the circle should intersect
 * @param b The second point that the circle should intersect
 * @param c The third point that the circle should intersect
 * @returns The circle that intersects all points, if such a circle exists
 */
export function getCircleThroughPoints(
    a: Vec2,
    b: Vec2,
    c: Vec2
): {radius: number; origin: Vec2} | undefined {
    if (a.equals(b) || b.equals(c) || a.equals(c)) return;

    const centerAB = a.add(b).mul(0.5);
    const deltaAB = a.sub(b);
    const pointOnNormalAB = centerAB.add(-deltaAB.y, deltaAB.x);

    const centerBC = b.add(c).mul(0.5);
    const deltaBC = b.sub(c);
    const pointOnNormalBC = centerBC.add(-deltaBC.y, deltaBC.x);

    const intersection = getLineIntersection(
        {start: centerAB, end: pointOnNormalAB},
        {start: centerBC, end: pointOnNormalBC}
    );
    if (!intersection) return;

    const radius = intersection.sub(a).length();
    return {radius, origin: intersection};
}

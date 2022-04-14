import {ICrossSection} from "../../sweepOperation/core/_types/ICrossSection";
import {Vec2} from "../linearAlgebra/Vec2";
import {getSideOfLine} from "./getSideOfLine";

/**
 * Makes sure that the returned cross section is defined in counter clockwise point order
 * @param polygon The polygon to be normalized to be CCW
 * @returns The normalized cross section
 */
export function makePolygonCCW(polygon: ICrossSection): ICrossSection {
    const l = polygon.length;
    let {index: topLeftIndex, point: topLeft} = getTopLeftPoint(polygon);

    const prev = polygon[(topLeftIndex + l - 1) % l];
    const next = polygon[(topLeftIndex + 1) % l];
    const isCounterClockWise = getSideOfLine(prev, topLeft, next) == -1;

    if (isCounterClockWise) return polygon;
    // Reverse the list, but ensure that the first point remains first
    else return [...polygon.slice(1), polygon[0]].reverse();
}

/**
 * Retrieves the left most point, and among the left most points the top-most point of a polygon
 * @param polygon The polygon for which get the top left most point
 * @returns The top left most point
 */
function getTopLeftPoint(polygon: ICrossSection): {index: number; point: Vec2} {
    const l = polygon.length;
    let topLeftIndex = 0;
    let topLeft = polygon[topLeftIndex];
    for (let i = 1; i < l; i++) {
        const point = polygon[i];
        if (point.x < topLeft.x || (point.x == topLeft.x && point.y > topLeft.y)) {
            topLeft = point;
            topLeftIndex = i;
        }
    }

    return {index: topLeftIndex, point: topLeft};
}

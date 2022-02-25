import {ICrossSection} from "./_types/ICrossSection";
import earcut from "earcut";
import {IFace} from "./_types/IMesh";

/**
 * Calculates the indices of all triangles that form a triangulation of the cross section
 * @param crossSection The cross section to be triangulated
 * @returns The triangle index list
 */
export function calculateCrossSectionTriangulation(crossSection: ICrossSection): IFace[] {
    console.log(crossSection.flatMap(point => [point.x, point.y]));
    const indices = earcut(
        crossSection.flatMap(point => [point.x, point.y]),
        []
    );
    const points: IFace[] = [];
    for (let i = 0; i < indices.length; i += 3)
        points.push([indices[i], indices[i + 1], indices[i + 2]]);
    return points;
}

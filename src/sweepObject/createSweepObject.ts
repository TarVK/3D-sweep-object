import {IFace, IMesh} from "./_types/IMesh";
import {ISweepObjectSpecification} from "./_types/ISweepObjectSpecification";
import {approximateSweepLine} from "./approximateSweepLine";
import {calculateCrossSectionTriangulation} from "./calculateCrossSectionTriangulation";
import {createCrossSectionTransformer} from "./createCrossSectionTransformer";
import {Point3D} from "../util/Point3D";

/**
 * Creates the mesh from a given sweep object specification
 * @param spec The specification for the sweep to perform
 * @returns The created mesh
 */
export function createSweepObject({
    sweepLine,
    sampleCount,
    crossSection,
}: ISweepObjectSpecification): IMesh {
    const mesh: IMesh = {
        faces: [],
        points: [],
    };
    const crossSectionFaces = calculateCrossSectionTriangulation(crossSection);

    const crossSection3D = crossSection.map(point => new Point3D(point.x, point.y, 0));
    const transform = createCrossSectionTransformer();

    // Create the start of the mesh
    const nodes = approximateSweepLine(sweepLine, sampleCount);
    const startPoints = transform(crossSection3D, nodes[0].dir, nodes[0].point);
    mesh.points.push(...startPoints);
    const reverseFaces = crossSectionFaces.map(([i1, i2, i3]) => [i2, i1, i3] as IFace);
    mesh.faces.push(...reverseFaces);

    // Go through the nodes along the sweep line and connect cross-sections
    for (let {dir, point} of nodes.slice(1)) {
        const startIndex = mesh.points.length;
        const points = transform(crossSection3D, dir, point);
        mesh.points.push(...points);
        const length = points.length;
        for (let i = 0; i < length; i++) {
            const ring1Index1 = startIndex - length + i;
            const ring1Index2 = startIndex - length + ((i + 1) % length);
            const ring2Index1 = startIndex + i;
            const ring2Index2 = startIndex + ((i + 1) % length);

            mesh.faces.push([ring2Index1, ring1Index1, ring1Index2]);
            mesh.faces.push([ring1Index2, ring2Index2, ring2Index1]);
        }
    }

    // Create the end of the mesh
    const offset = mesh.points.length - crossSection.length;
    mesh.faces.push(
        ...crossSectionFaces.map(
            ([i1, i2, i3]) => [i1 + offset, i2 + offset, i3 + offset] as IFace
        )
    );

    return mesh;
}

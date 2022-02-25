import {IFace, IMesh} from "./_types/IMesh";
import {ISweepObjectSpecification} from "./_types/ISweepObjectSpecification";
import {approximateSweepLine} from "./approximateSweepLine";
import {calculateCrossSectionTriangulation} from "./calculateCrossSectionTriangulation";
import {transformCrossSection} from "./transformCrossSection";

/**
 * Creates the mesh from a given sweep object specification
 * @param spec The specification for the sweep to perform
 * @returns The created mesh
 */
export function createSweepObject({
    sweepLine,
    sweepPointDistance,
    crossSection,
}: ISweepObjectSpecification): IMesh {
    const mesh: IMesh = {
        faces: [],
        points: [],
    };
    const crossSectionFaces = calculateCrossSectionTriangulation(crossSection);

    // Create the start of the mesh
    const nodes = approximateSweepLine(sweepLine, sweepPointDistance);
    const startPoints = transformCrossSection(crossSection, nodes[0].dir, nodes[0].point);
    mesh.points.push(...startPoints);
    mesh.faces.push(...crossSectionFaces);

    // Go through the nodes along the sweep line and connect cross-sections
    for (let {dir, point} of nodes.slice(1)) {
        const points = transformCrossSection(crossSection, dir, point);
        mesh.points.push(...points);
        const startIndex = mesh.points.length;
        const length = points.length;
        for (let i = 0; i < length; i++) {
            const ring1Index1 = startIndex + i;
            const ring1Index2 = (ring1Index1 + 1) % length;
            const ring2Index1 = ring1Index1 + length;
            const ring2Index2 = (ring2Index1 + 1) % length;

            mesh.faces.push([ring1Index1, ring2Index1, ring1Index2]);
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

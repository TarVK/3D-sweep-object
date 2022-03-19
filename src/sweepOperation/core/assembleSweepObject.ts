import {calculateCrossSectionTriangulation} from "./calculateCrossSectionTriangulation";
import {createCrossSectionTransformer} from "./createCrossSectionTransformer";
import {ICrossSectionNode} from "./_types/ICrossSectionNode";
import {IFace, IMesh} from "../_types/IMesh";

/**
 * Creates a mesh from a list of cross sections and their position and direction in 3d space
 * @param nodes The cross section nodes to create the mesh from
 * @returns The assembled mesh
 */
export function assembleSweepObject(nodes: ICrossSectionNode[]): IMesh {
    if (nodes.length < 1) throw new Error("At least 2 nodes should be provided");

    const mesh: IMesh = {
        faces: [],
        points: [],
    };
    const transform = createCrossSectionTransformer();

    // Create the first face
    const firstNode = nodes[0];
    const firstCrossSectionFaces = calculateCrossSectionTriangulation(
        firstNode.crossSection
    );
    const firstCrossSectionReverseFaces = firstCrossSectionFaces.map(
        ([i1, i2, i3]) => [i2, i1, i3] as IFace
    );
    const startPoints = transform(firstNode);

    mesh.points.push(...startPoints);
    mesh.faces.push(...firstCrossSectionReverseFaces);

    mesh.points.push(...startPoints);

    // Go through the nodes along the sweep and connect the vertices
    let prevPointCount = startPoints.length;
    for (let node of nodes.slice(1)) {
        const points = transform(node);
        const pointCount = points.length;
        if (pointCount != prevPointCount)
            throw new Error("Each cross section should have the same number of points");
        prevPointCount = pointCount;

        const startIndex = mesh.points.length;
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

    // Create the end face
    const lastNode = nodes[nodes.length - 1];
    const lastCrossSectionFaces = calculateCrossSectionTriangulation(
        lastNode.crossSection
    );
    mesh.points.push(...mesh.points.slice(-startPoints.length));
    const offset = mesh.points.length - lastNode.crossSection.length;
    mesh.faces.push(
        ...lastCrossSectionFaces.map(
            ([i1, i2, i3]) => [i1 + offset, i2 + offset, i3 + offset] as IFace
        )
    );

    return mesh;
}

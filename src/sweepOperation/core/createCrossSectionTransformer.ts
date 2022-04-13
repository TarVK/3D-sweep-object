import {Point3D} from "../../util/linearAlgebra/Point3D";
import {createMatrixTransformer} from "./createMatrixTransformer";
import {ICrossSectionTransformer} from "./_types/ICrossSectionTransformer";

/**
 * Creates a function that can be used to get a sequence of cross sections, such that the rotation on the free-axis is consistent
 * @returns The function that can be used to apply the transformation
 */
export function createCrossSectionTransformer(): ICrossSectionTransformer {
    const getTransform = createMatrixTransformer();
    return ({crossSection, ...spec}, skipUpdate) => {
        const crossSection3D = crossSection.map(
            point => new Point3D(point.x, point.y, 0)
        );
        const transform = getTransform(spec, skipUpdate);

        return crossSection3D.map(point => transform.mul(point).toCartesian());
    };
}

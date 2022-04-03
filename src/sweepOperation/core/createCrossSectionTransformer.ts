import {Point3D, RotateZ, Scale, Translate} from "../../util/linearAlgebra/Point3D";
import {Vec3} from "../../util/linearAlgebra/Vec3";
import {transformRotationMatrix} from "./transformRotationMatrix";
import {ICrossSectionTransformer} from "./_types/ICrossSectionTransformer";

/**
 * Creates a function that can be used to get a sequence of cross sections, such that the rotation on the free-access is consistent
 * @returns The function that can be used to apply the transformation
 */
export function createCrossSectionTransformer(): ICrossSectionTransformer {
    let rotationMatrix = Translate(0, 0, 0); // The identity matrix
    let oldDir = new Vec3(0, 0, 1);
    return ({crossSection, direction, position, angle, scale}) => {
        const crossSection3D = crossSection.map(
            point => new Point3D(point.x, point.y, 0)
        );
        rotationMatrix = transformRotationMatrix(rotationMatrix, oldDir, direction);
        oldDir = direction;

        const translate = Translate(position);
        const preProcess = Scale(scale).mul(RotateZ(angle));
        const transform = translate.mul(rotationMatrix).mul(preProcess);
        return crossSection3D.map(point => transform.mul(point).toCartesian());
    };
}

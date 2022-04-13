import {RotateZ, Scale, Translate} from "../../util/linearAlgebra/Point3D";
import {Vec3} from "../../util/linearAlgebra/Vec3";
import {transformRotationMatrix} from "./transformRotationMatrix";
import {IMatrixTransformer} from "./_types/IMatrixTransformer";

/**
 * Creates a function that can be used to get a sequence of transformation matrices, such that the rotation on free-axis is consistent
 * @returns The function that can be used to retrieve the transformation
 */
export function createMatrixTransformer(): IMatrixTransformer {
    let rotationMatrix = Translate(0, 0, 0); // The identity matrix
    let oldDir = new Vec3(0, 0, 1);
    return ({direction, position, angle, scale}, skipUpdate) => {
        const newRotationMatrix = transformRotationMatrix(
            rotationMatrix,
            oldDir,
            direction
        );

        const translate = Translate(position);
        const preProcess = Scale(scale).mul(RotateZ(angle));
        const transform = translate.mul(newRotationMatrix).mul(preProcess);

        if (!skipUpdate) {
            rotationMatrix = newRotationMatrix;
            oldDir = direction;
        }

        return transform;
    };
}

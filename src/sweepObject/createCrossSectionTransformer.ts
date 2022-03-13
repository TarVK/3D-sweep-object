import {Translate} from "../util/Point3D";
import {Vec3} from "../util/Vec3";
import {transformRotationMatrix} from "./transformRotationMatrix";
import {ICrossSectionTransformer} from "./_types/ICrossSectionTransformer";

/**
 * Creates a function that can be used to get a sequence of cross sections, such that the rotation on the free-access is consistent
 * @returns The function that can be used to apply the transformation
 */
export function createCrossSectionTransformer(): ICrossSectionTransformer {
    let rotationMatrix = Translate(0, 0, 0); // The identity matrix
    let oldDir = new Vec3(0, 0, 1);
    return (crossSection, dir, origin) => {
        rotationMatrix = transformRotationMatrix(rotationMatrix, oldDir, dir);
        oldDir = dir;

        const translate = Translate(origin);
        const transform = translate.mul(rotationMatrix);
        return crossSection.map(point => transform.mul(point).toCartesian());
    };
}

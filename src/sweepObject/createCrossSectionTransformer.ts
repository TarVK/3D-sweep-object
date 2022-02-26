import {Mat4} from "../util/Mat4";
import {Point3D, Translate} from "../util/Point3D";
import {Vec3} from "../util/Vec3";
import {createRotationMatrix} from "./createRotationMatrix";
import {transformRotationMatrix} from "./transformRotationMatrix";
import {ICrossSectionTransformer} from "./_types/ICrossSectionTransformer";

/**
 * Creates a function that can be used to get a sequence of cross sections, such that the rotation on the free-access is consistent
 * @returns The function that can be used to apply the transformation
 */
export function createCrossSectionTransformer(): ICrossSectionTransformer {
    let rotationMatrix: Mat4 | undefined;
    let oldDir: Vec3 | undefined;
    return (crossSection, dir, origin) => {
        if (!rotationMatrix || !oldDir) {
            rotationMatrix = createRotationMatrix(dir);
            oldDir = dir;
        } else {
            rotationMatrix = transformRotationMatrix(rotationMatrix, oldDir, dir);
            oldDir = dir;
        }

        const translate = Translate(origin);
        const transform = translate.mul(rotationMatrix);
        return crossSection.map(point => transform.mul(point).toCartesian());
    };
}

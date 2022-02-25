import {Mat4} from "../util/Mat4";
import {Point3D, RotateX, RotateY, RotateZ} from "../util/Point3D";
import {Vec3} from "../util/Vec3";

/**
 * Creates a rotation matrix such that the point (0, 0, 1) is pointed along the direction vector
 * @param direction The direction to rotate towards
 * @returns The created rotation matrix
 */
export function createRotationMatrix(direction: Vec3): Mat4 {
    const hDir = Point3D.create(direction);

    const xAngle = Math.atan2(hDir.z, hDir.y) - Math.PI / 2;
    const rotateX = RotateX(xAngle);

    const reverseX = RotateX(-xAngle);
    const hDir2 = reverseX.mul(hDir);

    const yAngle = Math.atan2(hDir2.x, hDir2.z);
    const rotateY = RotateY(yAngle);

    return rotateX.mul(rotateY);
}

import {Mat4} from "../util/Mat4";
import {Rotate} from "../util/Point3D";
import {Vec3} from "../util/Vec3";
import {Vec4} from "../util/Vec4";

/**
 * Rotates the given rotation matrix to point in the new direction
 * @param rotationMatrix The rotation matrix to derive a new matrix from
 * @param oldDirection The old direction that the rotation matrix represents
 * @param newDirection The direction that the new rotation matrix should represent
 * @returns The created rotation matrix
 */
export function transformRotationMatrix(
    rotationMatrix: Mat4,
    oldDirection: Vec3,
    newDirection: Vec3
): Mat4 {
    oldDirection = oldDirection.normalize();
    newDirection = newDirection.normalize();
    const perpendicular = oldDirection.cross(newDirection).normalize();
    const cosAngle = oldDirection.dot(newDirection);
    const angle = Math.acos(cosAngle);
    const sinAngleHalf = Math.sin(angle / 2);
    const cosAngleHalf = Math.cos(angle / 2);
    const quaternion = new Vec4(
        sinAngleHalf * perpendicular.x,
        sinAngleHalf * perpendicular.y,
        sinAngleHalf * perpendicular.z,
        cosAngleHalf
    );
    const rotate = Rotate(quaternion);
    return rotate.mul(rotationMatrix);
}

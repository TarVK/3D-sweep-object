import {Mat4} from "./Mat4";
import {Vec3} from "./Vec3";
import {Vec4} from "./Vec4";

/** The homogenous representation of 3D points */
export class Point3D extends Vec4 {
    /**
     * Creates a new 3 dimensional vector
     * @param x The x component of the point
     * @param y The y component of the point
     * @param z The z component of the point
     * @param w The w component of the point
     */
    public constructor(x: number, y: number, z: number, w: number = 1) {
        super(x, y, z, w);
    }

    /**
     * Creates a new vector of this class. Should be overridden by classes extending this class
     * @param x The x component of the vector
     * @param y The y component of the vector
     * @param z The z component of the vector
     * @param w The w component of the vector
     * @returns The created vector
     * @override
     */
    public create(x: number, y: number, z: number, w: number): this {
        return new Point3D(x, y, z, w) as any;
    }

    /**
     * Converts this homogenous 3D point to its cartesian representation
     * @returns The cartesian representation
     */
    public toCartesian(): Vec3 {
        return new Vec3(this.x / this.w, this.y / this.w, this.z / this.w);
    }

    /**
     * Given either a homogeneous or cartesian 3d point, creates a homogeneous 2d point
     * @param vec The vector to turn into the homogenous form
     * @returns The homogenous coordinate (equal to the input if it already was homogeneous)
     */
    public static create(vec: Vec3 | Point3D): Point3D {
        if (vec instanceof Point3D) return vec;
        return new Point3D(vec.x, vec.y, vec.z);
    }
}

/**
 * Creates a 3d rotation matrix around the x-axis that operates on homogenous coordinates
 * @param amount The rotation amount
 * @returns The transformation matrix
 */
export function RotateX(amount: number): Mat4 {
    const s = Math.sin(amount);
    const c = Math.cos(amount);
    // prettier-ignore
    return new Mat4(
        1, 0, 0, 0,
        0, c,-s, 0,
        0, s, c, 0,
        0, 0, 0, 1
    );
}

/**
 * Creates a 3d rotation matrix around the y-axis that operates on homogenous coordinates
 * @param amount The rotation amount
 * @returns The transformation matrix
 */
export function RotateY(amount: number): Mat4 {
    const s = Math.sin(amount);
    const c = Math.cos(amount);
    // prettier-ignore
    return new Mat4(
        c, 0, s, 0,
        0, 1, 0, 0,
        -s,0, c, 0,
        0, 0, 0, 1
    );
}

/**
 * Creates a 3d rotation matrix around the x-axis that operates on homogenous coordinates
 * @param amount The rotation amount
 * @returns The transformation matrix
 */
export function RotateZ(amount: number): Mat4 {
    const s = Math.sin(amount);
    const c = Math.cos(amount);
    // prettier-ignore
    return new Mat4(
        c,-s, 0, 0,
        s, c, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    );
}

/**
 * Creates a rotation matrix for the given quaternion
 * @param quaternion The quaternion to be rotated by
 * @returns The rotation matrix
 */
export function Rotate(quaternion: Vec4): Mat4 {
    const q = quaternion.normalize();

    // Source: https://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToMatrix/index.htm
    // prettier-ignore
    return new Mat4 (
        1-2*q.y*q.y-2*q.z*q.z, 2*q.x*q.y-2*q.z*q.w,   2*q.x*q.z+2*q.y*q.w,   0,
        2*q.x*q.y+2*q.z*q.w,   1-2*q.x*q.x-2*q.z*q.z, 2*q.y*q.z-2*q.x*q.w,   0,
        2*q.x*q.z-2*q.y*q.w,   2*q.y*q.z + 2*q.x*q.w, 1-2*q.x*q.x-2*q.y*q.y, 0,
        0,                     0,                     0,                     1
    );
}

/**
 * Creates a 3d translation matrix that operates on homogenous coordinates
 * @param x The translation amount on the x-axis
 * @param y The translation amount on the y-axis
 * @param z The translation amount on the z-axis
 * @returns The transformation matrix
 */
export function Translate(x: number, y: number, z: number): Mat4;

/**
 * Creates a 3d translation matrix that operates on homogenous coordinates
 * @param vec The translation vector
 * @returns The transformation matrix
 */
export function Translate(vec: Vec3): Mat4;
export function Translate(x: number | Vec3, y?: number, z?: number): Mat4 {
    if (typeof x != "number") {
        y = x.y;
        z = x.z;
        x = x.x;
    }

    // prettier-ignore
    return new Mat4(
        1, 0, 0, x,
        0, 1, 0, y!,
        0, 0, 1, z!,
        0, 0, 0, 1
    );
}

/**
 * Creates a 3d scaling matrix that operates on homogenous coordinates
 * @param amount The amount to scale by
 * @returns The transformation matrix
 */
export function Scale(amount: number): Mat4;

/**
 * Creates a 3d scaling matrix that operates on homogenous coordinates
 * @param x The scaling amount on the x-axis
 * @param y The scaling amount on the y-axis
 * @param z The scaling amount on the z-axis
 * @returns The transformation matrix
 */
export function Scale(x: number, y: number, z: number): Mat4;

/**
 * Creates a 3d scaling matrix that operates on homogenous coordinates
 * @param vec The scaling vector
 * @returns The transformation matrix
 */
export function Scale(vec: Vec3): Mat4;
export function Scale(x: number | Vec3, y?: number, z?: number): Mat4 {
    if (typeof x != "number") {
        y = x.y;
        z = x.z;
        x = x.x;
    }
    y = y ?? x;
    z = z ?? x;

    // prettier-ignore
    return new Mat4(
         x, 0, 0, 0, 
         0, y, 0, 0,
         0, 0, z, 0,
         0, 0, 0, 1
     );
}

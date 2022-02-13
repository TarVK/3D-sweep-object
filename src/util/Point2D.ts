import {Mat3} from "./Mat3";
import {Vec2} from "./Vec2";
import {Vec3} from "./Vec3";

/** The homogenous representation of 2D points */
export class Point2D extends Vec3 {
    /**
     * Converts this homogenous 2D point to its cartesian representation
     * @returns The cartesian representation
     */
    public toCartesian(): Vec2 {
        return new Vec2(this.x / this.z, this.y / this.z);
    }

    /**
     * Given either a homogeneous or cartesian 2d point, creates a homogeneous 2d point
     * @param vec The vector to turn into the homogenous form
     * @returns The homogenous coordinate (equal to the input if it already was homogeneous)
     */
    public static create(vec: Vec2 | Point2D): Point2D {
        if (vec instanceof Point2D) return vec;
        return new Point2D(vec.x, vec.y, 1);
    }
}

/**
 * Creates a 2d rotation matrix that operates on homogenous coordinates
 * @param amount The rotation amount
 * @returns The transformation matrix
 */
export function Rotate(amount: number): Mat3 {
    const s = Math.sin(amount);
    const c = Math.cos(amount);
    // prettier-ignore
    return new Mat3(
        c,-s, 0,
        s, c, 0,
        0, 0, 1
    );
}

/**
 * Creates a 2d translation matrix that operates on homogenous coordinates
 * @param x The translation amount on the x-axis
 * @param y The translation amount on the y-axis
 * @returns The transformation matrix
 */
export function Translate(x: number, y: number): Mat3;

/**
 * Creates a 2d translation matrix that operates on homogenous coordinates
 * @param vec The translation vector
 * @returns The transformation matrix
 */
export function Translate(vec: Vec2 | Vec3): Mat3;
export function Translate(x: number | Vec2 | Vec3, y?: number): Mat3 {
    if (typeof x != "number") {
        y = x.y;
        x = x.x;
    }

    // prettier-ignore
    return new Mat3(
        1, 0, x,
        0, 1, y!,
        0, 0, 1
    );
}

/**
 * Creates a 2d scaling matrix that operates on homogenous coordinates
 * @param amount The amount to scale by
 * @returns The transformation matrix
 */
export function Scale(amount: number): Mat3;

/**
 * Creates a 2d scaling matrix that operates on homogenous coordinates
 * @param x The scaling amount on the x-axis
 * @param y The scaling amount on the y-axis
 * @returns The transformation matrix
 */
export function Scale(x: number, y: number): Mat3;

/**
 * Creates a 2d scaling matrix that operates on homogenous coordinates
 * @param vec The scaling vector
 * @returns The transformation matrix
 */
export function Scale(vec: Vec2 | Vec3): Mat3;
export function Scale(x: number | Vec2 | Vec3, y?: number): Mat3 {
    if (typeof x != "number") {
        y = x.y;
        x = x.x;
    }
    y = y ?? x;

    // prettier-ignore
    return new Mat3(
         x, 0, 0,
         0, y, 0,
         0, 0, 1
     );
}

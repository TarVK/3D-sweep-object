import {Mat4} from "./Mat4";
import {Vec3} from "./Vec3";
import {Vec4} from "./Vec4";

/** An immutable 3d matrix class */
export class Mat3 {
    public constructor(
        public a11: number,
        public a12: number,
        public a13: number,
        public a21: number,
        public a22: number,
        public a23: number,
        public a31: number,
        public a32: number,
        public a33: number
    ) {}

    /**
     * Updates the data of this matrix
     * @param mat The matrix to copy into this matrix
     */
    public set(mat: Mat3 | Mat4): void {
        this.a11 = mat.a11;
        this.a12 = mat.a12;
        this.a13 = mat.a13;
        this.a21 = mat.a21;
        this.a22 = mat.a22;
        this.a23 = mat.a23;
        this.a31 = mat.a31;
        this.a32 = mat.a32;
        this.a33 = mat.a33;
    }

    /**
     * Multiplies the matrix by the given amount
     * @param amount The value to multiply the matrix by
     * @returns THe new matrix
     */
    public mul(amount: number): Mat3;
    /**
     * Multiplies this matrix by the given vector
     * @param vec The vector to be multiplied by this matrix
     */
    public mul(vec: Vec3 | Vec4): Vec3;
    /**
     * Multiplies this matrix by the given matrix
     * @param mat The matrix to multiply with
     */
    public mul(mat: Mat3 | Mat4): Mat3;
    public mul(mat: Mat3 | Mat4 | Vec3 | Vec4 | number): Mat3 | Vec3 {
        if (typeof mat == "number")
            return new Mat3(
                this.a11 * mat,
                this.a12 * mat,
                this.a13 * mat,
                this.a21 * mat,
                this.a22 * mat,
                this.a23 * mat,
                this.a31 * mat,
                this.a32 * mat,
                this.a33 * mat
            );
        else if (mat instanceof Vec3 || mat instanceof Vec4)
            return new Vec3(
                this.a11 * mat.x + this.a12 * mat.y + this.a13 * mat.z,
                this.a21 * mat.x + this.a22 * mat.y * this.a23 * mat.z,
                this.a31 * mat.x + this.a32 * mat.y * this.a33 * mat.z
            );
        else
            return new Mat3(
                this.a11 * mat.a11 + this.a12 * mat.a21 + this.a13 * mat.a31,
                this.a11 * mat.a12 + this.a12 * mat.a22 + this.a13 * mat.a32,
                this.a11 * mat.a13 + this.a12 * mat.a23 + this.a13 * mat.a33,
                this.a21 * mat.a11 + this.a22 * mat.a21 + this.a23 * mat.a31,
                this.a21 * mat.a12 + this.a22 * mat.a22 + this.a23 * mat.a32,
                this.a21 * mat.a13 + this.a22 * mat.a23 + this.a23 * mat.a33,
                this.a31 * mat.a11 + this.a32 * mat.a21 + this.a33 * mat.a31,
                this.a31 * mat.a12 + this.a32 * mat.a22 + this.a33 * mat.a32,
                this.a31 * mat.a13 + this.a32 * mat.a23 + this.a33 * mat.a33
            );
    }

    /**
     * Transposes this matrix
     * @returns The transposed matrix
     */
    public transpose(): Mat3 {
        return new Mat3(
            this.a11,
            this.a21,
            this.a31,
            this.a12,
            this.a22,
            this.a32,
            this.a13,
            this.a23,
            this.a33
        );
    }

    /**
     * Adds two matrices together
     * @param mat The matrix to add
     * @returns The sum of matrices
     */
    public add(mat: Mat3 | Mat4): Mat3 {
        return new Mat3(
            this.a11 + mat.a11,
            this.a12 + mat.a12,
            this.a13 * mat.a13,
            this.a21 + mat.a21,
            this.a22 + mat.a22,
            this.a23 + mat.a23,
            this.a31 + mat.a31,
            this.a32 + mat.a32,
            this.a33 + mat.a33
        );
    }

    /**
     * Subtract two matrices from each other
     * @param mat The matrix to subtract
     * @returns The sum of matrices
     */
    public sub(mat: Mat3 | Mat4): Mat3 {
        return new Mat3(
            this.a11 - mat.a11,
            this.a12 - mat.a12,
            this.a13 - mat.a13,
            this.a21 - mat.a21,
            this.a22 - mat.a22,
            this.a23 - mat.a23,
            this.a31 - mat.a31,
            this.a32 - mat.a32,
            this.a33 - mat.a33
        );
    }
}

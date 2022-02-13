import {Mat3} from "./Mat3";
import {Mat4} from "./Mat4";
import {Vec2} from "./Vec2";
import {Vec3} from "./Vec3";
import {Vec4} from "./Vec4";

/** An immutable 2d matrix class */
export class Mat2 {
    /**
     * Creates a new 2d matrix, by supplying values in row major order
     * @param a11 Row 1, column 1
     * @param a12 Row 1, column 2
     * @param a21 Row 2, column 1
     * @param a22 Row 2, column 2
     */
    public constructor(
        public a11: number,
        public a12: number,
        public a21: number,
        public a22: number
    ) {}

    /**
     * Updates the data of this matrix
     * @param mat The matrix to copy into this matrix
     */
    public set(mat: Mat2 | Mat3 | Mat4): void {
        this.a11 = mat.a11;
        this.a12 = mat.a12;
        this.a21 = mat.a21;
        this.a22 = mat.a22;
    }

    /**
     * Multiplies the matrix by the given amount
     * @param amount The value to multiply the matrix by
     * @returns THe new matrix
     */
    public mul(amount: number): Mat2;
    /**
     * Multiplies this matrix by the given vector
     * @param vec The vector to be multiplied by this matrix
     */
    public mul(vec: Vec2 | Vec3 | Vec4): Vec2;
    /**
     * Multiplies this matrix by the given matrix
     * @param mat The matrix to multiply with
     */
    public mul(mat: Mat2 | Mat3 | Mat4): Mat2;
    public mul(mat: Mat2 | Mat3 | Mat4 | Vec2 | Vec3 | Vec4 | number): Mat2 | Vec2 {
        if (typeof mat == "number")
            return new Mat2(
                this.a11 * mat,
                this.a12 * mat,
                this.a21 * mat,
                this.a22 * mat
            );
        else if (mat instanceof Vec2 || mat instanceof Vec3 || mat instanceof Vec4)
            return new Vec2(
                this.a11 * mat.x + this.a12 * mat.y,
                this.a21 * mat.x + this.a22 * mat.y
            );
        else
            return new Mat2(
                this.a11 * mat.a11 + this.a12 * mat.a21,
                this.a11 * mat.a12 + this.a12 * mat.a22,
                this.a21 * mat.a11 + this.a22 * mat.a21,
                this.a21 * mat.a12 + this.a22 * mat.a22
            );
    }

    /**
     * Transposes this matrix
     * @returns The transposed matrix
     */
    public transpose(): Mat2 {
        return new Mat2(this.a11, this.a21, this.a12, this.a22);
    }

    /**
     * Adds two matrices together
     * @param mat The matrix to add
     * @returns The sum of matrices
     */
    public add(mat: Mat2 | Mat3 | Mat4): Mat2 {
        return new Mat2(
            this.a11 + mat.a11,
            this.a12 + mat.a12,
            this.a21 + mat.a21,
            this.a22 + mat.a22
        );
    }

    /**
     * Subtract two matrices from each other
     * @param mat The matrix to subtract
     * @returns The sum of matrices
     */
    public sub(mat: Mat2 | Mat3 | Mat4): Mat2 {
        return new Mat2(
            this.a11 - mat.a11,
            this.a12 - mat.a12,
            this.a21 - mat.a21,
            this.a22 - mat.a22
        );
    }
}

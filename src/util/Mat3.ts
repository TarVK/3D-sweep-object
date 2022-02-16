import {Mat4} from "./Mat4";
import {Vec3} from "./Vec3";
import {Vec4} from "./Vec4";

/** An immutable 3d matrix class */
export class Mat3 {
    /**
     * Creates a new 3d matrix, by supplying values in row major order
     * @param a11 Row 1, column 1
     * @param a12 Row 1, column 2
     * @param a13 Row 1, column 3
     * @param a21 Row 2, column 1
     * @param a22 Row 2, column 2
     * @param a23 Row 2, column 3
     * @param a31 Row 3, column 1
     * @param a32 Row 3, column 2
     * @param a33 Row 3, column 3
     */
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
     * Creates a new material of this class. Should be overridden by classes extending this class
     * @param a11 Row 1, column 1
     * @param a12 Row 1, column 2
     * @param a13 Row 1, column 3
     * @param a21 Row 2, column 1
     * @param a22 Row 2, column 2
     * @param a23 Row 2, column 3
     * @param a31 Row 3, column 1
     * @param a32 Row 3, column 2
     * @param a33 Row 3, column 3
     * @returns The created matrix
     */
    protected create(
        a11: number,
        a12: number,
        a13: number,
        a21: number,
        a22: number,
        a23: number,
        a31: number,
        a32: number,
        a33: number
    ): this {
        return new Mat3(a11, a12, a13, a21, a22, a23, a31, a32, a33) as any;
    }

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
     * Creates a copy of this matrix
     * @returns The copy of this matrix
     */
    public copy(): this {
        return this.create(
            this.a11,
            this.a12,
            this.a13,
            this.a21,
            this.a22,
            this.a23,
            this.a31,
            this.a32,
            this.a33
        );
    }

    /**
     * Multiplies the matrix by the given amount
     * @param amount The value to multiply the matrix by
     * @returns THe new matrix
     */
    public mul(amount: number): this;
    /**
     * Multiplies this matrix by the given vector
     * @param vec The vector to be multiplied by this matrix
     */
    public mul(vec: Vec3 | Vec4): Vec3;
    /**
     * Multiplies this matrix by the given matrix
     * @param mat The matrix to multiply with
     */
    public mul(mat: Mat3 | Mat4): this;
    public mul(mat: Mat3 | Mat4 | Vec3 | Vec4 | number): this | Vec3 {
        if (typeof mat == "number")
            return this.create(
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
            return this.create(
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
    public transpose(): this {
        return this.create(
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
    public add(mat: Mat3 | Mat4): this {
        return this.create(
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
    public sub(mat: Mat3 | Mat4): this {
        return this.create(
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

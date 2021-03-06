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
     * Creates a new material of this class. Should be overridden by classes extending this class
     * @param a11 Row 1, column 1
     * @param a12 Row 1, column 2
     * @param a21 Row 2, column 1
     * @param a22 Row 2, column 2
     * @returns The created matrix
     */
    protected create(a11: number, a12: number, a21: number, a22: number): this {
        return new Mat2(a11, a12, a21, a22) as any;
    }

    /**
     * Creates a copy of this matrix
     * @returns The copy of this matrix
     */
    public copy(): this {
        return this.create(this.a11, this.a12, this.a21, this.a22);
    }

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
    public mul(amount: number): this;
    /**
     * Multiplies this matrix by the given vector
     * @param vec The vector to be multiplied by this matrix
     */
    public mul<V extends Vec2>(vec: V): V;
    /**
     * Multiplies this matrix by the given vector
     * @param vec The vector to be multiplied by this matrix
     */
    public mul(vec: Vec3 | Vec4): Vec2;
    /**
     * Multiplies this matrix by the given matrix
     * @param mat The matrix to multiply with
     */
    public mul(mat: Mat2 | Mat3 | Mat4): this;
    public mul(mat: Mat2 | Mat3 | Mat4 | Vec2 | Vec3 | Vec4 | number): this | Vec2 {
        if (typeof mat == "number")
            return this.create(
                this.a11 * mat,
                this.a12 * mat,
                this.a21 * mat,
                this.a22 * mat
            );
        else if (mat instanceof Vec2)
            return mat.create(
                this.a11 * mat.x + this.a12 * mat.y,
                this.a21 * mat.x + this.a22 * mat.y
            );
        else if (mat instanceof Vec3 || mat instanceof Vec4)
            return new Vec2(
                this.a11 * mat.x + this.a12 * mat.y,
                this.a21 * mat.x + this.a22 * mat.y
            );
        else
            return this.create(
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
    public transpose(): this {
        return this.create(this.a11, this.a21, this.a12, this.a22);
    }

    /**
     * Adds two matrices together
     * @param mat The matrix to add
     * @returns The sum of matrices
     */
    public add(mat: Mat2 | Mat3 | Mat4): this {
        return this.create(
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
    public sub(mat: Mat2 | Mat3 | Mat4): this {
        return this.create(
            this.a11 - mat.a11,
            this.a12 - mat.a12,
            this.a21 - mat.a21,
            this.a22 - mat.a22
        );
    }

    /** @override */
    public toString(): string {
        const p = (val: number) => (val + "").padStart(4, " ");
        return `[[${p(this.a11)}, ${p(this.a12)}],\n [${p(this.a21)}, ${p(this.a22)}]]`;
    }
}

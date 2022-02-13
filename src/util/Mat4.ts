import {Vec4} from "./Vec4";

/** An immutable 4d matrix class */
export class Mat4 {
    public constructor(
        public a11: number,
        public a12: number,
        public a13: number,
        public a14: number,
        public a21: number,
        public a22: number,
        public a23: number,
        public a24: number,
        public a31: number,
        public a32: number,
        public a33: number,
        public a34: number,
        public a41: number,
        public a42: number,
        public a43: number,
        public a44: number
    ) {}

    /**
     * Updates the data of this matrix
     * @param mat The matrix to copy into this matrix
     */
    public set(mat: Mat4): void {
        this.a11 = mat.a11;
        this.a12 = mat.a12;
        this.a13 = mat.a13;
        this.a14 = mat.a14;
        this.a21 = mat.a21;
        this.a22 = mat.a22;
        this.a23 = mat.a23;
        this.a24 = mat.a24;
        this.a31 = mat.a31;
        this.a32 = mat.a32;
        this.a33 = mat.a33;
        this.a34 = mat.a34;
        this.a41 = mat.a41;
        this.a42 = mat.a42;
        this.a43 = mat.a43;
        this.a44 = mat.a44;
    }

    /**
     * Multiplies the matrix by the given amount
     * @param amount The value to multiply the matrix by
     * @returns THe new matrix
     */
    public mul(amount: number): Mat4;
    /**
     * Multiplies this matrix by the given vector
     * @param vec The vector to be multiplied by this matrix
     */
    public mul(vec: Vec4): Vec4;
    /**
     * Multiplies this matrix by the given matrix
     * @param mat The matrix to multiply with
     */
    public mul(mat: Mat4): Mat4;
    public mul(mat: Mat4 | Vec4 | number): Mat4 | Vec4 {
        if (typeof mat == "number")
            return new Mat4(
                this.a11 * mat,
                this.a12 * mat,
                this.a13 * mat,
                this.a14 * mat,
                this.a21 * mat,
                this.a22 * mat,
                this.a23 * mat,
                this.a24 * mat,
                this.a31 * mat,
                this.a32 * mat,
                this.a33 * mat,
                this.a34 * mat,
                this.a41 * mat,
                this.a42 * mat,
                this.a43 * mat,
                this.a44 * mat
            );
        else if (mat instanceof Vec4)
            return new Vec4(
                this.a11 * mat.x + this.a12 * mat.y + this.a13 * mat.z + this.a14 * mat.w,
                this.a21 * mat.x + this.a22 * mat.y * this.a23 * mat.z + this.a24 * mat.w,
                this.a31 * mat.x + this.a32 * mat.y * this.a33 * mat.z + this.a34 * mat.w,
                this.a41 * mat.x + this.a42 * mat.y * this.a43 * mat.z + this.a44 * mat.w,
            );
        else
            // prettier-ignore
            return new Mat4(
                this.a11 * mat.a11 + this.a12 * mat.a21 + this.a13 * mat.a31 + this.a14 * mat.a41,
                this.a11 * mat.a12 + this.a12 * mat.a22 + this.a13 * mat.a32 + this.a14 * mat.a42,
                this.a11 * mat.a13 + this.a12 * mat.a23 + this.a13 * mat.a33 + this.a14 * mat.a43,
                this.a11 * mat.a14 + this.a12 * mat.a24 + this.a13 * mat.a34 + this.a14 * mat.a44,
                this.a21 * mat.a11 + this.a22 * mat.a21 + this.a23 * mat.a31 + this.a24 * mat.a41,
                this.a21 * mat.a12 + this.a22 * mat.a22 + this.a23 * mat.a32 + this.a24 * mat.a42,
                this.a21 * mat.a13 + this.a22 * mat.a23 + this.a23 * mat.a33 + this.a24 * mat.a43,
                this.a21 * mat.a14 + this.a22 * mat.a24 + this.a23 * mat.a34 + this.a24 * mat.a44,
                this.a31 * mat.a11 + this.a32 * mat.a21 + this.a33 * mat.a31 + this.a34 * mat.a41,
                this.a31 * mat.a12 + this.a32 * mat.a22 + this.a33 * mat.a32 + this.a34 * mat.a42,
                this.a31 * mat.a13 + this.a32 * mat.a23 + this.a33 * mat.a33 + this.a34 * mat.a43,
                this.a31 * mat.a14 + this.a32 * mat.a24 + this.a33 * mat.a34 + this.a34 * mat.a44,
                this.a41 * mat.a11 + this.a42 * mat.a21 + this.a43 * mat.a31 + this.a44 * mat.a41,
                this.a41 * mat.a12 + this.a42 * mat.a22 + this.a43 * mat.a32 + this.a44 * mat.a42,
                this.a41 * mat.a13 + this.a42 * mat.a23 + this.a43 * mat.a33 + this.a44 * mat.a43,
                this.a41 * mat.a14 + this.a42 * mat.a24 + this.a43 * mat.a34 + this.a44 * mat.a44,
            );
    }

    /**
     * Transposes this matrix
     * @returns The transposed matrix
     */
    public transpose(): Mat4 {
        return new Mat4(
            this.a11,
            this.a21,
            this.a31,
            this.a41,
            this.a12,
            this.a22,
            this.a32,
            this.a42,
            this.a13,
            this.a23,
            this.a33,
            this.a43,
            this.a14,
            this.a24,
            this.a34,
            this.a44
        );
    }

    /**
     * Adds two matrices together
     * @param mat The matrix to add
     * @returns The sum of matrices
     */
    public add(mat: Mat4): Mat4 {
        return new Mat4(
            this.a11 + mat.a11,
            this.a12 + mat.a12,
            this.a13 * mat.a13,
            this.a14 * mat.a14,
            this.a21 + mat.a21,
            this.a22 + mat.a22,
            this.a23 + mat.a23,
            this.a24 + mat.a24,
            this.a31 + mat.a31,
            this.a32 + mat.a32,
            this.a33 + mat.a33,
            this.a34 + mat.a34,
            this.a41 + mat.a41,
            this.a42 + mat.a42,
            this.a43 + mat.a43,
            this.a44 + mat.a44
        );
    }

    /**
     * Subtract two matrices from each other
     * @param mat The matrix to subtract
     * @returns The sum of matrices
     */
    public sub(mat: Mat4): Mat4 {
        return new Mat4(
            this.a11 - mat.a11,
            this.a12 - mat.a12,
            this.a13 - mat.a13,
            this.a14 - mat.a14,
            this.a21 - mat.a21,
            this.a22 - mat.a22,
            this.a23 - mat.a23,
            this.a24 - mat.a24,
            this.a31 - mat.a31,
            this.a32 - mat.a32,
            this.a33 - mat.a33,
            this.a34 - mat.a34,
            this.a41 - mat.a41,
            this.a42 - mat.a42,
            this.a43 - mat.a43,
            this.a44 - mat.a44
        );
    }
}
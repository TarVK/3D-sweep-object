import {Point3D} from "./Point3D";
import {Vec4} from "./Vec4";

/** A 3d vector with immutable operations */
export class Vec3 {
    public x: number;
    public y: number;
    public z: number;

    /**
     * Creates a new 3 dimensional vector
     * @param x The x component of the vector
     * @param y The y component of the vector
     * @param z The z component of the vector
     */
    public constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * Creates a new vector of this class. Should be overridden by classes extending this class
     * @param x The x component of the vector
     * @param y The y component of the vector
     * @param z The z component of the vector
     * @returns The created vector
     */
    public create(x: number, y: number, z: number): this {
        return new Vec3(x, y, z) as any;
    }

    /**
     * Copies this vector
     * @returns The copy
     */
    public copy(): this {
        return this.create(this.x, this.y, this.z);
    }

    /**
     * Updates the data of this vector
     * @param x The x component of the vector
     * @param y The y component of the vector
     * @param z The z component of the vector
     */
    public set(x: number, y: number, z: number): void;
    /**
     * Updates the data of this vector
     * @param vec The vector to copy into this vector
     */
    public set(vec: Vec3 | Vec4): void;
    public set(x: number | Vec3 | Vec4, y?: number, z?: number): void {
        if (typeof x == "number") {
            this.x = x;
            this.y = y!;
            this.z = z!;
        } else {
            this.x = x.x;
            this.y = x.y;
            this.y = x.z;
        }
    }

    /**
     * Adds the given components to this vector
     * @param x The x component of the vector
     * @param y The y component of the vector
     * @param z The z component of the vector
     * @returns The new vector
     */
    public add(x: number, y: number, z: number): this;
    /**
     * Adds the given vector to this vector
     * @param vec The vector to add to this vector
     * @returns The new vector
     */
    public add(vec: Vec3 | Vec4): this;
    public add(x: number | Vec3 | Vec4, y?: number, z?: number): this {
        if (typeof x == "number")
            return this.create(this.x + x, this.y + y!, this.z + z!);
        else {
            if (x instanceof Point3D) x = x.toCartesian();
            return this.create(this.x + x.x, this.y + x.y, this.z + x.z);
        }
    }

    /**
     * Subtracts the given components from this vector
     * @param x The x component of the vector
     * @param y The y component of the vector
     * @param z The z component of the vector
     * @returns The new vector
     */
    public sub(x: number, y: number, z: number): this;
    /**
     * Subtracts the given vector from this vector
     * @param vec The vector to subtract from this vector
     * @returns The new vector
     */
    public sub(vec: Vec3 | Vec4): this;
    public sub(x: number | Vec3 | Vec4, y?: number, z?: number): this {
        if (typeof x == "number")
            return this.create(this.x - x, this.y - y!, this.z - z!);
        else {
            if (x instanceof Point3D) x = x.toCartesian();
            return this.create(this.x - x.x, this.y - x.y, this.z - x.z);
        }
    }

    /**
     * Multiplies the given components with this vector
     * @param x The x component of the vector
     * @param y The y component of the vector
     * @param z The z component of the vector
     * @returns The new vector
     */
    public mul(x: number, y?: number, z?: number): this;
    /**
     * Multiplies the given vector with this vector
     * @param vec The vector to multiply with this vector
     * @returns The new vector
     */
    public mul(vec: Vec3 | Vec4): this;
    public mul(x: number | Vec3 | Vec4, y?: number, z?: number): this {
        if (typeof x == "number") {
            if (y == undefined) y = x;
            if (z == undefined) z = x;
            return this.create(this.x * x, this.y * y, this.z * z);
        } else {
            if (x instanceof Point3D) x = x.toCartesian();
            return this.create(this.x * x.x, this.y * x.y, this.z * x.z);
        }
    }

    /**
     * Divides this vector by the given components
     * @param x The x component of the vector
     * @param y The y component of the vector
     * @param z The z component of the vector
     * @returns The new vector
     */
    public div(x: number, y: number, z: number): this;
    /**
     * Divides this vector by the given vector
     * @param vec Divides this vector by the given vector
     * @returns The new vector
     */
    public div(vec: Vec3 | Vec4): this;
    public div(x: number | Vec3 | Vec4, y?: number, z?: number): this {
        if (typeof x == "number")
            return this.create(this.x / x, this.y / y!, this.z / z!);
        else {
            if (x instanceof Point3D) x = x.toCartesian();
            return this.create(this.x / x.x, this.y / x.y, this.z / x.z);
        }
    }

    /**
     * Retrieves the dot product of this vector and the components
     * @param x The x component of the vector
     * @param y The y component of the vector
     * @param z The z component of the vector
     * @returns The dot product
     */
    public dot(x: number, y: number, z: number): number;
    /**
     * Retrieves the dot product of this vector and the given vector
     * @param vec The vector product to get the dot product with
     * @returns The dot product
     */
    public dot(vec: Vec3 | Vec4): number;
    public dot(x: number | Vec3 | Vec4, y?: number, z?: number): number {
        if (typeof x == "number") return this.x * x + this.y * y! + this.z * z!;
        else {
            if (x instanceof Point3D) x = x.toCartesian();
            return this.x * x.x + this.y * x.y + this.z * x.z;
        }
    }

    /**
     * Retrieves the cross product of this vector and the components
     * @param x The x component of the vector
     * @param y The y component of the vector
     * @param z The z component of the vector
     * @returns The cross product
     */
    public cross(x: number, y: number, z: number): this;
    /**
     * Retrieves the cross product of this vector and the given vector
     * @param vec The vector to get the cross product with
     * @returns The cross product
     */
    public cross(vec: Vec3 | Vec4): this;
    public cross(x: number | Vec3 | Vec4, y?: number, z?: number): this {
        if (typeof x == "number") {
            return this.create(
                this.y * z! - this.z * y!,
                this.z * x - this.x * z!,
                this.x * y! - this.y * x
            );
        } else {
            return this.create(
                this.y * x.z - this.z * x.y,
                this.z * x.x - this.x * x.z,
                this.x * x.y - this.y * x.x
            );
        }
    }

    /**
     * Retrieves the length of this vector
     * @returns The length of this vector
     */
    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    /**
     * Retrieves the normalized vector
     * @returns The normalized vector
     */
    public normalize(): this {
        return this.mul(1 / this.length());
    }

    /** @override */
    public toString(): string {
        return `(${this.x}, ${this.y}, ${this.z})`;
    }
}

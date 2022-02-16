import {Vec3} from "./Vec3";
import {Vec4} from "./Vec4";

/** A 2d vector with immutable operations */
export class Vec2 {
    public x: number;
    public y: number;

    /**
     * Creates a new 2 dimensional vector
     * @param x The x component of the vector
     * @param y The y component of the vector
     */
    public constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Creates a new vector of this class. Should be overridden by classes extending this class
     * @param x The x component of the vector
     * @param y The y component of the vector
     * @returns The created vector
     */
    protected create(x: number, y: number): this {
        return new Vec2(x, y) as any;
    }

    /**
     * Copies this vector
     * @returns The copy
     */
    public copy(): this {
        return this.create(this.x, this.y);
    }

    /**
     * Updates the data of this vector
     * @param x The x component of the vector
     * @param y The y component of the vector
     */
    public set(x: number, y: number): void;
    /**
     * Updates the data of this vector
     * @param vec The vector to copy into this vector
     */
    public set(vec: Vec2 | Vec3 | Vec4): void;
    public set(x: number | Vec2 | Vec3 | Vec4, y?: number): void {
        if (typeof x == "number") {
            this.x = x;
            this.y = y!;
        } else {
            this.x = x.x;
            this.y = x.y;
        }
    }

    /**
     * Adds the given components to this vector
     * @param x The x component of the vector
     * @param y The y component of the vector
     * @returns The new vector
     */
    public add(x: number, y: number): this;
    /**
     * Adds the given vector to this vector
     * @param vec The vector to add tp this vector
     * @returns The new vector
     */
    public add(vec: Vec2 | Vec3 | Vec4): this;
    public add(x: number | Vec2 | Vec3 | Vec4, y?: number): this {
        if (typeof x == "number") return this.create(this.x + x, this.y + y!);
        else return this.create(this.x + x.x, this.y + x.y);
    }

    /**
     * Subtracts the given components from this vector
     * @param x The x component of the vector
     * @param y The y component of the vector
     * @returns The new vector
     */
    public sub(x: number, y: number): this;
    /**
     * Subtracts the given vector from this vector
     * @param vec The vector to subtract from this vector
     * @returns The new vector
     */
    public sub(vec: Vec2 | Vec3 | Vec4): this;
    public sub(x: number | Vec2 | Vec3 | Vec4, y?: number): this {
        if (typeof x == "number") return this.create(this.x - x, this.y - y!);
        else return this.create(this.x - x.x, this.y - x.y);
    }

    /**
     * Multiplies the given components with this vector
     * @param x The x component of the vector
     * @param y The y component of the vector
     * @returns The new vector
     */
    public mul(x: number, y?: number): this;
    /**
     * Multiplies the given vector with this vector
     * @param vec The vector to multiply with this vector
     * @returns The new vector
     */
    public mul(vec: Vec2 | Vec3 | Vec4): this;
    public mul(x: number | Vec2 | Vec3 | Vec4, y?: number): this {
        if (typeof x == "number") {
            if (y == undefined) y = x;
            return this.create(this.x * x, this.y * y!);
        } else return this.create(this.x * x.x, this.y * x.y);
    }

    /**
     * Divides this vector by the given components
     * @param x The x component of the vector
     * @param y The y component of the vector
     * @returns The new vector
     */
    public div(x: number, y: number): this;
    /**
     * Divides this vector by the given vector
     * @param vec Divides this vector by the given vector
     * @returns The new vector
     */
    public div(vec: Vec2 | Vec3 | Vec4): this;
    public div(x: number | Vec2 | Vec3 | Vec4, y?: number): this {
        if (typeof x == "number") return this.create(this.x / x, this.y / y!);
        else return this.create(this.x / x.x, this.y / x.y);
    }

    /**
     * Retrieves the dot product of this vector and the components
     * @param x The x component of the vector
     * @param y The y component of the vector
     * @returns The dot product
     */
    public dot(x: number, y: number): number;
    /**
     * Retrieves the dot product of this vector and the given vector
     * @param vec The dot product to get the dot product with
     * @returns The dot product
     */
    public dot(vec: Vec2 | Vec3 | Vec4): number;
    public dot(x: number | Vec2 | Vec3 | Vec4, y?: number): number {
        if (typeof x == "number") return this.x * x + this.y * y!;
        else return this.x * x.x + this.y * x.y;
    }

    /**
     * Retrieves the length of this vector
     * @returns The length of this vector
     */
    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Retrieves the normalized vector
     * @returns The normalized vector
     */
    public normalize(): this {
        return this.mul(1 / this.length());
    }
}

/** A 4d vector with immutable operations */
export class Vec4 {
    public x: number;
    public y: number;
    public z: number;
    public w: number;

    /**
     * Creates a new 4 dimensional vector
     * @param x The x component of the vector
     * @param y The y component of the vector
     * @param z The z component of the vector
     * @param w The w component of the vector
     */
    public constructor(x: number, y: number, z: number, w: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    /**
     * Creates a new vector of this class. Should be overridden by classes extending this class
     * @param x The x component of the vector
     * @param y The y component of the vector
     * @param z The z component of the vector
     * @param w The w component of the vector
     * @returns The created vector
     */
    public create(x: number, y: number, z: number, w: number): this {
        return new Vec4(x, y, z, w) as any;
    }

    /**
     * Copies this vector
     * @returns The copy
     */
    public copy(): this {
        return this.create(this.x, this.y, this.z, this.w);
    }

    /**
     * Updates the data of this vector
     * @param x The x component of the vector
     * @param y The y component of the vector
     * @param z The z component of the vector
     * @param w The w component of the vector
     */
    public set(x: number, y: number, z: number, w: number): void;
    /**
     * Updates the data of this vector
     * @param vec The vector top copy into this vector
     */
    public set(vec: Vec4): void;
    public set(x: number | Vec4, y?: number, z?: number, w?: number): void {
        if (typeof x == "number") {
            this.x = x;
            this.y = y ?? 0;
            this.z = z ?? 0;
            this.w = w ?? 0;
        } else {
            this.x = x.x;
            this.y = x.y;
            this.y = x.z;
            this.w = x.w;
        }
    }

    /**
     * Adds the given components to this vector
     * @param x The x component of the vector
     * @param y The y component of the vector
     * @param z The z component of the vector
     * @param w The w component of the vector
     * @returns The new vector
     */
    public add(x: number, y: number, z: number, w: number): this;
    /**
     * Adds the given vector to this vector
     * @param vec The vector to add to this vector
     * @returns The new vector
     */
    public add(vec: Vec4): this;
    public add(x: number | Vec4, y?: number, z?: number, w?: number): this {
        if (typeof x == "number")
            return this.create(this.x + x, this.y + y!, this.z + z!, this.w + w!);
        else return this.create(this.x + x.x, this.y + x.y, this.z + x.z, this.w + x.w);
    }

    /**
     * Subtracts the given components from this vector
     * @param x The x component of the vector
     * @param y The y component of the vector
     * @param z The z component of the vector
     * @param w The w component of the vector
     * @returns The new vector
     */
    public sub(x: number, y: number, z: number, w: number): this;
    /**
     * Subtracts the given vector from this vector
     * @param vec The vector to subtract from this vector
     * @returns The new vector
     */
    public sub(vec: Vec4): this;
    public sub(x: number | Vec4, y?: number, z?: number, w?: number): this {
        if (typeof x == "number")
            return this.create(this.x - x, this.y - y!, this.z - z!, this.w - w!);
        else return this.create(this.x - x.x, this.y - x.y, this.z - x.z, this.w - x.w);
    }

    /**
     * Multiplies the given components with this vector
     * @param x The x component of the vector
     * @param y The y component of the vector
     * @param z The z component of the vector
     * @param w The w component of the vector
     * @returns The new vector
     */
    public mul(x: number, y?: number, z?: number, w?: number): this;
    /**
     * Multiplies the given vector with this vector
     * @param vec The vector to multiply with this vector
     * @returns The new vector
     */
    public mul(vec: Vec4): this;
    public mul(x: number | Vec4, y?: number, z?: number, w?: number): this {
        if (typeof x == "number") {
            if (y == undefined) y = x;
            if (z == undefined) z = x;
            if (w == undefined) w = x;
            return this.create(this.x * x, this.y * y, this.z * z, this.w * w);
        } else return this.create(this.x * x.x, this.y * x.y, this.z * x.z, this.w * x.w);
    }

    /**
     * Divides this vector by the given components
     * @param x The x component of the vector
     * @param y The y component of the vector
     * @param z The z component of the vector
     * @param w The w component of the vector
     * @returns The new vector
     */
    public div(x: number, y: number, z: number, w: number): this;
    /**
     * Divides this vector by the given vector
     * @param vec Divides this vector by the given vector
     * @returns The new vector
     */
    public div(vec: Vec4): this;
    public div(x: number | Vec4, y?: number, z?: number, w?: number): this {
        if (typeof x == "number")
            return this.create(this.x / x, this.y / y!, this.z / z!, this.w / w!);
        else return this.create(this.x / x.x, this.y / x.y, this.z / x.z, this.w / x.w);
    }

    /**
     * Retrieves the dot product of this vector and the components
     * @param x The x component of the vector
     * @param y The y component of the vector
     * @param z The z component of the vector
     * @param w The w component of the vector
     * @returns The dot product
     */
    public dot(x: number, y: number, z: number, w: number): number;
    /**
     * Retrieves the dot product of this vector and the given vector
     * @param vec The dot product to get the dot product with
     * @returns The dot product
     */
    public dot(vec: Vec4): number;
    public dot(x: number | Vec4, y?: number, z?: number, w?: number): number {
        if (typeof x == "number")
            return this.x * x + this.y * y! + this.z * z! + this.w * w!;
        else return this.x * x.x + this.y * x.y + this.z * x.z + this.w * x.w;
    }

    /**
     * Retrieves the length of this vector
     * @returns The length of this vector
     */
    public length(): number {
        return Math.sqrt(
            this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
        );
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
        return `(${this.x}, ${this.y}, ${this.z}, ${this.w})`;
    }
}

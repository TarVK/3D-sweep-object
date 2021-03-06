import {DataCacher, Field, IDataHook} from "model-react";
import {getCircleThroughPoints} from "../../util/geometry/getCircleThroughPoints";
import {Point2D, Rotate, Scale} from "../../util/linearAlgebra/Point2D";
import {Vec2} from "../../util/linearAlgebra/Vec2";
import {IBoundingBox} from "../_types/IBoundingBox";
import {ISegment} from "../_types/ISegment";

/**
 * A class to represent subscribable state of an arc and handle some of its logic
 */
export class ArcSegmentState implements ISegment<Vec2> {
    protected start: Field<Vec2>;
    protected control: Field<Vec2>;
    protected end: Field<Vec2>;

    protected spec = new DataCacher(h => {
        const start = this.start.get(h);
        const control = this.control.get(h);
        const end = this.end.get(h);
        const circle = getCircleThroughPoints(start, control, end);
        if (circle) {
            const {radius, origin} = circle;
            const getAngle = (v: Vec2) => {
                const delta = v.sub(origin);
                return Math.atan2(delta.y, delta.x);
            };
            const startAngle = getAngle(start);
            const tau = 2 * Math.PI;
            const controlAngleDelta = (tau + getAngle(control) - startAngle) % tau;
            const endAngleDelta = (tau + getAngle(end) - startAngle) % tau;

            // Define the angle delta in such a way that it always passes through the control point
            const angleDelta =
                controlAngleDelta > endAngleDelta ? endAngleDelta - tau : endAngleDelta;
            return {
                origin,
                radius,
                start: startAngle,
                delta: angleDelta,
            };
        }

        // Fallback to straight line spec
        const delta = end.sub(start);
        return {
            start,
            delta,
        };
    });

    // Linked bezier curves that are synchronized
    protected previous = new Field<ISegment<Vec2> | null>(null);
    protected next = new Field<ISegment<Vec2> | null>(null);

    /**
     * Creates a bezier representation of the straight line segment from start to end
     * @param start The start point of the segment
     * @param end The end point of the segment
     */
    public constructor(start: Vec2, end: Vec2);

    /**
     * Creates a bezier curve with the given start and end points, and the given controls to direct the curve
     * @param start The start point of the segment
     * @param control The control point that the arc passes through
     * @param end The end point of the segment
     */
    public constructor(start: Vec2, control: Vec2, end: Vec2);
    public constructor(start: Vec2, control: Vec2, end?: Vec2) {
        if (end && end) {
            this.start = new Field(start);
            this.control = new Field(control);
            this.end = new Field(end);
        } else {
            end = control;
            this.start = new Field(start);
            const middle = start.add(end).mul(0.5);
            this.control = new Field(middle);
            this.end = new Field(end);
        }
    }

    // Utils
    public copy(): ArcSegmentState {
        return new ArcSegmentState(this.start.get(), this.control.get(), this.end.get());
    }

    /**
     * Retrieves a point on the curve, given a position on the curve
     * @param t The position between 0 and 1
     * @param hook The hook to subscribe to changes
     * @returns The found point
     */
    public getPoint(t: number, hook?: IDataHook): Vec2 {
        const spec = this.spec.get(hook);
        if (spec.origin) {
            const {origin, radius, start, delta} = spec;
            const angle = start + delta * t;
            return origin.add(Math.cos(angle) * radius, Math.sin(angle) * radius);
        }

        const {start, delta} = spec;
        return start.add(delta.mul(t));
    }

    /**
     * Retrieves the direction that the curve has at the given position
     * @param t The position between 0 and 1
     * @param hook The hook to subscribe to changes
     * @returns The found direction
     */
    public getDirection(t: number, hook?: IDataHook): Vec2 {
        const spec = this.spec.get(hook);
        if (spec.origin) {
            const {start, delta} = spec;
            const angle = start + delta * t;
            return new Vec2(-Math.sin(angle), Math.cos(angle))
                .normalize()
                .mul(delta < 0 ? -1 : 1);
        }

        const {delta} = spec;
        return delta.normalize();
    }

    /**
     * Gets a specification of this arc
     * @param hook The hook to subscribe to changes
     * @returns The simple representation of this arc
     */
    public getSpec(hook?: IDataHook) {
        return this.spec.get(hook);
    }

    // Chaining
    public setPreviousSegment(
        segment: ISegment<Vec2> | null,
        sync: boolean = true,
        copyDirection: boolean = false
    ): void {
        const current = this.previous.get();
        if (segment == current) return;
        if (sync && current) current.setNextSegment(null, false, false);

        if (segment) {
            this.previous.set(segment);

            const newStart = segment.getEnd();
            this.start.set(newStart);

            if (copyDirection) this.setStartDirection(segment.getEndDirection().mul(-1));
            if (sync) segment.setNextSegment(this, false, false);
        } else {
            this.previous.set(null);
        }
    }
    public setNextSegment(
        segment: ISegment<Vec2> | null,
        sync: boolean = true,
        copyDirection: boolean = false
    ): void {
        const current = this.next.get();
        if (segment == current) return;
        if (sync && current) current.setPreviousSegment(null, false, false);

        if (segment) {
            this.next.set(segment);

            const newEnd = segment.getStart();
            this.end.set(newEnd);

            if (copyDirection) this.setEndDirection(segment.getStartDirection().mul(-1));
            if (sync) segment.setPreviousSegment(this, false, false);
        } else {
            this.next.set(null);
        }
    }
    public getPreviousSegment(hook?: IDataHook): ISegment<Vec2> | null {
        return this.previous.get(hook);
    }
    public getNextSegment(hook?: IDataHook): ISegment<Vec2> | null {
        return this.next.get(hook);
    }

    // Getters
    public getStart(hook?: IDataHook): Vec2 {
        return this.start.get(hook);
    }
    public getEnd(hook?: IDataHook): Vec2 {
        return this.end.get(hook);
    }

    public getStartDirection(hook?: IDataHook): Vec2 {
        return this.getDirection(0, hook);
    }
    public getEndDirection(hook?: IDataHook): Vec2 {
        return this.getDirection(1, hook).mul(-1);
    }

    /**
     * Retrieves the control point of this arc
     * @param hook The hook to subscribe to changes
     * @returns The hook to subscribe to changes
     */
    public getControl(hook?: IDataHook): Vec2 {
        return this.control.get(hook);
    }

    // Setters
    public setStart(vec: Vec2, sync: boolean = true, move: boolean = true): void {
        if (move) {
            this.moveControl(this.getEnd(), this.getStart(), vec);
            this.syncNeighborDirections();
        }

        this.start.set(vec);

        if (sync) {
            const prev = this.previous.get();
            if (prev) prev.setEnd(vec, false, move);
        }
    }

    public setEnd(vec: Vec2, sync: boolean = true, move: boolean = true): void {
        if (move) {
            this.moveControl(this.getStart(), this.getEnd(), vec);
            this.syncNeighborDirections();
        }

        this.end.set(vec);

        if (sync) {
            const next = this.next.get();
            if (next) next.setStart(vec, false, move);
        }
    }

    protected moveControl(
        referenceA: Vec2,
        oldReferenceB: Vec2,
        newReferenceB: Vec2
    ): void {
        const oldDelta = referenceA.sub(oldReferenceB);
        const newDelta = referenceA.sub(newReferenceB);

        const angleDelta = newDelta.getAngle() - oldDelta.getAngle();
        const scaleDelta = newDelta.length() / oldDelta.length();
        const transformation = Scale(scaleDelta).mul(Rotate(angleDelta));

        const newControl = transformation
            .mul(Point2D.create(this.getControl().sub(referenceA)))
            .toCartesian()
            .add(referenceA);
        this.control.set(newControl);
    }

    /**
     * Sets the control point of this arc
     * @param vec The control point to be set
     * @param syncDir Whether to sync the neighbor direction
     */
    public setControl(vec: Vec2, syncDir: boolean = true): void {
        this.control.set(vec);

        if (syncDir) this.syncNeighborDirections();
    }

    /**
     * Synchronizes the directions of neighboring segments with the direction of this segment
     */
    protected syncNeighborDirections(): void {
        const next = this.getNextSegment();
        if (next) next.setStartDirection(this.getEndDirection().mul(-1));

        const prev = this.getPreviousSegment();
        if (prev) prev.setEndDirection(this.getStartDirection().mul(-1));
    }

    public setStartDirection(direction: Vec2): boolean {
        return false;
    }

    public setEndDirection(direction: Vec2): boolean {
        return false;
    }

    // Segment approximation
    public approximate(pointCount: number, skipLast: boolean, hook?: IDataHook): Vec2[] {
        const steps = pointCount - 1;
        const points = new Array(pointCount)
            .fill(0)
            .map((_, i) => this.getPoint(i / steps, hook));
        return skipLast ? points.slice(0, -1) : points;
    }

    // Interaction
    public getDistance(point: Vec2): number {
        const spec = this.getSpec();
        const distanceToClosestPoint = Math.min(
            this.getStart().sub(point).length(),
            this.getEnd().sub(point).length()
        );

        if (spec.origin) {
            const {origin, radius, start, delta} = spec;
            const getAngle = (v: Vec2) => {
                const delta = v.sub(origin);
                return Math.atan2(delta.y, delta.x);
            };
            const tau = 2 * Math.PI;
            const controlAngleDelta = (tau + getAngle(point) - start) % tau;

            let pastEnd: boolean;
            if (delta < 0) pastEnd = controlAngleDelta - tau < delta;
            else pastEnd = controlAngleDelta > delta;

            if (!pastEnd) return Math.abs(point.sub(origin).length() - radius);
            return distanceToClosestPoint;
        }

        // Get closest point to line
        const start = this.getStart();
        const end = this.getEnd();
        const dEnd = end.sub(start);
        const dPoint = point.sub(start);

        const per = dEnd.dot(dPoint) / (dEnd.length() * dEnd.length());
        if (per < 0) return start.sub(point).length();
        if (per > 1) return end.sub(point).length();
        return dPoint.sub(dEnd.mul(per)).length();
    }

    public split(point: Vec2): [ISegment<Vec2>, ISegment<Vec2>] {
        const start = this.getStart();
        const end = this.getEnd();
        const controlA = start.add(point).mul(0.5);
        const controlB = point.add(end).mul(0.5);

        return [
            new ArcSegmentState(start, controlA, point),
            new ArcSegmentState(point, controlB, end),
        ];
    }

    public combinePrevious(): ISegment<Vec2> {
        const previous = this.previous.get();
        if (previous)
            return new ArcSegmentState(
                previous.getStart(),
                this.getStart(),
                this.getEnd()
            );
        return this.copy();
    }

    public moveHandle(handle: string, to: Vec2, moveAttachedPoints = true): void {
        if (handle == "start") this.setStart(to, true, moveAttachedPoints);
        else if (handle == "control") this.setControl(to, moveAttachedPoints);
        else if (handle == "end") this.setEnd(to, true, moveAttachedPoints);
    }

    public getHandle(
        point: Vec2,
        includeLast: boolean = false
    ): {distance: number; point: Vec2; handle: string} {
        const start = this.getStart();
        const control = this.getControl();

        const options = [
            {point: start, distance: start.sub(point).length(), handle: "start"},
            {point: control, distance: control.sub(point).length(), handle: "control"},
        ];

        if (includeLast) {
            const end = this.getEnd();
            options.push({point: end, distance: end.sub(point).length(), handle: "end"});
        }

        return options.reduce(
            (best, option) => (option.distance < best.distance ? option : best),
            {point: start, distance: Infinity, handle: "start"}
        );
    }

    public getBoundingBox(hook?: IDataHook): IBoundingBox {
        const start = this.getStart(hook);
        const control = this.getControl(hook);
        const end = this.getEnd(hook);
        let minX = Math.min(start.x, control.x, end.x);
        let minY = Math.min(start.y, control.y, end.y);
        let maxX = Math.max(start.x, control.x, end.x);
        let maxY = Math.max(start.y, control.y, end.y);

        const spec = this.getSpec(hook);
        if (spec.origin) {
            // Find all directions that the arc increased the BB of
            const {
                origin: {x, y},
                radius,
                start,
                delta,
            } = spec;

            // Calculate what direction we're starting off at, and ending in (both modulo 4):
            // 0: right, 1: up, 2: left, 3: down
            const hPI = Math.PI / 2;
            const startDir = Math.floor(start / hPI) + 8;
            const endDir = Math.floor((start + delta) / hPI) + 8;

            const handle = (dir: number) => {
                const dirC = dir % 4;
                if (dirC == 0) maxX = Math.max(maxX, x + radius);
                if (dirC == 1) maxY = Math.max(maxY, y + radius);
                if (dirC == 2) minX = Math.min(maxX, x - radius);
                if (dirC == 3) minY = Math.min(maxY, y - radius);
            };
            if (delta < 0) for (let d = startDir; d > endDir; d--) handle(d);
            else for (let d = startDir; d < endDir; d++) handle(d + 1);
        }

        return {
            minX,
            minY,
            maxX,
            maxY,
        };
    }
}

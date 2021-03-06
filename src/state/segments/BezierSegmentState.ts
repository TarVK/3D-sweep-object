import {DataCacher, Field, IDataHook} from "model-react";
import {approximateBezier} from "../../util/bezier/approximateBezier";
import {getPointOnBezier} from "../../util/bezier/getPointOnBezier";
import {getTangentOnBezier} from "../../util/bezier/getTangentOnBezier";
import {projectOnBezier} from "../../util/bezier/projectOnBezier";
import {sampleBezier} from "../../util/bezier/sampleBezier";
import {IBezier} from "../../util/bezier/_types/IBezier";
import {IBezierApproximationConfig} from "../../util/bezier/_types/IBezierApproximationConfig";
import {IBezierNode} from "../../util/bezier/_types/IBezierNode";
import {Vec2} from "../../util/linearAlgebra/Vec2";
import {Vec3} from "../../util/linearAlgebra/Vec3";
import {IBoundingBox} from "../_types/IBoundingBox";
import {ISegment} from "../_types/ISegment";

/**
 * A class to represent subscribable state of a bezier curve and handle some of its logic
 */
export class BezierSegmentState<D extends Vec2 | Vec3> implements ISegment<D> {
    protected start: Field<D>;
    protected startControl: Field<D>;
    protected endControl: Field<D>;
    protected end: Field<D>;

    protected plainBezier = new DataCacher<IBezier<D>>(h => ({
        start: this.start.get(h),
        startControl: this.startControl.get(h),
        endControl: this.endControl.get(h),
        end: this.end.get(h),
    }));

    // Linked bezier curves that are synchronized
    protected previous = new Field<ISegment<D> | null>(null);
    protected next = new Field<ISegment<D> | null>(null);

    /**
     * Creates a bezier representation of the straight line segment from start to end
     * @param start The start point of the segment
     * @param end The end point of the segment
     */
    public constructor(start: D, end: D);

    /**
     * Creates a bezier curve with the given start and end points, and the given controls to direct the curve
     * @param start The start point of the segment
     * @param startControl The control point to direct the start of the segment
     * @param endControl The control point to direct the end of the segment
     * @param end The end point of the segment
     */
    public constructor(start: D, startControl: D, endControl: D, end: D);
    public constructor(start: D, startControl: D, endControl?: D, end?: D) {
        if (end && endControl) {
            this.start = new Field(start);
            this.startControl = new Field(startControl);
            this.endControl = new Field(endControl);
            this.end = new Field(end);
        } else {
            end = startControl;

            this.start = new Field(start);
            this.startControl = new Field(start);
            this.endControl = new Field(end);
            this.end = new Field(end);
        }
    }

    // Utils
    public copy(): BezierSegmentState<D> {
        return new BezierSegmentState(
            this.start.get(),
            this.startControl.get(),
            this.endControl.get(),
            this.end.get()
        );
    }

    /**
     * Retrieves a point on the curve, given a position on the curve
     * @param t The position between 0 and 1
     * @param hook The hook to subscribe to changes
     * @returns The found point
     */
    public getPoint(t: number, hook?: IDataHook): D {
        return getPointOnBezier(this.getPlain(hook), t);
    }

    /**
     * Retrieves the direction that the curve has at the given position
     * @param t The position between 0 and 1
     * @param hook The hook to subscribe to changes
     * @returns The found direction
     */
    public getDirection(t: number, hook?: IDataHook): D {
        return getTangentOnBezier(this.getPlain(hook), t);
    }

    /**
     * Approximates this bezier curve using points and linear interpolation
     * @param config The configuration to subscribe to changes
     * @param hook The hook to subscribe to changes
     */
    public calculateApproximation(
        config: IBezierApproximationConfig,
        hook?: IDataHook
    ): IBezierNode<D>[] {
        return approximateBezier(this.getPlain(hook), config);
    }

    /**
     * Gets a plain representation of this bezier curve
     * @param hook The hook to subscribe to changes
     * @returns The plain object version of the bezier
     */
    public getPlain(hook?: IDataHook): IBezier<D> {
        return this.plainBezier.get(hook);
    }

    // Chaining
    public setPreviousSegment(
        segment: ISegment<D> | null,
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

            if (copyDirection)
                this.setStartDirection(segment.getEndDirection().mul(-1) as D);
            if (sync) segment.setNextSegment(this, false, false);
        } else {
            this.previous.set(null);
        }
    }
    public setNextSegment(
        segment: ISegment<D> | null,
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

            if (copyDirection)
                this.setEndDirection(segment.getStartDirection().mul(-1) as D);
            if (sync) segment.setPreviousSegment(this, false, false);
        } else {
            this.next.set(null);
        }
    }
    public getPreviousSegment(hook?: IDataHook): ISegment<D> | null {
        return this.previous.get(hook);
    }
    public getNextSegment(hook?: IDataHook): ISegment<D> | null {
        return this.next.get(hook);
    }

    // Getters
    public getStart(hook?: IDataHook): D {
        return this.start.get(hook);
    }
    public getEnd(hook?: IDataHook): D {
        return this.end.get(hook);
    }

    public getStartDirection(hook?: IDataHook): D {
        return this.startControl.get(hook).sub(this.start.get(hook) as Vec3) as D;
    }
    public getEndDirection(hook?: IDataHook): D {
        return this.endControl.get(hook).sub(this.end.get(hook) as Vec3) as D;
    }

    /**
     * Retrieves the control point that directs the start of the segment
     * @param hook The hook to subscribe to changes
     * @returns The control point
     */
    public getStartControl(hook?: IDataHook): D {
        return this.startControl.get(hook);
    }

    /**
     * Retrieves the control point to direct the end of the segment
     * @param hook The hook to subscribe to changes
     * @returns The control point
     */
    public getEndControl(hook?: IDataHook): D {
        return this.endControl.get(hook);
    }

    /**
     * Retrieves the direction of the control point that directs the start of the segment
     * @param hook The hook to subscribe to changes
     * @returns The control point
     */
    public getStartControlDelta(hook?: IDataHook): D {
        return this.startControl.get(hook).sub(this.start.get(hook) as Vec3) as D;
    }

    /**
     * Retrieves the direction of the control point to direct the end of the segment
     * @param hook The hook to subscribe to changes
     * @returns The control point
     */
    public getEndControlDelta(hook?: IDataHook): D {
        return this.endControl.get(hook).sub(this.end.get(hook) as Vec3) as D;
    }

    // Setters
    public setStart(vec: D, sync: boolean = true, move: boolean = true): void {
        if (move) {
            const delta = this.startControl.get().sub(this.start.get() as Vec3) as Vec3;
            this.startControl.set(vec.add(delta) as D);
        }

        this.start.set(vec);

        if (sync) {
            const prev = this.previous.get();
            if (prev) prev.setEnd(vec, false, move);
        }
    }
    public setEnd(vec: D, sync: boolean = true, move: boolean = true): void {
        if (move) {
            const delta = this.endControl.get().sub(this.end.get() as Vec3) as Vec3;
            this.endControl.set(vec.add(delta) as D);
        }

        this.end.set(vec);

        if (sync) {
            const next = this.next.get();
            if (next) next.setStart(vec, false, move);
        }
    }

    /**
     * Sets the control point that directs the start of the segment
     * @param vec The vector representing the control for the start direction
     * @param syncDir Whether to sync the neighbor direction
     */
    public setStartControl(vec: D, syncDir: boolean = true): void {
        this.startControl.set(vec);
        if (syncDir) {
            const previous = this.getPreviousSegment();
            if (!previous) return;

            previous.setEndDirection(this.getStartDirection().mul(-1) as D);
        }
    }

    /**
     * Sets the control point that directs the end of the segment
     * @param vec The vector representing the control for the end direction
     * @param syncDir Whether to sync the neighbor direction
     */
    public setEndControl(vec: D, syncDir: boolean = true): void {
        this.endControl.set(vec);
        if (syncDir) {
            const next = this.getNextSegment();
            if (!next) return;

            next.setStartDirection(this.getEndDirection().mul(-1) as D);
        }
    }

    /**
     * Sets the direction of the control point that directs the start of the segment
     * @param vec The vector representing the control for the start direction
     */
    public setStartControlDelta(vec: D): void {
        this.startControl.set(vec.add(this.start.get() as Vec3) as D);
    }

    /**
     * Sets the direction of the control point that directs the end of the segment
     * @param vec The vector representing the control for the end direction
     */
    public setEndControlDelta(vec: D): void {
        this.endControl.set(vec.add(this.end.get() as Vec3) as D);
    }

    public setStartDirection(direction: D): boolean {
        const length = this.getStartControlDelta().length();
        if (direction.length() == 0) return false;
        this.setStartControlDelta(direction.normalize().mul(length) as D);
        return true;
    }

    public setEndDirection(direction: D): boolean {
        const length = this.getEndControlDelta().length();
        if (direction.length() == 0) return false;
        this.setEndControlDelta(direction.normalize().mul(length) as D);
        return true;
    }

    // Segment approximation
    public approximate(points: number, skipLast: boolean, hook?: IDataHook): D[] {
        const nodes = sampleBezier(this.getPlain(hook), points);
        const out = skipLast ? nodes.slice(0, -1) : nodes;
        return out.map(({point}) => point) as D[];
    }

    // Interaction
    public getDistance(point: D): number {
        return projectOnBezier(this.getPlain(), point)
            .point.sub(point as Vec3)
            .length();
    }

    public split(point: D): [ISegment<D>, ISegment<D>] {
        const direction = getTangentOnBezier(
            this.getPlain(),
            projectOnBezier(this.getPlain(), point).position
        ).normalize() as Vec3;
        const dStart = this.start
            .get()
            .sub(point as Vec3)
            .length();
        const dEnd = this.end
            .get()
            .sub(point as Vec3)
            .length();

        return [
            new BezierSegmentState(
                this.start.get(),
                this.startControl.get(),
                point.sub(direction.mul(dStart / 2)) as D,
                point
            ),
            new BezierSegmentState(
                point,
                point.add(direction.mul(dEnd / 2)) as D,
                this.endControl.get(),
                this.end.get()
            ),
        ];
    }

    public combinePrevious(): ISegment<D> {
        const previous = this.previous.get() ?? this;
        return new BezierSegmentState(
            previous.getStart(),
            previous.getStartDirection().add(previous.getStart() as Vec3) as D,
            this.endControl.get(),
            this.end.get()
        );
    }

    public moveHandle(handle: string, to: D, moveAttachedPoints = true): void {
        if (handle == "start") this.setStart(to, true, moveAttachedPoints);
        else if (handle == "startControl") this.setStartControl(to, moveAttachedPoints);
        else if (handle == "endControl") this.setEndControl(to, moveAttachedPoints);
        else if (handle == "end") this.setEnd(to, true, moveAttachedPoints);
    }

    public getHandle(
        point: D,
        includeLast: boolean = false
    ): {distance: number; point: D; handle: string} {
        const start = this.getStart();
        const startControl = this.getStartControl();
        const endControl = this.getEndControl();

        const options = [
            {
                point: startControl,
                distance: startControl.sub(point as Vec3).length(),
                handle: "startControl",
            },
            {
                point: endControl,
                distance: endControl.sub(point as Vec3).length(),
                handle: "endControl",
            },
            {point: start, distance: start.sub(point as Vec3).length(), handle: "start"},
        ];

        if (includeLast) {
            const end = this.getEnd();
            options.push({
                point: end,
                distance: end.sub(point as Vec3).length(),
                handle: "end",
            });
        }

        return options.reduce(
            (best, option) => (option.distance < best.distance ? option : best),
            {point: start, distance: Infinity, handle: "start"}
        );
    }

    public getBoundingBox(hook?: IDataHook): IBoundingBox {
        const start = this.getStart(hook);
        const startControl = this.getStartControl(hook);
        const endControl = this.getEndControl(hook);
        const end = this.getEnd(hook);
        const minX = Math.min(start.x, startControl.x, endControl.x, end.x);
        const minY = Math.min(start.y, startControl.y, endControl.y, end.y);
        const maxX = Math.max(start.x, startControl.x, endControl.x, end.x);
        const maxY = Math.max(start.y, startControl.y, endControl.y, end.y);

        return {
            minX,
            minY,
            maxX,
            maxY,
        };
    }
}

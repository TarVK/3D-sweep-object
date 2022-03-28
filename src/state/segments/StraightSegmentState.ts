import {Field, IDataHook} from "model-react";
import {Vec2} from "../../util/Vec2";
import {Vec3} from "../../util/Vec3";
import {ISegment} from "../_types/ISegment";

/**
 * A class to represent subscribable straight line segments
 */
export class StraightSegmentState<D extends Vec2 | Vec3> implements ISegment<D> {
    protected start: Field<D>;
    protected end: Field<D>;

    // Linked bezier segments that are synchronized
    protected previous = new Field<ISegment<D> | null>(null);
    protected next = new Field<ISegment<D> | null>(null);

    /**
     * Creates a straight line segment from start to end
     * @param start The start point of the segment
     * @param end The end point of the segment
     */
    public constructor(start: D, end: D) {
        this.start = new Field(start);
        this.end = new Field(end);
    }

    // Utils
    public copy(): StraightSegmentState<D> {
        return new StraightSegmentState(this.start.get(), this.end.get());
    }

    /**
     * Retrieves a point on the segment, given a position on the segment
     * @param t The position between 0 and 1
     * @param hook The hook to subscribe to changes
     * @returns The found point
     */
    public getPoint(t: number, hook?: IDataHook): D {
        const start = this.start.get(hook);
        const end = this.end.get(hook);
        return end
            .sub(start as Vec3)
            .mul(t)
            .add(start as Vec3) as D;
    }

    // Chaining
    /**
     * Sets the previous segment, whose end is linked to this segment
     * @param segment The segment to be linked, or null to unlink segments
     * @param sync Whether to synchronize with the set neighbor
     */
    public setPreviousSegment(segment: ISegment<D> | null, sync: boolean = true): void {
        const current = this.previous.get();
        if (segment == current) return;
        if (sync && current) current.setNextSegment(null, false);

        if (segment) {
            this.previous.set(segment);

            const newStart = segment.getEnd();
            this.start.set(newStart);

            if (sync) segment.setNextSegment(this, false);
        } else {
            this.previous.set(null);
        }
    }

    /**
     * Sets the next segment, whose start is linked to this segment
     * @param segment The segment to be linked, or null to unlink segments
     * @param sync Whether to synchronize with the set neighbor
     */
    public setNextSegment(segment: ISegment<D> | null, sync: boolean = true): void {
        const current = this.next.get();
        if (segment == current) return;
        if (sync && current) current.setPreviousSegment(null, false);

        if (segment) {
            this.next.set(segment);

            const newEnd = segment.getStart();
            this.end.set(newEnd);

            if (sync) segment.setPreviousSegment(this, false);
        } else {
            this.next.set(null);
        }
    }

    /**
     * Retrieves the previously connected segment
     * @param hook The hook to subscribe to changes
     * @returns The currently connected segment that's ahead of this segment
     */
    public getPreviousSegment(hook?: IDataHook): ISegment<D> | null {
        return this.previous.get(hook);
    }

    /**
     * Retrieves the next connected segment
     * @param hook The hook to subscribe to changes
     * @returns The currently connected segment that's behind this segment
     */
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
        return this.end
            .get(hook)
            .sub(this.start.get(hook) as Vec3)
            .normalize() as D;
    }
    public getEndDirection(hook?: IDataHook): D {
        return this.start
            .get(hook)
            .sub(this.end.get(hook) as Vec3)
            .normalize() as D;
    }

    // Setters
    public setStart(vec: D, sync: boolean = true): void {
        this.start.set(vec);

        if (sync) {
            const prev = this.previous.get();
            if (prev) prev.setEnd(vec, false);
        }
    }
    public setEnd(vec: D, sync: boolean = true): void {
        this.end.set(vec);

        if (sync) {
            const next = this.next.get();
            if (next) next.setStart(vec, false);
        }
    }

    public setStartDirection(direction: D): boolean {
        return false;
    }

    public setEndDirection(direction: D): boolean {
        return false;
    }

    // Segment approximation
    public approximate(pointCount: number, skipLast: boolean, hook?: IDataHook): D[] {
        const steps = pointCount - 1;
        const points = new Array(pointCount)
            .fill(0)
            .map((_, i) => this.getPoint(i / steps, hook));
        return skipLast ? points.slice(0, -1) : points;
    }

    // Interaction
    public getDistance(point: D): number {
        const start = this.getStart();
        const end = this.getEnd();
        const dEnd = end.sub(start as Vec3);
        const dPoint = point.sub(start as Vec3);

        const per = dEnd.dot(dPoint as Vec3) / (dEnd.length() * dEnd.length());
        if (per < 0) return start.sub(point as Vec3).length();
        if (per > 1) return end.sub(point as Vec3).length();
        return dPoint.sub(dEnd.mul(per) as Vec3).length();
    }

    public combinePrevious(): ISegment<D> {
        return new StraightSegmentState(
            (this.previous.get() ?? this).getStart(),
            this.end.get()
        );
    }
    public split(point: D): [ISegment<D>, ISegment<D>] {
        return [
            new StraightSegmentState(this.start.get(), point),
            new StraightSegmentState(point, this.end.get()),
        ];
    }

    public moveHandle(handle: string, to: D): void {
        if (handle == "end") this.setEnd(to);
        else this.setStart(to);
    }

    public getHandle(
        point: D,
        includeLast: boolean = false
    ): {distance: number; point: D; handle: string} {
        const start = this.getStart();
        const startDistance = start.sub(point as Vec3).length();

        if (includeLast) {
            const end = this.getEnd();
            const endDistance = end.sub(point as Vec3).length();

            if (endDistance < startDistance)
                return {distance: endDistance, point: end, handle: "end"};
        }
        return {distance: startDistance, point: start, handle: "start"};
    }
}

import {Field, IDataHook} from "model-react";
import {ICrossSection} from "../sweepObject/_types/ICrossSection";
import {Vec2} from "../util/Vec2";
import {ISegment} from "./_types/ISegment";

/**
 * A class to represent a single cross section
 */
export class CrossSectionState {
    protected segments = new Field<ISegment<Vec2>[]>([]);
    protected rotation = new Field(0);
    protected scale = new Field(1);

    /**
     * Creates a new cross section
     * @param initial The initial segments of the cross-section, end points of subsequent segments should be connected
     */
    public constructor(initial: ISegment<Vec2>[]) {
        this.setSegments(initial, true);
    }

    // Getters
    /**
     * Retrieves a list of segments that make up this cross section
     * @param hook The hook to subscribe to changes
     * @returns The list of segments
     */
    public getSegments(hook?: IDataHook): ISegment<Vec2>[] {
        return this.segments.get(hook);
    }

    /**
     * Retrieves the rotation of this cross section in radians
     * @param hook The hook to subscribe to changes
     * @returns The rotation of this cross section in radians
     */
    public getRotation(hook?: IDataHook): number {
        return this.rotation.get(hook);
    }

    /**
     * Retrieves the scale of this cross section
     * @param hook The hook to subscribe to changes
     * @returns The scale of this cross section
     */
    public getScale(hook?: IDataHook): number {
        return this.scale.get(hook);
    }

    // Setters
    /**
     * Sets the segments that make up this cross section
     * @param segments The segments of the cross section
     * @param link Whether to link the segments together (if this isn't specified to true, the segments should already have been linked)
     */
    public setSegments(segments: ISegment<Vec2>[], link: boolean = false): void {
        this.segments.set(segments);
        if (link)
            for (let i = 0; i < segments.length; i++) {
                const segment = segments[i];
                const next = segments[(i + 1) % segments.length];
                segment.setNextSegment(next);
            }
    }

    /**
     * Sets the rotation of this cross section
     * @param angle The new angle of rotation, in radians
     */
    public setRotation(angle: number): void {
        this.rotation.set(angle);
    }

    /**
     * Sets the scale of this cross section
     * @param scale The new scale of this cross section
     */
    public setScale(scale: number): void {
        this.scale.set(scale);
    }

    // Utils
    /**
     * Adds a new segment to the cross section, such that it contains the given point
     * @param point The point to be added
     */
    public addPoint(point: Vec2): void {
        const segments = this.segments.get();
        const closestSegment = segments.reduce(
            (best, segment, index) => {
                const distance = segment.getDistance(point);
                return distance < best.distance ? {distance, segment, index} : best;
            },
            {distance: Infinity, segment: segments[0], index: 0}
        );

        const [replacement1, replacement2] = closestSegment.segment.split(point);

        const prevSegment =
            segments[(closestSegment.index + segments.length - 1) % segments.length];
        const nextSegment = segments[(closestSegment.index + 1) % segments.length];

        // Chain the new segments together
        prevSegment.setNextSegment(replacement1);
        replacement1.setNextSegment(replacement2);
        replacement2.setNextSegment(nextSegment);

        // Store the new list of segments
        this.segments.set([
            ...segments.slice(0, closestSegment.index),
            replacement1,
            replacement2,
            ...segments.slice(closestSegment.index + 1),
        ]);
    }

    /**
     * Deletes the given segment
     * @param segment The segment to be deleted
     * @returns Whether the segment could be deleted. At least 2 segments are required
     */
    public deleteSegment(segment: ISegment<Vec2>): boolean {
        const segments = this.segments.get();
        if (segments.length <= 2) return false;

        const index = segments.indexOf(segment);
        if (index != -1) {
            const prevSegment = segments[(index + segments.length - 1) % segments.length];
            const nextSegment = segments[(index + 1) % segments.length];

            // Chain the new segments together and store the new list of segment
            prevSegment.setNextSegment(nextSegment);
            this.segments.set([
                ...segments.slice(0, index),
                ...segments.slice(index + 1),
            ]);

            return true;
        }
        return false;
    }

    /**
     * Normalizes this cross section to one represented by a simple polygon
     * @param pointCount The number of points to approximate by, this should be higher than the number of segments
     * @param hook The hook to subscribe to changes
     * @returns The normalized cross section
     */
    public normalize(pointCount: number, hook?: IDataHook): ICrossSection {
        const out: Vec2[] = [];

        const segments = this.segments.get(hook);
        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];
            // TODO: Use overall distance in circumference
            const per = i / (segments.length - 1);
            const targetPoints = per * pointCount;
            const addPoints = out.length - targetPoints;

            if (addPoints > 0)
                out.push(
                    ...segment.approximate(
                        addPoints + 1, // +1 since we drop the last point
                        true
                    )
                );
        }

        // TODO: fix clockwise point orders

        return out;
    }
}

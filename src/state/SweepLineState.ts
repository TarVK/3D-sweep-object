import {DataCacher, Field, IDataHook} from "model-react";
import {ISweepLine} from "../sweepObject/_types/ISweepLine";
import {Vec2} from "../util/Vec2";
import {Vec3} from "../util/Vec3";
import {BezierSegmentState} from "./BezierSegmentState";
import {ISegment} from "./_types/ISegment";

/**
 * A class to represent sweep line state
 */
export class SweepLineState {
    protected segments = new Field<BezierSegmentState<Vec3>[]>([]);

    /**
     * Creates a new sweep line state
     * @param initial The initial curves to use for the sweep line
     */
    public constructor(initial: BezierSegmentState<Vec3>[]) {
        this.setSegments(initial);
    }

    // Getters
    /**
     * Retrieves a list of segments that make up this sweep line
     * @param hook The hook to subscribe to changes
     * @returns The list of bezier segments
     */
    public getSegments(hook?: IDataHook): BezierSegmentState<Vec3>[] {
        return this.segments.get(hook);
    }

    // Setters
    /**
     * Sets the list of bezier curves that make up this sweep line
     * @param segments The segments to be set
     * @param link Whether to link the segments together (if this isn't specified to true, the segments should already have been linked)
     */
    public setSegments(
        segments: BezierSegmentState<Vec3>[],
        link: boolean = false
    ): void {
        this.segments.set(segments);
        if (link) {
            for (let i = 0; i + 1 < segments.length; i++) {
                const segment = segments[i];
                const next = segments[i + 1];
                segment.setNextSegment(next);
            }

            const last = segments[segments.length - 1];
            last.setNextSegment(null);
        }
    }

    // Utils
    /** The normalized form of this sweep line*/
    protected normalized = new DataCacher(hook =>
        this.segments.get(hook).map(segment => segment.getPlain(hook))
    );

    /**
     * Normalizes this sweep line to a plain object
     * @param hook The hook to subscribe to changes
     * @returns The normalized cross section
     */
    public normalize(hook?: IDataHook): ISweepLine {
        return this.normalized.get(hook);
    }
}

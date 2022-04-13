import {DataCacher, Field, IDataHook} from "model-react";
import {ISweepLineNode} from "../sweepOperation/_types/spec/ISweepLineNode";
import {sampleBezier} from "../util/bezier/sampleBezier";
import {IBezierNode} from "../util/bezier/_types/IBezierNode";
import {Vec3} from "../util/linearAlgebra/Vec3";
import {BezierSegmentState} from "./segments/BezierSegmentState";

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
        this.setSegments(initial, true);
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
    /**
     * Samples the given sweep line
     * @param pointCount The number of points to be samples
     * @param hook The hook to subscribe to changes
     * @returns The sweep line samples with the requested number of elements
     */
    public sample(pointCount: number, hook?: IDataHook): ISweepLineNode[] {
        const out: ISweepLineNode[] = [];

        const segments = this.segments.get(hook);
        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];
            // TODO: Use overall distance in circumference
            const per = (i + 1) / segments.length;
            const targetPoints = Math.round(per * pointCount);
            const addPoints = targetPoints - out.length;

            if (addPoints > 0) {
                let points: IBezierNode<Vec3>[] = [];
                const dropFirstPoint = i != 0;
                if (dropFirstPoint)
                    points = sampleBezier(segment.getPlain(hook), addPoints + 1).slice(1);
                else points = sampleBezier(segment.getPlain(hook), addPoints);
                out.push(
                    ...points.map(({point, dir}) => ({
                        direction: dir,
                        position: point,
                    }))
                );
            }
        }

        return out;
    }

    /**
     * Retrieves the sweep line node at a given fraction
     * @param per The fraction between 0 and 1 to get the node at
     * @param hook The hook to subscribe to changes
     * @returns The sample node at the given position
     */
    public getNode(per: number, hook?: IDataHook): ISweepLineNode {
        const segments = this.segments.get(hook);

        const sl = segments.length;
        const increment = 1 / sl;
        const segmentIndex = Math.min(Math.floor(sl * per), sl - 1);

        const segmentPer = (per - increment * segmentIndex) / increment;
        const segment = segments[segmentIndex];
        const direction = segment.getDirection(segmentPer, hook);
        const position = segment.getPoint(segmentPer, hook);
        return {direction, position};
    }
}

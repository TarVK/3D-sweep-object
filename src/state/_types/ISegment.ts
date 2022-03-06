import {IDataHook} from "model-react";
import {Vec2} from "../../util/Vec2";
import {Vec3} from "../../util/Vec3";

export type ISegment<D extends Vec2 | Vec3> = {
    // Control the start/end points
    /**
     * Retrieves the start point of the bezier
     * @param hook The hook to subscribe to changes
     * @returns The start point
     */
    getStart(hook?: IDataHook): D;
    /**
     * Retrieves the end point of the bezier
     * @param hook The hook to subscribe to changes
     * @returns The end point
     */
    getEnd(hook?: IDataHook): D;

    /**
     * Sets the start point of this segment
     * @param point The point to be set
     * @param sync Whether to synchronize with its neighbor
     */
    setStart(point: D, sync?: boolean): void;
    /**
     * Sets the end point of this segment
     * @param point The point to be set
     * @param sync Whether to synchronize with its neighbor
     */
    setEnd(point: D, sync?: boolean): void;

    // Direction
    /**
     * Retrieves the direction vector at the start of the segment
     * @param hook The hook to subscribe to changes
     * @returns The direction at the start point, pointing towards the segment
     */
    getStartDirection(hook?: IDataHook): D;
    /**
     * Retrieves the direction vector at the end of the segment
     * @param hook The hook to subscribe to changes
     * @returns The direction at the end point, pointing towards the segment
     */
    getEndDirection(hook?: IDataHook): D;
    /**
     * Sets the start direction if possible
     * @param direction The direction to be set
     */
    setStartDirection(direction: D): void;
    /**
     * Sets the end direction if possible
     * @param direction The direction to be set
     */
    setEndDirection(direction: D): void;

    // Control connected segments
    /**
     * Sets the next neighboring segment which should have shared points
     * @param segment The segment to be set
     * @param sync Whether to synchronize with the set neighbor
     */
    setNextSegment(segment: ISegment<D> | null, sync?: boolean): void;
    /**
     * Sets the previous neighboring segment which should have shared points
     * @param segment The segment to be set
     * @param sync Whether to synchronize with the set neighbor
     */
    setPreviousSegment(segment: ISegment<D> | null, sync?: boolean): void;

    // Approximating the segment
    /**
     * Retrieves the recommended amount of points to use for approximating this segment
     * @param precision The curvature precision for the recommendation
     * @returns The number of points to use
     */
    getRecommendedApproximationPointCount(precision: number): number;

    /**
     * Approximates this segment by a list of points that can be linearly interpolated
     * @param points The number of points to approximate the segment by
     * @param skipLast Whether the last point should not be excluded of the result
     * @returns The list of points that approximate the segment
     */
    approximate(points: number, skipLast: boolean): D[];
};

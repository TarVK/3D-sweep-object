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
     * @returns Whether the segment allowed for updating of the direction
     */
    setStartDirection(direction: D): boolean;
    /**
     * Sets the end direction if possible
     * @param direction The direction to be set
     * @returns Whether the segment allowed for updating of the direction
     */
    setEndDirection(direction: D): boolean;

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
     * Approximates this segment by a list of points that can be linearly interpolated
     * @param points The number of points to approximate the segment by
     * @param skipLast Whether the last point should not be excluded of the result
     * @returns The list of points that approximate the segment
     */
    approximate(points: number, skipLast: boolean): D[];

    // Interaction
    /**
     * Splits this segment into two new segments with the given point as commonly shared start/endpoint
     * @param point The point to split this segment at
     * @returns The resulting end point
     */
    split(point: D): [ISegment<D>, ISegment<D>];

    /**
     * Combines this segment and its specified next segment into a new segment, such that the next segment can be removed
     * @returns The combined segment
     */
    combineNext(): ISegment<D>;

    /**
     * Retrieves the approximate distance between the given point and this segment
     * @param point The point to get the distance to
     * @returns The approximate distance to this curve
     */
    getDistance(point: D): number;
};

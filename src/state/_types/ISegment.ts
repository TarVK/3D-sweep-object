import {IDataHook} from "model-react";
import {Vec2} from "../../util/linearAlgebra/Vec2";
import {Vec3} from "../../util/linearAlgebra/Vec3";
import {IBoundingBox} from "./IBoundingBox";

export type ISegment<D extends Vec2 | Vec3> = {
    /**
     * Copies the data of this segment into a new segment
     * @returns The copied segment
     */
    copy(): ISegment<D>;

    /**
     * Retrieves the bounding box of the segment
     * @param hook The hook to subscribe to changes
     * @returns The axis aligned bounding box of this segment
     */
    getBoundingBox(hook?: IDataHook): IBoundingBox;

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
     * @param move Whether to move along reference points
     */
    setStart(point: D, sync?: boolean, move?: boolean): void;
    /**
     * Sets the end point of this segment
     * @param point The point to be set
     * @param sync Whether to synchronize with its neighbor
     * @param move Whether to move along reference points
     */
    setEnd(point: D, sync?: boolean, move?: boolean): void;

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
     * @param copyDirection Whether to make sure the curves' directions should be linked
     */
    setNextSegment(
        segment: ISegment<D> | null,
        sync?: boolean,
        copyDirection?: boolean
    ): void;
    /**
     * Sets the previous neighboring segment which should have shared points
     * @param segment The segment to be set
     * @param sync Whether to synchronize with the set neighbor
     * @param copyDirection Whether to make sure the curves' directions should be linked
     */
    setPreviousSegment(
        segment: ISegment<D> | null,
        sync?: boolean,
        copyDirection?: boolean
    ): void;
    /**
     * Retrieves the previously connected curve
     * @param hook The hook to subscribe to changes
     * @returns The currently connected curve that's ahead of this curve
     */
    getPreviousSegment(hook?: IDataHook): ISegment<D> | null;
    /**
     * Retrieves the next connected curve
     * @param hook The hook to subscribe to changes
     * @returns The currently connected curve that's behind this curve
     */
    getNextSegment(hook?: IDataHook): ISegment<D> | null;

    // Approximating the segment
    /**
     * Approximates this segment by a list of points that can be linearly interpolated
     * @param points The number of points to approximate the segment by
     * @param skipLast Whether the last point should not be excluded of the result
     * @param hook The hook to subscribe to changes
     * @returns The list of points that approximate the segment
     */
    approximate(points: number, skipLast: boolean, hook?: IDataHook): D[];

    // Interaction
    /**
     * Splits this segment into two new segments with the given point as commonly shared start/endpoint
     * @param point The point to split this segment at
     * @returns The resulting end point
     */
    split(point: D): [ISegment<D>, ISegment<D>];

    /**
     * Combines this segment and its specified previous segment into a new segment, such that the previous segment can be removed
     * @returns The combined segment
     */
    combinePrevious(): ISegment<D>;

    /**
     * Moves the given handle to the given location
     * @param handle The id of the handle to move
     * @param to The location to move the handle to
     * @param syncNeighborDirections Whether to synchronize neighbor directions
     */
    moveHandle(handle: string, to: D, syncNeighborDirections?: boolean): void;

    /**
     * Retrieves the handle of this segment closest to the given point
     * @param point The point for which to get the closest handle
     * @param includeLast Whether to include the last handle (could be set to false if the next segment starts at the end of this segment), defaults to false
     * @returns The distance to the closest handle and the handle itself
     */
    getHandle(
        point: D,
        includeLast?: boolean
    ): {distance: number; point: D; handle: string};

    /**
     * Retrieves the approximate distance between the given point and this segment
     * @param point The point to get the distance to
     * @returns The approximate distance to this curve
     */
    getDistance(point: D): number;
};

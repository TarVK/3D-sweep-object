import {Vec2} from "../../../util/Vec2";

/** The generic part of the sweep object specification concerning a cross section */
export type ICrossSectionSpecification = {
    /**
     * The sample function to retrieve the points cycle of this cross section for a given number of points
     * @param points The number of points to retrieve
     * @returns The approximation of this cross section with the given number of points
     */
    sample: (points: number) => Vec2[];
    /** The position of this cross section along the sweep (ranges from [0, 1]) */
    position: number;
    /** The scale that this cross section should have */
    scale: number;
    /** The rotation of this cross section on the whole */
    angle: number;
};

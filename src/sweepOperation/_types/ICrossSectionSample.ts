import {Vec2} from "../../util/linearAlgebra/Vec2";

export type ICrossSectionSample = {
    /** The points that make up this cross section */
    points: Vec2[];
    /** The rotation of this cross section along the remaining free axis */
    angle: number;
    /** The scale fo this cross section */
    scale: number;
    /** The position of the cross section along the sweep line (ranges from 0 to 1) */
    position: number;
};

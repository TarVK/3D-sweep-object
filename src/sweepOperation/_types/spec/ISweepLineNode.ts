import {Vec3} from "../../../util/linearAlgebra/Vec3";

export type ISweepLineNode = {
    /** The position of the node in 3d space */
    position: Vec3;
    /** The direction of the cross section to place at this node */
    direction: Vec3;
};

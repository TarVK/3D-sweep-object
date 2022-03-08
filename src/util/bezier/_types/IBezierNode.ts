import {Vec2} from "../../Vec2";
import {Vec3} from "../../Vec3";

export type IBezierNode<D extends Vec2 | Vec3> = {
    /** The point of the bezier curve */
    point: D;
    /** The direction of the bezier at this point */
    dir: D;
};

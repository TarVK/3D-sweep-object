import {Vec2} from "../../Vec2";
import {Vec3} from "../../Vec3";

export type IBezier<D extends Vec2 | Vec3> = {
    /** The start point */
    start: D;
    /** The control point specifying the start direction of the line */
    startControl: D;
    /** The control point specifying the end direction of the line */
    endControl: D;
    /** The end point */
    end: D;
};

import {I2DPointJSON} from "./I2DPointJSON";
import {I3DPointJSON} from "./I3DPointJSON";

export type IBezierJSON<P extends I2DPointJSON | I3DPointJSON> = {
    /** The type of this line */
    type: "bezier";
    /** The start point of the bezier curve */
    start: P;
    /** The directional control point of the start of the curve */
    startControl: P;
    /** The directional control point of the end of the curve */
    endControl: P;
    /** The end point of the bezier curve */
    end: P;
};

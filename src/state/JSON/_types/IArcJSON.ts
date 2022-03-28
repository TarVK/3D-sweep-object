import {I2DPointJSON} from "./I2DPointJSON";
import {I3DPointJSON} from "./I3DPointJSON";

export type IArcJSON<P extends I2DPointJSON | I3DPointJSON> = {
    /** The type of this line */
    type: "arc";
    /** The start point of the arc */
    start: P;
    /** The control point the arc passes through */
    control: P;
    /** The end point of the arc */
    end: P;
};

import {I2DPointJSON} from "./I2DPointJSON";
import {I3DPointJSON} from "./I3DPointJSON";

export type IStraightLineJSON<P extends I2DPointJSON | I3DPointJSON> = {
    /** The type of this line */
    type: "straight";
    /** The start point of the straight line */
    start: P;
    /** The end point of the straight line */
    end: P;
};

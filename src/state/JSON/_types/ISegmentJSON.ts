import {I2DPointJSON} from "./I2DPointJSON";
import {I3DPointJSON} from "./I3DPointJSON";
import {IArcJSON} from "./IArcJSON";
import {IBezierJSON} from "./IBezierJSON";
import {IStraightLineJSON} from "./IStraightLineJSON";

export type ISegmentJSON<D extends I2DPointJSON | I3DPointJSON> =
    | IBezierJSON<D>
    | IStraightLineJSON<D>
    | IArcJSON<D>;

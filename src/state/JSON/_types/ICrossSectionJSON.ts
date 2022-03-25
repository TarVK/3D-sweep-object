import {I2DPointJSON} from "./I2DPointJSON";
import {ISegmentJSON} from "./ISegmentJSON";

export type ICrossSectionJSON = {
    /** The position of the cross section along the sweep line (between 0 and 1) */
    position: number;
    /** The rotation of the cross section in radians */
    angle: number;
    /** The scale of this cross section */
    scale: number;
    /** The segments of the cross section */
    segments: ISegmentJSON<I2DPointJSON>[];
};

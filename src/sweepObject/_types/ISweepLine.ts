import {Vec3} from "../../util/Vec3";

export type ISweepLine = {
    /** The start point of the sweep line */
    start: Vec3;
    /** The control point of the bezier curve that indicates the starting direction, the amplitude is redundant and will be replaced by the one specified in the first segment */
    startControl: Vec3;
    /** The segments of the sweep line. These segments together with the start point and startControl represent smoothly connecting cubic bezier curves */
    segments: ILineSegment[];
};

export type ILineSegment = {
    /** The magnitude to use for the difference between the first control point and the segment's start point. The direction is inferred from the previous control point */
    startControlAmplitude: number;
    /** The control point of the bezier curve that indicates the end direction */
    endControl: Vec3;
    /** The point that the line ends in */
    end: Vec3;
};

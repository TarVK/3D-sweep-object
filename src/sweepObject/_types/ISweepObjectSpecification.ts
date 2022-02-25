import {ICrossSection} from "./ICrossSection";
import {ISweepLine} from "./ISweepLine";

export type ISweepObjectSpecification = {
    /** The sweep line to be used for the object */
    sweepLine: ISweepLine;
    /** The distance between points on the sweep line */
    sweepPointDistance: number;
    /** The cross section to be swept  */
    crossSection: ICrossSection;
};

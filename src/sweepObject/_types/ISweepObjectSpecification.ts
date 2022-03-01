import {ICrossSection} from "./ICrossSection";
import {ISweepLine} from "./ISweepLine";

export type ISweepObjectSpecification = {
    /** The sweep line to be used for the object */
    sweepLine: ISweepLine;
    /** The number of sample points */
    sampleCount: number;
    /** The cross section to be swept  */
    crossSection: ICrossSection;
};

import {IRange} from "../../../state/JSON/_types/IRange";
import {ICrossSectionSpecification} from "./ICrossSectionSpecification";
import {ISweepLineSpecification} from "./ISweepLineSpecification";

export type ISweepObjectSpecification = {
    /** The sweep line to be used for the object */
    sweepLine: ISweepLineSpecification;
    /**
     * The cross section to be swept.
     * There should be at least 2 cross section specifications, for which the first should have position 0 and the last position 1.
     * The cross sections should be sorted according to their position value.
     */
    crossSections: ICrossSectionSpecification[];
    /** The number of sample points */
    sampleCount: {
        /** The number of points to approximate the sweep line by */
        sweepLine: number;
        /** The number of points to approximate the cross sections by */
        crossSection: number;
    };
    /** The range of the sweep line to be used */
    range?: IRange;
};

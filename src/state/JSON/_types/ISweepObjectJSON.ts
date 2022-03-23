import {ICrossSectionJSON} from "./ICrossSectionJSON";
import {ISweepLineJSON} from "./ISweepLineJSON";

export type ISweepObjectJSON = {
    /** The number of samples to take */
    samples: {
        /** The number of samples to take along the sweep line */
        sweepLine: number;
        /** The number of samples to take on every cross section */
        crossSection: number;
    };
    /** The sweep line specification */
    sweepLine: ISweepLineJSON;
    /** The cross sections specification, where the positions should be sorted in the list */
    crossSections: ICrossSectionJSON[];
};

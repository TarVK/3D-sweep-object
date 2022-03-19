import {ISweepLineNode} from "./ISweepLineNode";

/** The generic part of the sweep object specification concerning the sweep line */
export type ISweepLineSpecification = {
    /**
     * The sample function to retrieve the positions to place cross sections at
     * @param samples The number of samples to retrieve
     * @returns The samples along this sweep line
     */
    sample: (samples: number) => ISweepLineNode[];
};

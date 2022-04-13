import {ISweepLineNode} from "./ISweepLineNode";

/** The generic part of the sweep object specification concerning the sweep line */
export type ISweepLineSpecification = {
    /**
     * The sample function retrieves the positions to place cross sections at
     * @param samples The number of samples to retrieve
     * @returns The samples along this sweep line
     */
    sample: (samples: number) => ISweepLineNode[];
    /**
     * The samplePoint function retrieves one position corresponding to the given fraction between 0 and 1
     * @param per The fraction of the path to get the node for
     * @returns The node at this point
     */
    samplePoint: (per: number) => ISweepLineNode;
};

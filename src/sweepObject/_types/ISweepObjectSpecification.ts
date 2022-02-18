import { Vec3 } from "../../util/Vec3";
// import { ICrossSection } from "./ICrossSection";
// import {ISweepLine} from "./ISweepLine";

export type ISweepObjectSpecification = {
    /** The sweep line to be used for the object */
    // sweepLine: ISweepLine;
    // crossSection: ICrossSection;
    sweepLine: Vec3[];
    crossSection: Vec3[];
};

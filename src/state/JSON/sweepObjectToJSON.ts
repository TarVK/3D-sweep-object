import {IDataHook} from "model-react";
import {SweepObjectState} from "../SweepObjectState";
import {crossSectionToJSON} from "./crossSectionToJSON";
import {bezierSegmentToJSON, segmentToJSON} from "./segmentToJSON";
import {ISweepObjectJSON} from "./_types/ISweepObjectJSON";

/**
 * Transforms a given sweep object state into a plain JSON representation
 * @param sweepObject The sweep object to be transformed to JSON
 * @param hook The hook to subscribe to changes
 * @returns The pure JSON representation of the sweep object
 */
export function sweepObjectToJSON(
    sweepObject: SweepObjectState,
    hook?: IDataHook
): ISweepObjectJSON {
    return {
        samples: {
            crossSection: sweepObject.getCrossSectionInterpolationPointCount(hook),
            sweepLine: sweepObject.getSweepLineInterpolationPointCount(hook),
        },
        crossSections: sweepObject
            .getCrossSections(hook)
            .map(crossSection => crossSectionToJSON(crossSection, hook)),
        sweepLine: sweepObject
            .getSweepLine()
            .getSegments(hook)
            .map(segment => bezierSegmentToJSON(segment, hook)),
    };
}

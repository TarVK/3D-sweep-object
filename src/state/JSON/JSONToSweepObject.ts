import {SweepLineState} from "../SweepLineState";
import {SweepObjectState} from "../SweepObjectState";
import {crossSectionJSONToCrossSection, VCrossSection} from "./JSONToCrossSection";
import {bezierJSONToBezier, VBezier} from "./JSONToSegment";
import {VArray, VNumber, VObject} from "./verifier/verifiers";
import {IVerifier} from "./verifier/_types/IVerifier";
import {IImportResult} from "./_types/IImportResult";
import {IJSON} from "./_types/IJSON";
import {ISweepObjectJSON} from "./_types/ISweepObjectJSON";

/**
 * Tries to import the given JSON sweep object
 * @param json The json data to be converted
 * @returns Either the sweep object or an error
 */
export function JSONToSweepObject(json: IJSON): IImportResult<SweepObjectState> {
    const verification = VSweepObject()(json);
    if ("errors" in verification) return verification;

    return {result: sweepObjectJSONToSweepObject(verification.result)};
}

/**
 * Converts JSON sweep object data to a sweep object state
 * @param json The JSON sweep object data
 * @returns The sweep object state
 */
export function sweepObjectJSONToSweepObject(json: ISweepObjectJSON): SweepObjectState {
    const crossSections = json.crossSections.map(crossSectionJSONToCrossSection);
    const sweepLine = new SweepLineState(json.sweepLine.map(bezierJSONToBezier));
    const sweepObject = new SweepObjectState(sweepLine, crossSections);
    sweepObject.setCrossSectionInterpolationPointCount(json.samples.crossSection);
    sweepObject.setSweepLineInterpolationPointCount(json.samples.sweepLine);
    return sweepObject;
}

/**
 * Creates a sweep object JSON verifier
 * @returns The verifier
 */
export const VSweepObject = (): IVerifier<ISweepObjectJSON> =>
    VObject({
        samples: VObject({
            crossSection: VNumber({min: 1}),
            sweepLine: VNumber({min: 1}),
        }),
        sweepLine: VArray(VBezier(3)),
        crossSections: VArray(VCrossSection()),
    });

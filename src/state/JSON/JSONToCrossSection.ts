import {CrossSectionState} from "../CrossSectionState";
import {segmentJSONToSegment, VSegment} from "./JSONToSegment";
import {VArray, VNumber, VObject} from "./verifier/verifiers";
import {IVerifier} from "./verifier/_types/IVerifier";
import {ICrossSectionJSON} from "./_types/ICrossSectionJSON";
import {IImportResult} from "./_types/IImportResult";
import {IJSON} from "./_types/IJSON";

/**
 * Tries to import the given JSON cross section
 * @param json The json data to be converted
 * @returns Either the cross section or an error
 */
export function JSONToCrossSection(json: IJSON): IImportResult<CrossSectionState> {
    const verification = VCrossSection()(json);
    if ("errors" in verification) return verification;

    return {result: crossSectionJSONToCrossSection(verification.result)};
}

/**
 * Converts JSON cross section data to a cross section state
 * @param json The JSON cross-section data
 * @returns The cross section state
 */
export function crossSectionJSONToCrossSection(
    json: ICrossSectionJSON
): CrossSectionState {
    const segments = json.segments.map(segment => segmentJSONToSegment(segment));
    const crossSection = new CrossSectionState(segments);
    crossSection.setPosition(json.position);
    crossSection.setRotation(json.angle);
    crossSection.setScale(json.scale);
    return crossSection;
}

/**
 * Creates a cross section JSON verifier
 * @returns The verifier
 */
export const VCrossSection = (): IVerifier<ICrossSectionJSON> =>
    VObject({
        position: VNumber({min: 0, max: 1}),
        angle: VNumber(),
        scale: VNumber({min: 0}),
        segments: VArray(VSegment(2)),
    });

import {ICrossSectionSample} from "./_types/ICrossSectionSample";
import {ICrossSectionSpecification} from "./_types/spec/ICrossSectionSpecification";

/**
 * Samples the given cross section using the indicated number of points
 * @param crossSectionSpec The specification of the cross section to be sampled
 * @param sampleCount The number of samples to take from the cross section
 * @returns The sampled cross section specification
 */
export function sampleCrossSection(
    crossSectionSpec: ICrossSectionSpecification,
    sampleCount: number
): ICrossSectionSample {
    return {
        points: crossSectionSpec.sample(sampleCount),
        angle: crossSectionSpec.angle,
        position: crossSectionSpec.position,
        scale: crossSectionSpec.scale,
    };
}

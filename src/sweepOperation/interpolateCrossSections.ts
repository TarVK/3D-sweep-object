import {ICrossSectionSample} from "./_types/ICrossSectionSample";

/**
 * Linearly interpolates the given two cross section samples
 * @param crossSectionA The first cross section to interpolate with
 * @param crossSectionB The second cross section to interpolate with
 * @param per The fraction (between 0 and 1) of cross section B to use
 * @returns The interpolated cross section
 */
export function interpolateCrossSections(
    crossSectionA: ICrossSectionSample,
    crossSectionB: ICrossSectionSample,
    per: number
): ICrossSectionSample {
    const iPer = 1 - per;
    const angle = crossSectionA.angle * iPer + crossSectionB.angle * per;
    const scale = crossSectionA.scale * iPer + crossSectionB.scale * per;
    const position = crossSectionA.position * iPer + crossSectionB.position * per;
    const points = crossSectionA.points.map((pa, i) => {
        const pb = crossSectionB.points[i];
        return pa.mul(iPer).add(pb.mul(per));
    });
    return {
        points,
        angle,
        scale,
        position,
    };
}

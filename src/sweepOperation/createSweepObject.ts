import {assembleSweepObject} from "./core/assembleSweepObject";
import {ICrossSectionNode} from "./core/_types/ICrossSectionNode";
import {interpolateCrossSections} from "./interpolateCrossSections";
import {sampleCrossSection} from "./sampleCrossSection";
import {ICrossSectionSample} from "./_types/ICrossSectionSample";
import {IMesh} from "./_types/IMesh";
import {ICrossSectionSpecification} from "./_types/spec/ICrossSectionSpecification";
import {ISweepObjectSpecification} from "./_types/spec/ISweepObjectSpecification";

/**
 * Creates a mesh from a given sweep object specification
 * @param spec The specification for the sweep to perform
 * @returns The created mesh
 */
export function performObjectSweep({
    sweepLine,
    crossSections,
    sampleCount: {sweepLine: sweepLineSampleCount, crossSection: crossSectionSampleCount},
}: ISweepObjectSpecification): IMesh {
    if (sweepLineSampleCount < 2)
        throw Error("At least 2 samples should be taken from the sweep line");
    if (crossSectionSampleCount < 3)
        throw Error("At least 3 samples should be taken from the cross sections");
    if (crossSections.length < 1)
        throw Error("At least 1 cross section should be provided");

    const crossSectionNodes: ICrossSectionNode[] = [];
    const sweepNodes = sweepLine.sample(sweepLineSampleCount);

    // Create the intermediate cross sections and their transformations in 3d space
    let crossSectionIndex = 0;
    let lastCrossSectionSample: ICrossSectionSample = sampleCrossSection(
        crossSections[crossSectionIndex],
        crossSectionSampleCount
    );
    let nextCrossSectionSample: ICrossSectionSample = lastCrossSectionSample;
    for (let i = 0; i < sweepLineSampleCount; i++) {
        const sweepNode = sweepNodes[i];
        const per = i / (sweepLineSampleCount - 1);

        while (
            nextCrossSectionSample.position < per &&
            crossSectionIndex < crossSections.length - 1
        ) {
            crossSectionIndex++;
            lastCrossSectionSample = nextCrossSectionSample;
            nextCrossSectionSample = sampleCrossSection(
                crossSections[crossSectionIndex],
                crossSectionSampleCount
            );
        }

        const lPer = lastCrossSectionSample.position;
        const nPer = nextCrossSectionSample.position;
        const interpolatePer = nPer - lPer <= 0 ? 0 : per - lPer / nPer - lPer;
        const interpolatedSample =
            interpolatePer >= 1
                ? nextCrossSectionSample
                : interpolateCrossSections(
                      lastCrossSectionSample,
                      nextCrossSectionSample,
                      interpolatePer
                  );
        crossSectionNodes.push({
            ...sweepNode,
            angle: interpolatedSample.angle,
            scale: interpolatedSample.scale,
            crossSection: interpolatedSample.points,
        });
    }

    // Create the 3d object corresponding to these cross sections
    const mesh = assembleSweepObject(crossSectionNodes);
    return mesh;
}

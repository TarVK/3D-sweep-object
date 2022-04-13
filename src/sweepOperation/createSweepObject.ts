import {assembleSweepObject} from "./core/assembleSweepObject";
import {ICrossSectionNode} from "./core/_types/ICrossSectionNode";
import {interpolateCrossSections} from "./interpolateCrossSections";
import {sampleCrossSection} from "./sampleCrossSection";
import {ICrossSectionSample} from "./_types/ICrossSectionSample";
import {ISweepLineNode} from "./_types/spec/ISweepLineNode";
import {IMesh} from "./_types/IMesh";
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
    range: {start, end} = {start: 0, end: 1},
}: ISweepObjectSpecification): IMesh {
    if (sweepLineSampleCount < 2)
        throw Error("At least 2 samples should be taken from the sweep line");
    if (crossSectionSampleCount < 3)
        throw Error("At least 3 samples should be taken from the cross sections");
    if (crossSections.length < 1)
        throw Error("At least 1 cross section should be provided");

    // Define the output node list
    const crossSectionNodes: ICrossSectionNode[] = [];
    const addCrossSection = (
        sweepNode: ISweepLineNode,
        crossSectionSample: ICrossSectionSample
    ) => {
        crossSectionNodes.push({
            ...sweepNode,
            angle: crossSectionSample.angle,
            scale: crossSectionSample.scale,
            crossSection: crossSectionSample.points,
        });
    };

    // Define a function to create intermediate cross sections (note that it expects per to be passed in ascending order)
    let crossSectionIndex = 0;
    let lastCrossSectionSample: ICrossSectionSample = sampleCrossSection(
        crossSections[crossSectionIndex],
        crossSectionSampleCount
    );
    let nextCrossSectionSample: ICrossSectionSample = lastCrossSectionSample;
    const getInterpolationSample = (per: number) => {
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
        const interpolatePer = nPer - lPer <= 0 ? 0 : (per - lPer) / (nPer - lPer);
        const interpolatedSample =
            interpolatePer >= 1
                ? nextCrossSectionSample
                : interpolateCrossSections(
                      lastCrossSectionSample,
                      nextCrossSectionSample,
                      interpolatePer
                  );
        return interpolatedSample;
    };

    // Create the intermediate cross sections and their transformations in 3d space
    const sweepNodes = sweepLine.sample(sweepLineSampleCount);
    const steps = sweepLineSampleCount - 1;
    for (let i = 0; i < sweepLineSampleCount; i++) {
        const sweepNode = sweepNodes[i];

        const prevPer = Math.max(0, i - 1) / steps;
        const per = i / steps;
        const nextPer = Math.min(i + 1, sweepLineSampleCount - 1) / steps;

        // Add the cross sections and possibly start/stop cross sections
        if (prevPer < start && per > start)
            addCrossSection(sweepLine.samplePoint(start), getInterpolationSample(start));

        if (per >= start && per <= end)
            addCrossSection(sweepNode, getInterpolationSample(per));

        if (per < end && nextPer > end)
            addCrossSection(sweepLine.samplePoint(end), getInterpolationSample(end));
    }

    // Create the 3d object corresponding to these cross sections
    const mesh = assembleSweepObject(crossSectionNodes);
    return mesh;
}

import {DataCacher, Field, IDataHook} from "model-react";
import {performObjectSweep} from "../sweepOperation/createSweepObject";
import {IMesh} from "../sweepOperation/_types/IMesh";
import {ICrossSectionSpecification} from "../sweepOperation/_types/spec/ICrossSectionSpecification";
import {ISweepLineNode} from "../sweepOperation/_types/spec/ISweepLineNode";
import {ISweepLineSpecification} from "../sweepOperation/_types/spec/ISweepLineSpecification";
import {ISweepObjectSpecification} from "../sweepOperation/_types/spec/ISweepObjectSpecification";
import {Vec2} from "../util/Vec2";
import {CrossSectionState} from "./CrossSectionState";
import {SweepLineState} from "./SweepLineState";

/**
 * A class to represent a sweep object
 */
export class SweepObjectState {
    protected crossSections = new Field<CrossSectionState[]>([]);
    protected sweepLine: SweepLineState;
    // TODO: add getter/setters
    protected sweepLineInterpolationPoints = new Field(20);
    protected crossSectionInterpolationPoints = new Field(30);

    /**
     * Creates a new sweep object from the given cross sections and sweepline
     * @param initialSweepLine The initial sweep line
     * @param initialCrossSections The initial cross sections
     */
    public constructor(
        initialSweepLine: SweepLineState,
        initialCrossSections: CrossSectionState[]
    ) {
        this.sweepLine = initialSweepLine;
        this.crossSections.set(initialCrossSections);
    }

    // Getters
    /**
     * Retrieves the sweep line of this this sweep object
     * @returns The sweep line of this object
     */
    public getSweepLine(): SweepLineState {
        return this.sweepLine;
    }

    /**
     * Retrieves the cross sections used by this sweep object
     * @param hook The hook to subscribe to changes
     * @returns The cross section states
     */
    public getCrossSections(hook?: IDataHook): CrossSectionState[] {
        return this.crossSections.get(hook);
    }

    /**
     * Retrieves the mesh of this sweep object
     * @param hook The hook to subscribe to changes
     * @returns The created mesh
     */
    public getMesh(hook?: IDataHook): IMesh | null {
        return this.object.get(hook);
    }

    /**
     * Retrieves the number of points to sample the sweep line with
     * @param hook The hook to subscribe to changes
     * @returns The number of points to approximate the sweep line by
     */
    public getSweepLineInterpolationPointCount(hook?: IDataHook): number {
        return this.sweepLineInterpolationPoints.get(hook);
    }

    /**
     * Retrieves the number of points to sample each cross section with
     * @param hook The hook too subscribe to changes
     * @returns The number of points to approximate the cross sections by
     */
    public getCrossSectionInterpolationPointCount(hook?: IDataHook): number {
        return this.crossSectionInterpolationPoints.get(hook);
    }

    // Setters
    /**
     * Sets the cross sections of this object
     * @param crossSections The cross sections for this object
     */
    public setCrossSections(crossSections: CrossSectionState[]): void {
        this.crossSections.set(crossSections);
    }

    // Utils
    /** A cache for the sweep object itself */
    protected object = new DataCacher(hook =>
        performObjectSweep(this.sweepSpec.get(hook))
    );

    // Some data caches in order to only recompute relevant parts of the mesh when necessary
    /** A cache of caches for each of the cross sections that store the cross section's normalized form */
    protected crossSectionsCaches = new DataCacher<
        DataCacher<ICrossSectionSpecification>[]
    >(hook => {
        const points = this.crossSectionInterpolationPoints.get(hook);
        return this.crossSections.get(hook).map(
            crossSection =>
                new DataCacher(h => {
                    let cached: null | {
                        count: number;
                        result: Vec2[];
                    } = null;

                    return {
                        position: crossSection.getPosition(h),
                        scale: crossSection.getScale(h),
                        angle: crossSection.getRotation(h),
                        sample: pointCount => {
                            if (cached?.count == pointCount) return cached.result;
                            const sampled = crossSection.normalize(pointCount, h);
                            cached = {
                                count: pointCount,
                                result: sampled,
                            };
                            return sampled;
                        },
                    };
                })
        );
    });

    /** Create a sweep line specification that caches the result to reduce recomputation */
    protected sweepLineCache = new DataCacher<ISweepLineSpecification>(hook => {
        let cached: null | {
            count: number;
            result: ISweepLineNode[];
        } = null;

        return {
            sample: samples => {
                if (cached?.count == samples) return cached.result;
                const sample = this.sweepLine.sample(samples, hook);
                cached = {
                    count: samples,
                    result: sample,
                };
                return sample;
            },
        };
    });
    /** A cache for the sweep object specification */
    protected sweepSpec = new DataCacher(hook => {

        const crossSections = this.crossSectionsCaches
            .get(hook)
            .map(crossSection => crossSection.get(hook));

        const spec: ISweepObjectSpecification = {
            sweepLine: this.sweepLineCache.get(hook),
            crossSections,
            sampleCount: {
                sweepLine: this.sweepLineInterpolationPoints.get(hook),
                crossSection: this.crossSectionInterpolationPoints.get(hook),
            },
        };
        return spec;
    });
}

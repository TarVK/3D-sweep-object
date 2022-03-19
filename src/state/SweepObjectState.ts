import {DataCacher, Field, IDataHook} from "model-react";
import {createSweepObject} from "../sweepObject/createSweepObject";
import {IMesh} from "../sweepObject/_types/IMesh";
import {ISweepObjectSpecification} from "../sweepObject/_types/ISweepObjectSpecification";
import {CrossSectionState} from "./CrossSectionState";
import {SweepLineState} from "./SweepLineState";

/**
 * A class to represent a sweep object
 */
export class SweepObjectState {
    protected crossSections = new Field<CrossSectionState[]>([]);
    protected sweepLine: SweepLineState;
    protected object = new Field<IMesh | null>(null);

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

    // Setters
    /**
     * Sets the cross sections of this object
     * @param crossSections The cross sections for this object
     */
    public setCrossSections(crossSections: CrossSectionState[]): void {
        this.crossSections.set(crossSections);
    }

    // Utils
    /**
     * Builds the spec defined by this state into a mesh
     */
    public buildMesh(): void {
        console.time("created mesh");
        const mesh = createSweepObject(this.sweepSpec.get());
        this.object.set(mesh);
        console.timeEnd("created mesh");
    }

    // Some data caches in order to only recompute relevant parts of the mesh when necessary
    /** A cache of caches for each of the cross sections that store the cross section's normalized form */
    protected crossSectionsCaches = new DataCacher(hook => {
        const points = this.crossSectionInterpolationPoints.get(hook);
        return this.crossSections
            .get(hook)
            .map(crossSection => new DataCacher(h => crossSection.normalize(points, h)));
    });
    /** A cache for the sweep object specification */
    protected sweepSpec = new DataCacher(hook => {
        const sweepLine = this.sweepLine.normalize(hook);

        const crossSections = this.crossSectionsCaches
            .get(hook)
            .map(crossSection => crossSection.get(hook));

        // TODO: change spec to support multiple cross sections
        const spec: ISweepObjectSpecification = {
            sweepLine,
            crossSection: crossSections[0],
            sampleCount: this.sweepLineInterpolationPoints.get(hook),
        };
        return spec;
    });
    // /** A cache for the sweep object itself */
    // protected object = new DataCacher(hook =>
    //     createSweepObject(this.sweepSpec.get(hook))
    // );
}

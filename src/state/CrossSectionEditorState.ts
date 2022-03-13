import {Field, IDataHook} from "model-react";
import {Vec2} from "../util/Vec2";
import {CrossSectionState} from "./CrossSectionState";
import {SweepObjectState} from "./SweepObjectState";
import {ICrossSectionEditorConfig} from "./_types/ICrossSectionEditorConfig";
import {ICrossSectionEditorTool} from "./_types/ICrossSectionEditorTool";
import {ICrossSectionHandleSelection} from "./_types/ICrossSectionHandleSelection";
import {ITransformation} from "./_types/ITransformation";

/** All the state data for the editor */
export class CrossSectionEditorState {
    protected transformation = new Field<ITransformation>({
        offset: new Vec2(0, 0),
        scale: 20,
    });
    protected config = new Field<ICrossSectionEditorConfig>({
        grid: "minor",
        showAxis: true,
        snap: {
            gridMajor: true,
            gridMinor: true,
            disableAll: false,
        },
        snapDistance: {
            gridMajor: 10,
            gridMinor: 5,
        },
        zoomSpeed: 0.1,
        selectPointDistance: 15,
    });

    protected sweepObject: Field<SweepObjectState>;
    protected selectedCrossSectionIndex = new Field(0);
    protected selectedHandle = new Field<ICrossSectionHandleSelection | null>(null);
    protected tool = new Field<ICrossSectionEditorTool>("edit");

    /**
     * Creates a new cross section editor state
     * @param sweepObject The sweep object whose cross section is to be altered
     */
    public constructor(sweepObject: SweepObjectState) {
        this.sweepObject = new Field(sweepObject);
    }

    // Configuration
    /**
     * Sets the configuration of the editor
     * @param config The new configuration for the editor
     */
    public setConfig(config: ICrossSectionEditorConfig): void {
        this.config.set(config);
    }

    /**
     * Retrieves the configuration of the editor
     * @param hook The hook to subscribe to changes
     * @returns The retrieved configuration
     */
    public getConfig(hook?: IDataHook): ICrossSectionEditorConfig {
        return this.config.get(hook);
    }

    // Tool/selection
    /**
     * Selects the specified tool
     * @param tool The tool to be selected
     */
    public selectTool(tool: ICrossSectionEditorTool): void {
        this.tool.set(tool);
    }

    /**
     * Retrieves the currently selected tool
     * @param hook The hook to subscribe to changes
     * @returns The currently selected tool
     */
    public getSelectedTool(hook?: IDataHook): ICrossSectionEditorTool {
        return this.tool.get(hook);
    }

    /**
     * Updates the currently selected handle
     * @param selection The new selection to be set
     */
    public selectHandle(selection: ICrossSectionHandleSelection | null): void {
        this.selectedHandle.set(selection);
    }

    /**
     * Retrieves the currently selected handle
     * @param hook The hook to subscribe to changes
     * @returns The currently selected handle
     */
    public getSelectedHandle(hook?: IDataHook): ICrossSectionHandleSelection | null {
        return this.selectedHandle.get(hook);
    }

    // Cross section
    /**
     * Sets the sweep object to be altered by this editor
     * @param sweepObject The sweep object
     */
    public setSweepObject(sweepObject: SweepObjectState): void {
        this.sweepObject.set(sweepObject);
    }

    /**
     * Retrieves the sweep object for which this is the editor state
     * @param hook The hook to subscribe to changes
     * @returns The sweep object's state
     */
    public getSweepObject(hook?: IDataHook): SweepObjectState {
        return this.sweepObject.get(hook);
    }

    /**
     * Selects the cross section with the given index
     * @param index The index to be selected
     */
    public selectCrossSection(index: number): void {
        this.selectedCrossSectionIndex.set(index);
    }

    /**
     * Retrieves the currently selected cross section
     * @param hook The hook to subscribe to changes
     * @returns The currently selected cross section
     */
    public getSelectedCrossSection(hook?: IDataHook): CrossSectionState {
        const crossSections = this.sweepObject.get(hook).getCrossSections(hook);
        const index = this.selectedCrossSectionIndex.get(hook);
        return crossSections[Math.min(index, crossSections.length - 1)];
    }

    // Visual settings
    /**
     * Retrieves the grid size based on the current zoom factor
     * @param hook The hook to subscribe to changes
     * @returns The distance between lines on the grid, in world units
     */
    public getGridSize(hook?: IDataHook): number {
        const {scale} = this.transformation.get(hook);

        // TODO: make configurarable
        const desiredSpacing = {
            pixels: 50, // The minimum number of pixels between lines in the grid on the screen
            units: 100, // The base units on the screen
        };

        const baseScale = desiredSpacing.units / desiredSpacing.pixels;
        const relScale = scale * baseScale;
        const baseFactor = baseScale / Math.pow(10, Math.floor(Math.log10(relScale)));

        // Try to subdivide the factor further
        let factor = baseFactor;
        if (factor * 0.2 * scale > 1) {
            factor *= 0.2;
        } else if (factor * 0.5 * scale > 1) {
            factor *= 0.5;
        }

        return factor * desiredSpacing.pixels;
    }

    // Transformation related methods
    /**
     * Retrieves the transformation of the editor
     * @param hook The hook to subscribe to changes
     * @returns The transformation of the editor
     */
    public getTransformation(hook?: IDataHook): ITransformation {
        return this.transformation.get(hook);
    }

    /**
     * Sets the transformation of the editor
     * @param transformation The new transformation
     */
    public setTransformation(transformation: ITransformation): void {
        this.transformation.set(transformation);
    }

    /**
     * Translates the given amount in screen coordinates
     * @param movement The movement to translate by
     */
    public translate(movement: Vec2): void {
        const {offset, scale} = this.transformation.get();
        this.transformation.set({
            offset: offset.add(movement),
            scale,
        });
    }

    /**
     * Updates to the new scale and ensures that the target point remains in the same position
     * @param newScale The new scale to set
     * @param target The point that should stay in the same location (in screen coordinates, where (0,0) is the middle of the screen)
     */
    public scaleAt(newScale: number, target: Vec2): void {
        const {offset, scale} = this.transformation.get();

        const scalePos = offset.mul(-1).add(target);
        const delta = scalePos.mul(newScale / scale).sub(scalePos);

        this.transformation.set({
            offset: offset.sub(delta),
            scale: newScale,
        });
    }

    // Util
    /**
     * Snaps the given point to the grid depending on the selected sensitivity
     * @param point The point to be snapped
     * @param settings The settings to use for the snapping
     * @returns The snapped point
     */
    public snap(
        point: Vec2,
        settings?: {
            snap: ICrossSectionEditorConfig["snap"];
            snapDistance: ICrossSectionEditorConfig["snapDistance"];
        }
    ): Vec2 {
        settings = settings ?? this.getConfig();
        if (settings.snap.disableAll) return point;

        const scale = this.getTransformation().scale;

        // Snap to any point on the grid
        if (settings.snap.gridMajor) {
            const majorSnapDistance = settings.snapDistance.gridMajor / scale; // Adjusted for view space
            const gridline = this.getGridSize();
            const snapPoint = new Vec2(
                Math.round(point.x / gridline) * gridline,
                Math.round(point.y / gridline) * gridline
            );

            const dist = snapPoint.sub(point).length();
            if (dist < majorSnapDistance) return snapPoint;
        }

        if (settings.snap.gridMinor) {
            const minorSnapDistance = settings.snapDistance.gridMinor / scale; // Adjusted for view space
            const gridline = this.getGridSize() / 5;
            const snapPoint = new Vec2(
                Math.round(point.x / gridline) * gridline,
                Math.round(point.y / gridline) * gridline
            );

            const dist = snapPoint.sub(point).length();
            if (dist < minorSnapDistance) return snapPoint;
        }

        return point;
    }
}

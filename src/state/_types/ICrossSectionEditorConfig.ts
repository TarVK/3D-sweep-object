export type ICrossSectionEditorConfig = {
    // Layout
    /** Whether to show the axis */
    showAxis: boolean;
    /** How to display the grid */
    grid: "none" | "major" | "minor";

    // Interaction
    /** What points to snap to */
    snap: {
        /** Whether to snap to major grid points */
        gridMajor: boolean;
        /** Whether to snap to minor grid points */
        gridMinor: boolean;
        /** Whether to disable all snapping, this overrides the other options */
        disableAll: boolean;
    };
    /** The distance that can be snapped over */
    snapDistance: {
        /** How far may be snapped on major grid points */
        gridMajor: number;
        /** How far may be snapped on minor grid points */
        gridMinor: number;
    };
    /** How quickly to zoom in and out (0-1) */
    zoomSpeed: number;
    /** The distance at which a point should be selectable */
    selectPointDistance: number;
};

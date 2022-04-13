/** The cross section's positional node */
export type ICrossSectionPositionNode = {
    /** The position along the sweep line (should be between 0 and 1) */
    position: number;
    /** The rotation of the cross-section along the free-axis */
    angle: number;
    /** The scale of the cross section */
    scale: number;
};

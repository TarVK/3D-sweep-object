export type IChangedRange = {
    /** The position that the change starts in */
    start: number;
    /** The number of characters that were deleted */
    removeLength: number;
    /** The number of characters that were added */
    addLength: number;
};

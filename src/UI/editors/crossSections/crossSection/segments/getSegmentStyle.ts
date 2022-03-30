/**
 * Retrieves the styles to be used for visualizing a segment
 * @param selected Whether the segment is selected
 * @returns The styling params
 */
export function getSegmentStyle(selected: boolean): {
    handleSize: number;
    edgeWidth: number;
    handleOpacity: number;
    edgeOpacity: number;
    controlHandleOpacity: number;
} {
    return selected
        ? {
              handleSize: 7,
              edgeWidth: 4,
              handleOpacity: 1,
              controlHandleOpacity: 0.8,
              edgeOpacity: 1,
          }
        : {
              handleSize: 5,
              edgeWidth: 2,
              handleOpacity: 0.8,
              controlHandleOpacity: 0.6,
              edgeOpacity: 0.8,
          };
}

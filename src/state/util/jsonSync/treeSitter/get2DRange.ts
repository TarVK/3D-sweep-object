import {IInputRange, ITwoDimensionalInputRange} from "../_types/ISyncer";

/**
 * Retrieves the 2d position of a given range
 * @param range The range to get the position of
 * @param text The text to use to compute the 2d position if absent
 * @param eolChar The regular expression that matches the EOL char (must specify flag `g`)
 * @returns The 2d position in the text
 */
export function get2DRange(
    range: IInputRange,
    text: string,
    eolChar: RegExp = /\r?\n/g
): ITwoDimensionalInputRange {
    if (!range.twoDimensional) {
        let start: {row: number; column: number} | undefined;
        let end: {row: number; column: number} | undefined;

        let row = 0;
        let rowStart = 0;

        let nextEol: RegExpExecArray | null;
        while ((nextEol = eolChar.exec(text))) {
            if (!start && range.start <= nextEol.index)
                start = {row, column: range.start - rowStart};
            if (range.end <= nextEol.index) {
                end = {row, column: range.end - rowStart};
                break;
            }

            rowStart = nextEol.index + nextEol[0].length;
            row++;
        }

        if (!start) start = {row, column: range.start - rowStart};
        if (!end) end = {row, column: range.end - rowStart};

        range.twoDimensional = {
            startRow: start.row,
            startColumn: start.column,
            endRow: end.row,
            endColumn: end.column,
        };
    }

    return range.twoDimensional;
}

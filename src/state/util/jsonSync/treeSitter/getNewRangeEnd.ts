import {IInputRange} from "../_types/ISyncer";
import {get2DRange} from "./get2DRange";

/**
 * Calculates the new end position of the range if the given range were to be replaced with the given text
 * @param range The range that was changed
 * @param text The text that the range was changed to
 * @param originalText The full original text in which the given range is replaced
 * @param eolChar The character that's considered to be the end of a line
 * @returns The range end data
 */
export function getNewRangeEnd(
    range: IInputRange,
    text: string,
    originalText: string,
    eolChar: RegExp = /\r?\n/g
): {offset: number; twoDimensional: {column: number; row: number}} {
    const twoDRange = get2DRange(range, originalText, eolChar);

    const newEndOffset = range.start + text.length;
    const lines = text.split(/\n/);
    if (lines.length == 1) {
        return {
            offset: newEndOffset,
            twoDimensional: {
                row: twoDRange.startRow,
                column: twoDRange.startColumn + text.length,
            },
        };
    }

    const rowDelta = lines.length - 1;
    const column = lines[lines.length - 1].length;

    return {
        offset: newEndOffset,
        twoDimensional: {
            row: twoDRange.startRow + rowDelta,
            column,
        },
    };
}

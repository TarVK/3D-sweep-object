import {ISyncer} from "../_types/ISyncer";
import Parser from "web-tree-sitter";
import {getNewRangeEnd} from "./getNewRangeEnd";
import {get2DRange} from "./get2DRange";
import {ISyncRoot} from "./_types/ISyncRoot";
import {ISyncDataNode} from "./_types/ISyncNode";
import {syncTree} from "./syncTree";
import {IChangedRange} from "./_types/IChangedRange";

/**
 * Creates a new synchroniser
 * @param initText The initial text to use
 * @param root The synchronization root
 */
export async function createSyncer<C extends ISyncDataNode>(
    initText: string,
    root: ISyncRoot<C>
): Promise<ISyncer<any, any>> {
    await Parser.init({
        // instantiateWasm: (...args: any[]) => {
        //     console.log(...args);
        // },
    });
    const json = await Parser.Language.load("./tree-sitter-jsonc.wasm");

    const parser = new Parser();
    parser.setLanguage(json);

    let text = initText;
    let tree = parser.parse(text);
    syncTree(root, tree.rootNode, {start: 0, addLength: text.length, removeLength: 0});

    return {
        changeText: (range, replaceText) => {
            const newRangeEnd = getNewRangeEnd(range, replaceText, text);
            const twoDRange = get2DRange(range, text);

            const newText =
                text.substring(0, range.start) + replaceText + text.substring(range.end);

            const delta: Parser.Edit = {
                startIndex: range.start,
                oldEndIndex: range.end,
                newEndIndex: newRangeEnd.offset,
                startPosition: {row: twoDRange.startRow, column: twoDRange.startColumn},
                oldEndPosition: {row: twoDRange.endRow, column: twoDRange.endColumn},
                newEndPosition: newRangeEnd.twoDimensional,
            };

            tree.edit(delta);
            tree = parser.parse(newText, tree);
            text = newText;
            console.log(newText);

            const syncChange: IChangedRange = {
                start: range.start,
                addLength: replaceText.length,
                removeLength: range.end - range.start,
            };
            syncTree(root, tree.rootNode, syncChange);
        },
        setData: () => void 0,
    };
}

import {SyntaxNode} from "web-tree-sitter";
import {createBaseSyncNode} from "../treeSitter/createBaseSyncNode";
import {IJSONDispatcher} from "./_types/IJSONDispatcher";
import {IJSONNumberNode} from "./_types/IJSONNode";

/**
 * Creates a new JSON number node, given an appropriate syntax node
 * @param node The syntax node for which to create a synchronization node, this node should be a syntactical number node
 * @param dispatcher The dispatcher to communicate changes
 * @returns The created number node
 */
export function createJSONNumberNode(
    node: SyntaxNode,
    dispatcher: IJSONDispatcher
): IJSONNumberNode {
    const computeValue = (node: SyntaxNode) => Number(node.text);

    const data = {value: computeValue(node)};
    return {
        children: node.children.map(createBaseSyncNode),
        node,
        data,
        onChange: (node: SyntaxNode) => {
            console.log(node, node.text);
            const value = Number(node.text);
            if (!isNaN(value) && data.value != value) {
                data.value = value;
                dispatcher.changeData([], value);
            }
        },
    };
}

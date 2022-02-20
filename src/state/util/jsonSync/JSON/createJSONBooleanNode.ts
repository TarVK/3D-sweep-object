import {SyntaxNode} from "web-tree-sitter";
import {createBaseSyncNode} from "../treeSitter/createBaseSyncNode";
import {IJSONDispatcher} from "./_types/IJSONDispatcher";
import {IJSONBooleanNode} from "./_types/IJSONNode";

/**
 * Creates a new JSON boolean node, given an appropriate syntax node
 * @param node The syntax node for which to create a synchronization node, this node should be a syntactical boolean node
 * @param dispatcher The dispatcher to communicate changes
 * @returns The created boolean node
 */
export function createJSONBooleanNode(
    node: SyntaxNode,
    dispatcher: IJSONDispatcher
): IJSONBooleanNode {
    const computeValue = (node: SyntaxNode) => Boolean(node.text);
    const data = {value: computeValue(node)};
    return {
        children: node.children.map(createBaseSyncNode),
        node,
        data,
        onChange: (node: SyntaxNode) => {
            const value = Boolean(node.text);
            if (value != data.value) {
                data.value = value;
                dispatcher.changeData([], value);
            }
        },
    };
}

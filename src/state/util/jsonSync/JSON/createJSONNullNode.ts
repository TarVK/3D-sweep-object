import {SyntaxNode} from "web-tree-sitter";
import {createBaseSyncNode} from "../treeSitter/createBaseSyncNode";
import {IJSONDispatcher} from "./_types/IJSONDispatcher";
import {IJSONNullNode} from "./_types/IJSONNode";

/**
 * Creates a new JSON null node, given an appropriate syntax node
 * @param node The syntax node for which to create a synchronization node, this node should be a syntactical null node
 * @param dispatcher The dispatcher to communicate changes
 * @returns The created null node
 */
export function createJSONNullNode(
    node: SyntaxNode,
    dispatcher: IJSONDispatcher
): IJSONNullNode {
    const data = {
        value: null,
    };
    return {
        children: node.children.map(createBaseSyncNode),
        node,
        data,
    };
}

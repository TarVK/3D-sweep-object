import {SyntaxNode} from "web-tree-sitter";
import {ISyncNode} from "./_types/ISyncNode";

/**
 * Creates a base synchronization node
 * @param node The node to turn into a plain synchronization node
 * @returns The created synchronization node
 */
export function createBaseSyncNode(node: SyntaxNode): ISyncNode {
    return {node};
}

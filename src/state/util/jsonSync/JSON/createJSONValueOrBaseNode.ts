import {SyntaxNode} from "web-tree-sitter";
import {createBaseSyncNode} from "../treeSitter/createBaseSyncNode";
import {ISyncNode} from "../treeSitter/_types/ISyncNode";
import {createJSONValueNode} from "./createJSONValueNode";
import {IJSONDispatcher} from "./_types/IJSONDispatcher";
import {IJSONNode} from "./_types/IJSONNode";

/**
 * Creates a JSON value node if a valid syntax node is given, or otherwise defaults to the base node
 * @param node The syntax node for which to create a synchronization node
 * @param dispatcher The dispatcher to communicate changes
 * @returns The created json node
 */
export function createJSONValueOrBaseNode(
    node: SyntaxNode,
    dispatcher: IJSONDispatcher
): IJSONNode | ISyncNode {
    return createJSONValueNode(node, dispatcher) ?? createBaseSyncNode(node);
}

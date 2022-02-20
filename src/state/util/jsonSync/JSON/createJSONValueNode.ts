import {SyntaxNode} from "web-tree-sitter";
import {createJSONBooleanNode} from "./createJSONBooleanNode";
import {createJSONNullNode} from "./createJSONNullNode";
import {createJSONNumberNode} from "./createJSONNumberNode";
import {createJSONObjectNode} from "./createJSONObjectNode";
import {createJSONStringNode} from "./createJSONStringNode";
import {IJSONDispatcher} from "./_types/IJSONDispatcher";
import {IJSONNode} from "./_types/IJSONNode";

/**
 * Creates a JSON value node, given an appropriate syntax node
 * @param node The syntax node for which to create a synchronization node, this node should either be a syntactical null, boolean, number, string, array, or object node
 * @param dispatcher The dispatcher to communicate changes
 * @returns The created json node
 */
export function createJSONValueNode(
    node: SyntaxNode,
    dispatcher: IJSONDispatcher
): IJSONNode {
    if (node.type == "null") return createJSONNullNode(node, dispatcher);
    if (node.type == "true" || node.type == "false")
        return createJSONBooleanNode(node, dispatcher);
    if (node.type == "string") return createJSONStringNode(node, dispatcher);
    if (node.type == "number") return createJSONNumberNode(node, dispatcher);
    if (node.type == "object") return createJSONObjectNode(node, dispatcher);
    // TODO: array type
    return null as never;
}

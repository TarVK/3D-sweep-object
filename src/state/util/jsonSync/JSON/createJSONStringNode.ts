import {SyntaxNode} from "web-tree-sitter";
import {createBaseSyncNode} from "../treeSitter/createBaseSyncNode";
import {IJSONDispatcher} from "./_types/IJSONDispatcher";
import {IJSONStringNode} from "./_types/IJSONNode";

/**
 * Creates a new JSON string node, given an appropriate syntax node
 * @param node The syntax node for which to create a synchronization node, this node should be a syntactical string node
 * @param dispatcher The dispatcher to communicate changes
 * @returns The created string node
 */
export function createJSONStringNode(
    node: SyntaxNode,
    dispatcher: IJSONDispatcher
): IJSONStringNode {
    const computeValue = (node: SyntaxNode) =>
        node.children.find(c => c.type == "string_content")?.text ?? "";
    const data = {value: computeValue(node)};

    return {
        children: node.children.map(createBaseSyncNode),
        node,
        data,
        onChange: (node: SyntaxNode) => {
            const value = computeValue(node);
            if (value != data.value) {
                data.value = value;
                dispatcher.changeData([], value);
            }
        },
    };
}

import {SyntaxNode} from "web-tree-sitter";
import {createBaseSyncNode} from "../treeSitter/createBaseSyncNode";
import {ISyncDataNode, ISyncNode} from "../treeSitter/_types/ISyncNode";
import {ISyncRoot} from "../treeSitter/_types/ISyncRoot";
import {createJSONValueNode} from "./createJSONValueNode";
import {IJSONDispatcher} from "./_types/IJSONDispatcher";
import {IJSONNode, IJSONNodeData} from "./_types/IJSONNode";

/**
 * Creates a new json synchronization tree
 * @param dispatcher The callbacks to perform when data changes
 * @returns The JSON synchronization tree root
 */
export function createJSONSyncTree(dispatcher: IJSONDispatcher): ISyncRoot<IJSONNode> {
    let first = true;
    return {
        root: undefined,
        onCreate: node => {
            const documentNode = createJSONDocumentNode(node, dispatcher);
            if (!first) dispatcher.changeData([], documentNode.data.value);
            first = false;
            return documentNode;
        },
    };
}

/**
 * Creates a new JSON root document
 * @param node The syntax node for which to create the document node
 * @param dispatcher The dispatcher to communicate changes
 * @returns The created document node
 */
export function createJSONDocumentNode(
    node: SyntaxNode,
    dispatcher: IJSONDispatcher
): IJSONNode {
    let data: IJSONNode extends ISyncDataNode<infer U> ? U : never = {value: null};

    const syncNode: IJSONNode = {
        children: node.children.map(child => {
            const value = createJSONValueNode(child, dispatcher);
            if (!value) return createBaseSyncNode(node);
            data.value = value.data.value;
            return value;
        }),
        node,
        data,
        onCreateChild: node => {
            const value = createJSONValueNode(node, dispatcher);
            if (!value) return;
            syncNode.data = value.data;
            dispatcher.changeData([], syncNode.data.value);
            return value;
        },
    };
    return syncNode;
}

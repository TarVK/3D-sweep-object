import {ISyncDataNode, ISyncNode} from "./_types/ISyncNode";
import {SyntaxNode} from "web-tree-sitter";
import {ISyncRoot} from "./_types/ISyncRoot";
import {createBaseSyncNode} from "./createBaseSyncNode";

/**
 * Synchronizes the given syntax node with the given syncNode
 * @param syncNode The synchronization node to be updated
 * @param syntaxNode The syntax node to infer data from
 */
export function syncTree<C extends ISyncDataNode>(
    syncNode: ISyncRoot<C>,
    syntaxNode: SyntaxNode
): void {
    if (syncNode.root == undefined || syncNode.root.node.type != syntaxNode.type) {
        syncNode.root = syncNode.onCreate(syntaxNode);
    } else {
        syncTreeRec(syncNode.root, syntaxNode);
    }
}

/**
 * Synchronizes the given syntax node with the given syncNode
 * @param syncNode The synchronization node to be updated
 * @param syntaxNode The syntax node to infer data from (assumes the type of this node to be equal to syncNode's)
 * @returns The new sync node (usually equivalent to the old one, but may be different if the whole node got replaced)
 */
function syncTreeRec<T, C extends ISyncDataNode>(
    syncNode: ISyncDataNode<T, C>,
    syntaxNode: SyntaxNode
): void {
    // Update the node reference
    syncNode.node = syntaxNode;

    // Find the first affected child index
    const syntaxChildren = syntaxNode.children;
    const syntaxCL = syntaxChildren.length;
    const syncChildren = syncNode.children;
    const syncCL = syncChildren.length;

    let first;
    for (first = 0; first < syncCL && first < syntaxCL; first++) {
        const syncChild = syncChildren[first];
        const syntaxChild = syntaxChildren[first];

        // if (!syncChild.node.equals(syntaxChild)) break;
        if (syncChild.node.hasChanges()) break;
        if (syncChild.node.id != syntaxChild.id) {
            if (syncChild.node.type != syntaxChild.type) break;
            if (syncChild.node.text != syntaxChild.text) break;
        }
    }

    // Find the last affected child index
    let deltaLast;
    for (
        deltaLast = 1;
        deltaLast <= syncCL && deltaLast <= syntaxCL && first < syncCL - deltaLast;
        deltaLast++
    ) {
        const syncChild = syncChildren[syncCL - deltaLast];
        const syntaxChild = syntaxChildren[syntaxCL - deltaLast];

        // if (!syncChild.node.equals(syntaxChild)) break;
        if (syncChild.node.hasChanges()) break;
        if (syncChild.node.id != syntaxChild.id) {
            if (syncChild.node.type != syntaxChild.type) break;
            if (syncChild.node.text != syntaxChild.text) break;
        }
    }
    const syncLast = syncCL - deltaLast;
    const syntaxLast = syntaxCL - deltaLast;

    debugger;

    // Update the changed children
    for (let i = first; i <= syncLast && i <= syntaxLast; i++) {
        const syntaxChild = syntaxChildren[i];
        const syncChild = syncChildren[i];
        if ("data" in syncChild && syncChild.node.type == syntaxChild.type) {
            syncTreeRec(syncChild, syntaxChild);
        } else {
            const newNode =
                syncNode.onCreateChild?.(syntaxChild, i) ??
                createBaseSyncNode(syntaxChild);
            syncChildren[i] = newNode;
        }
    }

    // Create the newly added children
    const addChildren: (ISyncNode | C)[] = [];
    for (let i = syncLast + 1; i <= syntaxLast; i++) {
        const added = syntaxChildren[i];
        const addedSyncNode =
            syncNode.onCreateChild?.(added, i) ?? createBaseSyncNode(added);
        addChildren.push(addedSyncNode);
    }
    if (addChildren.length > 0) syncChildren.splice(syncLast + 1, 0, ...addChildren);

    // Delete the removed children
    for (let i = syntaxLast + 1; i <= syncLast; i++) {
        const deleted = syncChildren[i];
        syncNode.onDeleteChild?.(deleted, i);
    }
    syncChildren.splice(syntaxLast + 1, syncLast - syntaxLast);

    // Invoke overall node update
    syncNode.onChange?.(syntaxNode, syncNode.children);
}

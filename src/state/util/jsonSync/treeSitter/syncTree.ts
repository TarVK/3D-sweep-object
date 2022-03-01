import {ISyncDataNode, ISyncNode} from "./_types/ISyncNode";
import {SyntaxNode} from "web-tree-sitter";
import {ISyncRoot} from "./_types/ISyncRoot";
import {createBaseSyncNode} from "./createBaseSyncNode";
import {IChangedRange} from "./_types/IChangedRange";

/**
 * Synchronizes the given syntax node with the given syncNode
 * @param syncNode The synchronization node to be updated
 * @param syntaxNode The syntax node to infer data from
 */
export function syncTree<C extends ISyncDataNode>(
    syncNode: ISyncRoot<C>,
    syntaxNode: SyntaxNode,
    change: IChangedRange
): void {
    if (syncNode.root == undefined || syncNode.root.node.type != syntaxNode.type) {
        syncNode.root = syncNode.onCreate(syntaxNode);
    } else {
        syncTreeRec(syncNode.root, syntaxNode, change);
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
    syntaxNode: SyntaxNode,
    change: IChangedRange
): void {
    // Update the node reference
    syncNode.node = syntaxNode;

    // Find the first affected child index
    const syntaxChildren = syntaxNode.children;
    const syncChildren = syncNode.children;

    // Keep track of changes that have to be made to the syncNode children
    const updates: {index: number; removed: number; added: ISyncNode[]}[] = [];
    const addChild = (index: number, child: ISyncNode) => {
        const top = updates[updates.length - 1];
        const canChange = top && top.index + top.removed == index;
        if (canChange) top.added.push(child);
        else updates.push({index, removed: 0, added: [child]});
    };
    const removeChild = (index: number) => {
        const top = updates[updates.length - 1];
        const canChange = top && top.index + top.removed == index;
        if (canChange) top.removed++;
        else updates.push({index, removed: 1, added: []});
    };

    // Go through the old/new children to synchronize them
    let syncIndex = 0;
    let syntaxIndex = 0;
    while (true) {
        let syncChild: undefined | C | ISyncNode = syncChildren[syncIndex];
        let syntaxChild: undefined | SyntaxNode = syntaxChildren[syntaxIndex];

        // Make sure we're still within affected range
        // if (syncChild && syncChild.node.startIndex > change.start + change.removeLength)
        //     syncChild = undefined;
        // if (syntaxChild && syntaxChild.startIndex > change.start + change.addLength)
        //     syntaxChild = undefined;
        if (!syntaxChild && !syncChild) break;

        // Check whether potentially nothing changed in the node
        if (syncChild && syntaxChild) {
            const noChanges =
                syncChild.node.id == syntaxChild.id ||
                (syncChild.node.type == syntaxChild.type &&
                    !syncChild.node.hasChanges() &&
                    syncChild.node.text == syntaxChild.text);
            if (noChanges) {
                syncChild.node = syntaxChild;
                syncIndex++;
                syntaxIndex++;
                continue;
            }
        }

        // Check whether a sync node was fully covered by the changes, and thus removed
        const fullyCoversSyncNode =
            syncChild &&
            syncChild.node.startIndex >= change.start &&
            syncChild.node.endIndex <= change.start + change.removeLength;
        if (fullyCoversSyncNode || !syntaxChild) {
            debugger;
            syncNode.onDeleteChild?.(syncChild!, syncIndex);
            removeChild(syncIndex);
            syncIndex++;
            continue;
        }

        // Check whether a syntax node was fully covered by the changes, and thus was added
        const fullyCoversSyntaxNode =
            syntaxChild &&
            syntaxChild.startIndex >= change.start &&
            syntaxChild.endIndex <= change.start + change.addLength;
        if (fullyCoversSyntaxNode || !syncChild) {
            debugger;
            const addedSyncNode =
                syncNode.onCreateChild?.(syntaxChild, syntaxIndex) ??
                createBaseSyncNode(syntaxChild);
            syntaxIndex++;
            addChild(syncIndex, addedSyncNode);
            continue;
        }

        // Make sure both a syntax and sync node are still available
        if (!syntaxChild || !syncChild) continue;

        // Check whether the sync node was changed
        const changedData =
            "data" in syncChild &&
            (syncChild as ISyncDataNode).node.type == syntaxChild.type;
        if (changedData) {
            debugger;
            syncTreeRec(syncChild as ISyncDataNode, syntaxChild, change);
            syncIndex++;
            syntaxIndex++;
            continue;
        }

        // If everything else failed, the sync node was replaced
        debugger;
        syncNode.onDeleteChild?.(syncChild, syncIndex);
        removeChild(syncIndex);
        syncIndex++;

        const addedSyncNode =
            syncNode.onCreateChild?.(syntaxChild, syntaxIndex) ??
            createBaseSyncNode(syntaxChild);
        addChild(syncIndex, addedSyncNode);
        syntaxIndex++;
    }

    // Dispatch children changes (in reverse order such that earlier changes don't interfere)
    for (let childUpdate of updates.reverse()) {
        syncChildren.splice(childUpdate.index, childUpdate.removed, ...childUpdate.added);
        debugger;
    }

    // Invoke overall node update
    syncNode.onChange?.(syntaxNode, syncNode.children);
}

/**
 * Synchronizes the given syntax node with the given syncNode
 * @param syncNode The synchronization node to be updated
 * @param syntaxNode The syntax node to infer data from (assumes the type of this node to be equal to syncNode's)
 * @returns The new sync node (usually equivalent to the old one, but may be different if the whole node got replaced)
 */
function syncTreeRecOld<T, C extends ISyncDataNode>(
    syncNode: ISyncDataNode<T, C>,
    syntaxNode: SyntaxNode,
    change: IChangedRange
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
            syncTreeRec(syncChild, syntaxChild, change);
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

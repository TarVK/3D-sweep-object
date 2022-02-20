import {SyntaxNode} from "web-tree-sitter";

/** A synchronization node that does not contain any model data */
export type ISyncNode = {
    /** The syntax node that this sync node is obtained from */
    node: SyntaxNode;
};

/** A synchronization node that stores object data */
export type ISyncDataNode<
    D = unknown,
    C extends ISyncDataNode<any, any> = ISyncDataNode<unknown, any>
> = {
    /** The children nodes */
    children: (C | ISyncNode)[];
    /** The syntax node that this sync node is obtained from */
    node: SyntaxNode;
    /** Data specific to this node/node type */
    data: D;
    /**
     * Creates a new synchronization node, given a child syntax node
     * @param node The syntax node to be used
     * @param index The index of this node within the syntax node
     * @returns The synchronization data node. If no node is returned, a non-data node will be created instead
     */
    onCreateChild?: (node: SyntaxNode, index: number) => C | void;
    /**
     * Handles deletion callbacks
     * @param node The child node that was deleted
     * @param index The index of this node within the syntax node
     */
    onDeleteChild?: (node: C | ISyncNode, index: number) => void;
    /**
     * Handles overall changes of this node
     * @param node The syntax node that was changed in some way (added/removed children or changed text)
     * @param children The children that this sync node has
     */
    onChange?: (node: SyntaxNode, children: (C | ISyncNode)[]) => void;
};

import {SyntaxNode} from "web-tree-sitter";
import {ISyncDataNode} from "./ISyncNode";

/** The root tree for node synchronization */
export type ISyncRoot<C extends ISyncDataNode> = {
    /** The current root node */
    root: C | undefined;
    /** The callback used to replace the root node if necessary */
    onCreate: (node: SyntaxNode) => C | undefined;
};

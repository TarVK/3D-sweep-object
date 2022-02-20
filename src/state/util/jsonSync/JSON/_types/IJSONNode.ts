import {ISyncDataNode} from "../../treeSitter/_types/ISyncNode";
import {IJSON} from "./IJSON";

/** All available json synchronization node types */
export type IJSONNode =
    | IJSONObjectNode
    | IJSONListNode
    | IJSONStringNode
    | IJSONNumberNode
    | IJSONBooleanNode
    | IJSONNullNode;

export type IJSONNodeData<T> = {
    value: T;
};

// All the different node types
export type IJSONObjectNode = ISyncDataNode<
    IJSONNodeData<{[key: string]: IJSON}>,
    ISyncDataNode<{key: string; value: IJSON; valueNode: IJSONNode | null}>
>;
export type IJSONListNode = ISyncDataNode<
    IJSONNodeData<IJSON[]> & {valueNodes: IJSONNode[]}
>;
export type IJSONStringNode = ISyncDataNode<IJSONNodeData<string>>;
export type IJSONNumberNode = ISyncDataNode<IJSONNodeData<number>>;
export type IJSONBooleanNode = ISyncDataNode<IJSONNodeData<boolean>>;
export type IJSONNullNode = ISyncDataNode<IJSONNodeData<null>>;

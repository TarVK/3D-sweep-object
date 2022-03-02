import {ISyncDataNode} from "../../treeSitter/_types/ISyncNode";
import {IJSONValidator} from "../validation/_types/IJSONValidator";
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
    /** The value that's currently accepted and valid */
    value: T;
};

// All the different node types
export type IJSONFieldNode = ISyncDataNode<{
    key: string;
    value: IJSON;
    valueNode: IJSONNode | null;
}>;
export type IJSONObjectNode = ISyncDataNode<
    IJSONNodeData<{[key: string]: IJSON}> & {
        // TODO: make things work properly when fields are double defined
        // /** The currently registered field data */
        // fields: {[key: string]: IJSONFieldNode[]};
    },
    IJSONFieldNode
>;
export type IJSONListNode = ISyncDataNode<
    IJSONNodeData<IJSON[]> & {valueNodes: IJSONNode[]}
>;
export type IJSONStringNode = ISyncDataNode<IJSONNodeData<string>>;
export type IJSONNumberNode = ISyncDataNode<IJSONNodeData<number>>;
export type IJSONBooleanNode = ISyncDataNode<IJSONNodeData<boolean>>;
export type IJSONNullNode = ISyncDataNode<IJSONNodeData<null>>;

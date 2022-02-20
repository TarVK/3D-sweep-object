import {SyntaxNode} from "web-tree-sitter";
import {createBaseSyncNode} from "../treeSitter/createBaseSyncNode";
import {ISyncDataNode, ISyncNode} from "../treeSitter/_types/ISyncNode";
import {createJSONStringNode} from "./createJSONStringNode";
import {createJSONValueNode} from "./createJSONValueNode";
import {IJSON} from "./_types/IJSON";
import {IJSONDispatcher} from "./_types/IJSONDispatcher";
import {IJSONNode, IJSONObjectNode} from "./_types/IJSONNode";

/**
 * Creates a new JSON object node, given an appropriate syntax node
 * @param node The syntax node for which to create a synchronization node, this node should be a syntactical object node
 * @param dispatcher The dispatcher to communicate changes
 * @returns The created object node
 */
export function createJSONObjectNode(
    node: SyntaxNode,
    dispatcher: IJSONDispatcher
): IJSONObjectNode {
    const data = {
        value: {} as Record<string, IJSON>,
    };

    const childDispatcher: IJSONDispatcher = {
        changeData: (path, value) => {
            if (path.length == 1) {
                const [key] = path;
                data.value[key] = value;
            }
            dispatcher.changeData(path, value);
        },
        deleteData: path => {
            if (path.length == 1) {
                const [key] = path;
                delete data.value[key];
            }
            dispatcher.deleteData(path);
        },
        insertData: (path, value) => {
            if (path.length == 1) {
                const [key] = path;
                data.value[key] = value;
            }
            dispatcher.insertData(path, value);
        },
    };

    return {
        children: node.children.map(child => {
            if (child.type == "pair") {
                const field = createJSONObjectFieldNode(child, childDispatcher);
                data.value[field.data.key] = field.data.value;
                return field;
            }
            return createBaseSyncNode(child);
        }),
        node,
        data,
        onCreateChild: child => {
            if (child.type == "pair") {
                const field = createJSONObjectFieldNode(child, childDispatcher);
                data.value[field.data.key] = field.data.value;
                dispatcher.insertData([field.data.key], field.data.value);
                return field;
            }
        },
        onDeleteChild: child => {
            if ("data" in child) {
                delete data.value[child.data.key];
                dispatcher.deleteData([child.data.key]);
            }
        },
    };
}

/**
 * Creates a new JSON object field node, given an appropriate syntax node
 * @param node The syntax node for which to create a synchronization node, this node should be a syntactical field node
 * @param dispatcher The dispatcher to communicate changes
 * @returns The created object field node
 */
export function createJSONObjectFieldNode(
    node: SyntaxNode,
    dispatcher: IJSONDispatcher
): ISyncDataNode<{key: string; value: IJSON; valueNode: IJSONNode | null}> {
    const data = {
        key: "",
        value: null as IJSON,
        valueNode: null as IJSONNode | null,
    };

    // Define helpers that specify how to communicate changes
    const updateKey = (key: string) => {
        if (key != data.key) {
            dispatcher.deleteData([data.key]);
            dispatcher.insertData([key], data.value);
            data.key = key;
        }
    };
    const updateValue = (dispatch = true) => {
        const newValue = data.valueNode?.data.value ?? null;
        if (newValue != data.value) {
            data.value = newValue;
            if (dispatch) dispatcher.changeData([data.key], newValue);
        }
    };

    // Define the dispatchers for child values
    const keyDispatcher: IJSONDispatcher = {
        changeData: (path, value) => updateKey(value as string),
        // These won't occur on name nodes, since they have no sub-data
        deleteData: () => {},
        insertData: () => {},
    };
    const valueDispatcher: IJSONDispatcher = {
        changeData: (path, value) => {
            dispatcher.changeData([data.key, ...path], value);
            updateValue(false);
        },
        deleteData: path => {
            dispatcher.deleteData([data.key, ...path]);
            updateValue(false);
        },
        insertData: (path, value) => {
            dispatcher.insertData([data.key, ...path], value);
            updateValue(false);
        },
    };

    // Initialize the node
    const children: (ISyncDataNode | ISyncNode)[] = node.children.map(child => {
        const isName = node.namedChild(0)?.equals(child) && child.type == "string";
        const isValue = node.namedChild(1)?.equals(child);
        if (isName) {
            const keySyncNode = createJSONStringNode(child, keyDispatcher);
            data.key = keySyncNode.data.value;
            return keySyncNode;
        } else if (isValue) {
            const valueSyncNode = createJSONValueNode(child, valueDispatcher);
            data.valueNode = valueSyncNode;
            data.value = valueSyncNode.data.value;
            return valueSyncNode;
        }
        return createBaseSyncNode(child);
    });

    const field: ISyncDataNode<{key: string; value: IJSON; valueNode: IJSONNode | null}> =
        {
            children,
            node,
            data,
            onCreateChild: child => {
                const parent = child.parent!;
                const isName =
                    parent.namedChild(0)?.equals(child) && child.type == "string";
                const isValue = parent.namedChild(1)?.equals(child);
                if (isName) {
                    const keySyncNode = createJSONStringNode(child, keyDispatcher);
                    updateKey(keySyncNode.data.value);
                    return keySyncNode;
                } else if (isValue) {
                    const valueSyncNode = createJSONValueNode(child, valueDispatcher);
                    data.valueNode = valueSyncNode;
                    updateValue(true);
                    return valueSyncNode;
                }
            },
            onDeleteChild: child => {
                if (data.valueNode == child) {
                    data.valueNode = null;
                    updateValue(true);
                }
            },
        };
    return field;
}

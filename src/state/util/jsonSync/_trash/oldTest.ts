import {Parser} from "parsimmon";

const objectParser: INodeParser<Record<string, any>, string> = null as any;

type IChild<K extends INode<any, F> | ITextNode, F> = {
    node: K;
    onChange: (newChild: K) => void;
};

type INode<D, F> = {
    /** The child nodes */
    children: IChild<any, F>[];
    /** The number of characters covered by this node */
    length: number;
    /** The relative offset from the start at which the latest alt parser errored */
    altErrorAt: number;
    /** The parser that makes valid objects for this node */
    parser: INodeParser<D, F>;
    /** Finds the node path, given an object path */
    findDescendent: (path: F) => INodePath<F>;
};

type INodeParseOutput<D, F> = {
    /** The node itself */
    node: INode<D, F>;
    /** The constructed data */
    data: D;
};
type INodeParser<D, F> = Parser<() => INodeParseOutput<D, F>>;
type INodePath<F> = IChild<any, F>[];

type ITextNode = {
    /** The text of the node */
    text: string;
    /** The number of characters covered by this node (identical to the length of the text) */
    length: number;
    /** The parser that created this node */
    parser: ITextNodeParser;
};
type ITextNodeParser = Parser<() => ITextNode>;

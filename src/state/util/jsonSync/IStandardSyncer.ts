import {Parser} from "parsimmon";
import {IErrorRemover, ISyncer} from "./ISyncer";

/** A standard syncer for which tooling exists to create an inductive definition */
export type IStandardSyncer<F, D> = ISyncer<F, D> & {
    /** The children of this standard syncer */
    children: IChild<F, D>[];
    /** The number of characters covered by this node */
    length: number;
    /** The parser that created this node, which can parse anything that's valid from this text position */
    parser: IParser<F, D>;
};

export type IStandardSyncerParser<F, D> = Parser<IStandardSyncerParserData<F, D>>;
export type IStandardSyncerParserData<F, D> = (
    parser: IParser<F, D>,
    context: IContext
) => IStandardSyncer<F, D>;

export type IChild<F, D> = ITextNode<F, D> | IStandardSyncer<F, D> | IChildDraft<F, D>;

export type IChildDraft<F, D> = {
    /** The text of the node */
    text: string;
    /** The number of characters covered by this node (identical to the length of the text) */
    length: number;
};

export type ITextNode<F, D> = {
    /** The text of the node */
    text: string;
    /** The number of characters covered by this node (identical to the length of the text) */
    length: number;
    /** The parser that created this node, which can parse anything that's valid from this text position */
    parser: IParser<F, D>;
    /** The callbacks to remove previous errors */
    errorMessageRemovers: IErrorRemover[];
};
export type ITextNodeParser<F, D> = Parser<ITextNodeParserData<F, D>>;
export type ITextNodeParserData<F, D> = (
    parser: IParser<F, D>,
    context: IContext
) => ITextNode<F, D>;

export type IParser<F, D> = IStandardSyncerParser<F, D> | ITextNodeParser<F, D>;

export type IContext = {
    text: string;
};

// import P, {Parser} from "parsimmon";
// import {
//     IStandardSyncer,
//     IStandardSyncerParser,
//     ITextNode,
//     ITextNodeParser,
// } from "./IStandardSyncer";

// type IPath = string[];
// type IJSON = null | string | boolean | number | Array<IJSON> | {[key: string]: IJSON};

// const createObjectParser = (): IStandardSyncerParser<IPath, IJSON> => {
//     const parser = createSyncParser(
//         P.seq(
//             createTextNodeParser("{"),
//             createFlatListParser(createFieldParser(), createTextNodeParser(",")),
//             createTextNodeParser("}")
//         ).map(([l, items, r]) => [l, ...items, r])
//     );

//     return null as any; // TODO:
// };

// const createFieldParser = (): IStandardSyncerParser<IPath, IJSON> => {
//     return null as any; // TODO:
// };

// // Utils
// const createTextNodeParser = <F, D>(text: RegExp | string): ITextNodeParser<F, D> => {
//     return null as any; // TODO:
// };
// const createListParser = <N, S>(
//     item: Parser<N>,
//     separator: Parser<S>
// ): Parser<{node: N; separator?: S}[]> => {
//     return null as any; // TODO:
// };
// const createFlatListParser = <N, S>(
//     item: Parser<N>,
//     separator: Parser<S>
// ): Parser<(N | S)[]> => {
//     return null as any; // TODO:
// };
// const createSyncParser = <F, D>(
//     parser: Parser<((() => ITextNode) | (() => IStandardSyncer<F, D>))[]>
// ): Parser<(() => ITextNode | IStandardSyncer<F, D>)[]> => {
//     return null as any; // TODO:
// };

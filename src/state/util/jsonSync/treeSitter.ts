import Parser from "web-tree-sitter";
// import

export const result = (async () => {
    await Parser.init({
        // instantiateWasm: (...args: any[]) => {
        //     console.log(...args);
        // },
    });
    const json = await Parser.Language.load("./tree-sitter-jsonc.wasm");

    const parser = new Parser();
    parser.setLanguage(json);

    const sourceCode = `{"shit": {, //oof\n  "crap": true}`;
    const tree = parser.parse(sourceCode);

    console.log(tree.rootNode);
    // const newSourceCode = "let 45x = 1; console.log(x);";

    // tree.edit({
    //     startIndex: 4,
    //     oldEndIndex: 4,
    //     newEndIndex: 6,
    //     startPosition: {row: 0, column: 4},
    //     oldEndPosition: {row: 0, column: 4},
    //     newEndPosition: {row: 0, column: 6},
    // });

    // const newTree = parser.parse(newSourceCode, tree);
    // console.log(newTree.rootNode);
})();

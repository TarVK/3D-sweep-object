import Parser from "web-tree-sitter";
import {createJSONSyncTree} from "../JSON/createJSONSyncTree";
import {createValueSyncDispatcher} from "../JSON/util/createValueSyncDispatcher";
import {IJSON} from "../JSON/_types/IJSON";
import {createSyncer} from "../treeSitter/createSyncer";
import testData from "./testData.json";
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

    const test = 2 as number;
    if (test == 1) {
        const orText = `{"snuff": 5, "poop": "y\\epoe", "shit": 4, "smth": 5, "crap": true, "oranges": 34}`;
        const newText = `{"snuff": 5, "poop": "ye", "shit": 5, "crap": true, "oranges": 34}`;

        let start = 0;
        while (orText[start] == newText[start]) start++;

        let endRem = 0;
        while (
            orText.length - (endRem + 1) >= start &&
            newText.length - (endRem + 1) >= start &&
            orText[orText.length - (endRem + 1)] == newText[newText.length - (endRem + 1)]
        )
            endRem++;

        const oldEnd = orText.length - endRem;
        const newEnd = newText.length - endRem;

        const tree = parser.parse(orText);
        console.log(tree.rootNode);

        // console.log(tree.rootNode.children[0].children[3].namedChild())
        // tree.edit({
        //     startIndex: start,
        //     oldEndIndex: oldEnd,
        //     newEndIndex: newEnd,
        //     startPosition: {row: 0, column: start},
        //     oldEndPosition: {row: 0, column: oldEnd},
        //     newEndPosition: {row: 0, column: newEnd},
        // });
    } else if (test == 2) {
        // const orText = `{"snuff": 5, "poop": {"woo": "ye", "shit": 4, "smth": 5, "crap": true}, "oranges": 34}`;
        // const newText = `{"snuff": 5, "poop": {"woo": "ye", "shit": 5, "crap": true}, "oranges": 34}`;

        // const orText = `{"snuff": 5, "poop": {"woo": "ye", "shit": 5, "crap": true}, "oranges": 34}`;
        // const newText = `{"snuff": 5, "poop": {"woo": "ye", "shit": 4, "smth": 5, "crap": true}, "oranges": 34}`;
        const orText = `{"hoi": }`;
        const newText = `{"hoi": 5}`;

        const obj = {value: null as IJSON};
        const dispatcher = createValueSyncDispatcher(obj, {
            changeData: (...args) => console.log("Change: ", ...args),
            insertData: (...args) => console.log("Insert: ", ...args),
            deleteData: (...args) => console.log("Delete: ", ...args),
        });
        const root = createJSONSyncTree(dispatcher);
        const syncer = await createSyncer(orText, root);
        obj.value = root.root?.data.value ?? null;

        console.log(JSON.parse(JSON.stringify(obj)));

        let start = 0;
        while (orText[start] == newText[start]) start++;

        let endRem = 0;
        while (
            orText.length - (endRem + 1) >= start &&
            newText.length - (endRem + 1) >= start &&
            orText[orText.length - (endRem + 1)] == newText[newText.length - (endRem + 1)]
        )
            endRem++;

        const oldEnd = orText.length - endRem;
        const newEnd = newText.length - endRem;

        syncer.changeText({start, end: oldEnd}, newText.substring(start, newEnd));
        console.log(obj);
    } else {
        const sourceCode = JSON.stringify(testData);

        console.time("init");
        const tree = parser.parse(sourceCode);
        console.timeEnd("init");

        console.log(tree.rootNode);
        const addition = "shit";
        const index = 100; // sourceCode.length - 100;
        const newSourceCode =
            sourceCode.slice(0, index) + addition + sourceCode.slice(index);

        tree.edit({
            startIndex: index,
            oldEndIndex: index,
            newEndIndex: index + addition.length,
            startPosition: {row: 0, column: index},
            oldEndPosition: {row: 0, column: index},
            newEndPosition: {row: 0, column: index + addition.length},
        });

        console.time("update");
        const newTree = parser.parse(newSourceCode, tree);
        console.timeEnd("update");
        console.time("change");
        console.log(tree.getChangedRanges(newTree));
        console.timeEnd("change");
        console.log(tree, newTree);
    }
})();

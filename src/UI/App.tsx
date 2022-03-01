import {useDataHook} from "model-react";
import {editor} from "monaco-editor";
import {FC, useRef, useState} from "react";
import {AppState} from "../state/AppState";
import {createJSONSyncTree} from "../state/util/jsonSync/JSON/createJSONSyncTree";
import {createValueSyncDispatcher} from "../state/util/jsonSync/JSON/util/createValueSyncDispatcher";
import {IJSON} from "../state/util/jsonSync/JSON/_types/IJSON";
import {createSyncer} from "../state/util/jsonSync/treeSitter/createSyncer";
import {get2DRange} from "../state/util/jsonSync/treeSitter/get2DRange";
import {useEditor} from "../state/util/jsonSync/useEditor";

export const App: FC<{state: AppState}> = ({state}) => {
    const [h] = useDataHook();
    const textRef = useRef(`{"smth": 3}`);
    const [value, updateText, events] = useObjectSyncer(textRef.current);
    const [element, editorRef] = useEditor({
        value: textRef.current,
        options: {},
        style: {flex: 1},
        listener: updateText,
    });

    return (
        <>
            <div
                css={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    height: "100%",
                }}>
                {element}
                <div
                    css={{
                        flex: 1,
                        paddingLeft: 20,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                    }}>
                    <div css={{paddingBottom: 20}}>{JSON.stringify(value, null, 4)}</div>
                    <div css={{flex: 1, display: "flex", flexDirection: "column"}}>
                        <div>
                            {events.map((event, i) => (
                                <div key={i}>{event}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

function useObjectSyncer(
    text: string
): [IJSON, (e: editor.IModelContentChangedEvent) => void, string[]] {
    const output = useRef<{value: IJSON}>();
    if (!output.current) output.current = {value: JSON.parse(text)};

    const [_, forceUpdate] = useState({});
    const [events, setEvents] = useState([] as string[]);

    const func = useRef<(e: editor.IModelContentChangedEvent) => void>();
    if (!func.current) {
        const addEvent = (text: string) => setEvents(events => [...events, text]);
        const dispatcher = createValueSyncDispatcher(output.current, {
            changeData: (path, value) =>
                addEvent("change: " + path.join(".") + " = " + JSON.stringify(value)),
            insertData: (path, value) =>
                addEvent("insert: " + path.join(".") + " = " + JSON.stringify(value)),
            deleteData: path => addEvent("delete: " + path.join(".")),
        });
        const root = createJSONSyncTree(dispatcher);
        const syncer = createSyncer(text, root);
        syncer.then(() => {
            output.current!.value = root.root?.data.value ?? null;
            forceUpdate({});
        });

        func.current = e => {
            syncer.then(v => {
                console.time();
                const changes = [...e.changes];
                for (let change of changes) {
                    const range = {
                        start: change.rangeOffset,
                        end: change.rangeOffset + change.rangeLength,
                    };
                    const text = change.text;
                    v.changeText(range, text);
                }
                console.timeEnd();
            });
        };
    }

    return [output.current.value, func.current!, events];
}

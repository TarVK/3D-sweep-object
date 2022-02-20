import {useDataHook} from "model-react";
import {FC, useRef} from "react";
import {AppState} from "../state/AppState";
import {get2DRange} from "../state/util/jsonSync/treeSitter/get2DRange";
import {useEditor} from "../state/util/jsonSync/useEditor";

export const App: FC<{state: AppState}> = ({state}) => {
    const [h] = useDataHook();
    const textRef = useRef("");
    const [element, editorRef] = useEditor({
        value: textRef.current,
        options: {},
        style: {flex: 1},
        listener: event => {
            const change = event.changes[0];
            const range = {
                start: change.rangeOffset,
                end: change.rangeOffset + change.rangeLength,
            };
            const text = textRef.current;
            const twoDRange = get2DRange(range, text);
            const same =
                change.range.startLineNumber == twoDRange.startRow + 1 &&
                change.range.startColumn == twoDRange.startColumn + 1 &&
                change.range.endLineNumber == twoDRange.endRow + 1 &&
                change.range.endColumn == twoDRange.endColumn + 1;
            if (!same) console.log("Error", change, twoDRange);

            textRef.current = editorRef.current?.getValue() ?? textRef.current;
        },
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
                <div style={{flex: 1}}>
                    <div css={{color: "purple", ":hover": {color: "red"}}}>
                        {state.getText(h)}
                    </div>
                    <input
                        type="text"
                        value={state.getText(h)}
                        onChange={event => state.setText(event.target.value)}
                    />
                </div>
            </div>
        </>
    );
};

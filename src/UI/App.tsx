import {useDataHook} from "model-react";
import {FC} from "react";
import {AppState} from "../state/AppState";
import ThreeScene from "./Three";

export const App: FC<{state: AppState}> = ({state}) => {
    const [h] = useDataHook();

    return (
        <>
            <div css={{color: "purple", ":hover": {color: "red"}}}>
                {state.getText(h)}
            </div>
            <input
                type="text"
                value={state.getText(h)}
                onChange={event => state.setText(event.target.value)}
            />
            <ThreeScene />
        </>
    );
};

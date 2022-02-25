import {useDataHook} from "model-react";
import {FC} from "react";
import {AppState} from "../state/AppState";
import {Canvas} from "./3D/Canvas";

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
            <Canvas
                css={{
                    height: 600,
                    width: 700,
                }}
                sweepObjectMesh={{faces: [], points: []}}
            />
        </>
    );
};

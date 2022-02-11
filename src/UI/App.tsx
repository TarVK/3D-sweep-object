import {useDataHook} from "model-react";
import {FC} from "react";
import {AppState} from "../state/AppState";

export const App: FC<{state: AppState}> = ({state}) => {
    const [h] = useDataHook();

    return (
        <>
            {state.getText(h)}
            <input
                type="text"
                value={state.getText(h)}
                onChange={event => state.setText(event.target.value)}
            />
        </>
    );
};

import ReactDOM from "react-dom";
import {AppState} from "./state/AppState";
import {App} from "./UI/App";

const state = new AppState();
ReactDOM.render(<App state={state} />, document.getElementById("root"));

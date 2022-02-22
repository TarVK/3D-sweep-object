import ReactDOM from "react-dom";
import {AppState} from "./state/AppState";
import {App} from "./UI/App";
import {result} from "./state/util/jsonSync/_trash/treeSitter";

const state = new AppState();
ReactDOM.render(<App state={state} />, document.getElementById("root"));

// const s = result;

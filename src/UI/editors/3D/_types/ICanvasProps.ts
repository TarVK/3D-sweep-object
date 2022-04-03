import {MutableRefObject} from "react";
import {SweepObjectState} from "../../../../state/SweepObjectState";
import {Scene} from "../Scene";

export type ICanvasProps = {
    sweepObjectState: SweepObjectState;
    className?: string;
    updateScene?: (scene: MutableRefObject<Scene>) => void;
    updateRenderer?: Function;
};

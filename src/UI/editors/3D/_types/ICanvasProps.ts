import {SweepObjectState} from "../../../../state/SweepObjectState";
import { Renderer } from "../Renderer";

export type ICanvasProps = {
    sweepObjectState: SweepObjectState;
    className?: string;
    updateScene?: Function;
    updateRenderer?: Function
};

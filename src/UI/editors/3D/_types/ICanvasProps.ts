import {SweepObjectState} from "../../../../state/SweepObjectState";

export type ICanvasProps = {
    sweepObjectState: SweepObjectState;
    className?: string;
    updateScene?: Function;
};

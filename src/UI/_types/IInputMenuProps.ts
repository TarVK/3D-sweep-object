import {SweepObjectState} from "../../state/SweepObjectState";

export type IInputMenuProps = {
    sweepObjectState: SweepObjectState;
    onSweepObjectChange: (object: SweepObjectState) => void;
};

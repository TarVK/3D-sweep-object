import {SweepObjectState} from "../../state/SweepObjectState";

export type IInputMenuProps = {
    sweepObjectState: SweepObjectState;
    openExportModel: Function;
    open: boolean;
    exportToFile: Function;
};

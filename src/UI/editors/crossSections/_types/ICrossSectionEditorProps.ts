import {SweepObjectState} from "../../../../state/SweepObjectState";

export type ICrossSectionEditorProps = {
    sweepObjectState: SweepObjectState;
    readonly?: boolean;

    height?: string | number;
    width?: string | number;
};

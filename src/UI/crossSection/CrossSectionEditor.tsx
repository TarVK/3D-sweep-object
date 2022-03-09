import {useDataHook} from "model-react";
import {FC, useState} from "react";
import {SweepObjectState} from "../../state/SweepObjectState";
import {EditorPlane} from "./plane/CrossSectionPlane";
import {ICrossSectionEditorProps} from "./_types/ICrossSectionEditorProps";

export const CrossSectionEditor: FC<ICrossSectionEditorProps> = ({
    sweepObjectState,
    width,
    height,
}) => {
    const [h] = useDataHook();
    const [selectedCrossSectionIndex, setSelectedCrossSectionIndex] = useState(0);
    const crossSections = sweepObjectState.getCrossSections(h);
    const selectedCrossSection =
        crossSections[Math.min(selectedCrossSectionIndex, crossSections.length - 1)];

    return <EditorPlane width={width} height={height}></EditorPlane>;
};

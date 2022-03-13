import {useDataHook} from "model-react";
import {FC, useEffect, useState} from "react";
import {CrossSection} from "./crossSection/CrossSection";
import {useCrossSectionInteractionHandlers} from "./useCrossSectionInteractionHandlers";
import {useCrossSectionEditorState} from "./CrossSectionEditorStateContext";
import {CrossSectionPlane} from "./plane/CrossSectionPlane";
import {ICrossSectionEditorProps} from "./_types/ICrossSectionEditorProps";

export const CrossSectionEditor: FC<ICrossSectionEditorProps> = ({
    sweepObjectState,
    width,
    height,
}) => {
    const [h] = useDataHook();
    const crossSectionEditorState = useCrossSectionEditorState();
    useEffect(() => {
        crossSectionEditorState.setSweepObject(sweepObjectState);
    }, [sweepObjectState]);

    const {onMouseDown, onMouseDrag, onMouseUp} = useCrossSectionInteractionHandlers();

    return (
        <CrossSectionPlane
            width={width}
            height={height}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseDrag}
            onMouseUp={onMouseUp}>
            <CrossSection />
        </CrossSectionPlane>
    );
};

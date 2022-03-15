import {FC, useEffect, useState} from "react";
import {CrossSection} from "./crossSection/CrossSection";
import {useCrossSectionInteractionHandlers} from "./interaction/useCrossSectionInteractionHandlers";
import {useCrossSectionEditorState} from "./CrossSectionEditorStateContext";
import {CrossSectionPlane} from "./plane/CrossSectionPlane";
import {ICrossSectionEditorProps} from "./_types/ICrossSectionEditorProps";

export const CrossSectionEditor: FC<ICrossSectionEditorProps> = ({
    sweepObjectState,
    width,
    height,
}) => {
    const crossSectionEditorState = useCrossSectionEditorState();
    useEffect(() => {
        crossSectionEditorState.setSweepObject(sweepObjectState);
    }, [sweepObjectState]);

    const {
        onMouseDown,
        onMouseMove,
        onMouseUp,
        onKeyDown,
        onKeyUp,
        onMouseEnter,
        onMouseLeave,
    } = useCrossSectionInteractionHandlers();

    return (
        <CrossSectionPlane
            width={width}
            height={height}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}>
            <CrossSection />
        </CrossSectionPlane>
    );
};

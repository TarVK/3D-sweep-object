import {useTheme} from "@mui/material";
import {useDataHook, useMemoDataHook} from "model-react";
import {FC, useMemo} from "react";
import {BezierSegmentState} from "../../../../../state/segments/BezierSegmentState";
import {Vec2} from "../../../../../util/Vec2";
import {useCrossSectionEditorState} from "../../CrossSectionEditorStateContext";
import {getSegmentSVGSpec} from "../getSegmentSVGSpec";
import {ISegmentProps} from "../_types/ISegmentProps";
import {getSegmentStyle} from "./getSegmentStyle";

export const BezierLineSegment: FC<ISegmentProps<BezierSegmentState<Vec2>>> = ({
    segment,
    includeLastPoint,
    selected,
}) => {
    const {handleSize, edgeWidth, handleOpacity, edgeOpacity, controlHandleOpacity} =
        getSegmentStyle(selected ?? false);

    const theme = useTheme();
    const [h] = useDataHook();
    const {scale} = useCrossSectionEditorState().getTransformation(h);

    const [path] = useMemoDataHook(h => getSegmentSVGSpec(segment, true, h), [segment]);
    const start = segment.getStart(h);
    const startControl = segment.getStartControl(h);
    const endControl = segment.getEndControl(h);
    const end = segment.getEnd(h);
    const startLine = useMemo(
        () => `M ${start.x} ${-start.y} L ${startControl.x} ${-startControl.y}`,
        [start, startControl]
    );
    const endLine = useMemo(
        () => `M ${endControl.x} ${-endControl.y} L ${end.x} ${-end.y}`,
        [end, endControl]
    );

    return (
        <>
            <path
                stroke={theme.palette.primaryColor}
                d={path}
                strokeWidth={edgeWidth / scale}
                opacity={edgeOpacity}
                fill="none"
            />
            <circle
                cx={start.x}
                cy={-start.y}
                r={handleSize / scale}
                fill={theme.palette.primaryColor}
                opacity={handleOpacity}
            />

            <path
                stroke={theme.palette.lightBlue}
                d={startLine}
                strokeWidth={edgeWidth / scale}
                opacity={edgeOpacity}
            />
            <path
                stroke={theme.palette.lightBlue}
                d={endLine}
                strokeWidth={edgeWidth / scale}
                opacity={edgeOpacity}
            />
            <circle
                cx={startControl.x}
                cy={-startControl.y}
                r={handleSize / scale}
                fill={theme.palette.primaryColor}
                opacity={controlHandleOpacity}
            />
            <circle
                cx={endControl.x}
                cy={-endControl.y}
                r={handleSize / scale}
                fill={theme.palette.primaryColor}
                opacity={controlHandleOpacity}
            />
            {(includeLastPoint || selected) && (
                <circle
                    cx={end.x}
                    cy={-end.y}
                    r={handleSize / scale}
                    fill={theme.palette.primaryColor}
                    opacity={handleOpacity}
                />
            )}
        </>
    );
};

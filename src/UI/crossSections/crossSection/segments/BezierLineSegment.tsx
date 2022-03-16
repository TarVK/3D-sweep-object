import {useTheme} from "@mui/material";
import {useDataHook, useMemoDataHook} from "model-react";
import {FC, useMemo} from "react";
import {BezierSegmentState} from "../../../../state/BezierSegmentState";
import {Vec2} from "../../../../util/Vec2";
import {useCrossSectionEditorState} from "../../CrossSectionEditorStateContext";
import {getSegmentSVGSpec} from "../getSegmentSVGSpec";

export const BezierLineSegment: FC<{
    segment: BezierSegmentState<Vec2>;
    includeLastPoint?: boolean;
}> = ({segment, includeLastPoint}) => {
    const handleSize = 5;
    const edgeWidth = 2;
    const handleOpacity = 0.8;
    const edgeOpacity = 0.8;

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
                stroke={theme.palette.primary.main}
                d={path}
                strokeWidth={edgeWidth / scale}
                opacity={edgeOpacity}
                fill="none"
            />
            <circle
                cx={start.x}
                cy={-start.y}
                r={handleSize / scale}
                fill={theme.palette.primary.main}
                opacity={handleOpacity}
            />

            <path
                stroke={theme.palette.primary.light}
                d={startLine}
                strokeWidth={edgeWidth / scale}
                opacity={edgeOpacity}
            />
            <path
                stroke={theme.palette.primary.light}
                d={endLine}
                strokeWidth={edgeWidth / scale}
                opacity={edgeOpacity}
            />
            <circle
                cx={startControl.x}
                cy={-startControl.y}
                r={handleSize / scale}
                fill={theme.palette.primary.main}
                opacity={handleOpacity}
            />
            <circle
                cx={endControl.x}
                cy={-endControl.y}
                r={handleSize / scale}
                fill={theme.palette.primary.main}
                opacity={handleOpacity}
            />
            {includeLastPoint && (
                <circle
                    cx={end.x}
                    cy={-end.y}
                    r={handleSize / scale}
                    fill={theme.palette.primary.main}
                    opacity={handleOpacity}
                />
            )}
        </>
    );
};

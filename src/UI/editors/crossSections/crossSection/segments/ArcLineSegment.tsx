import {useTheme} from "@mui/material";
import {useDataHook, useMemoDataHook} from "model-react";
import {FC, useMemo} from "react";
import {ArcSegmentState} from "../../../../../state/segments/ArcSegmentState";
import {useCrossSectionEditorState} from "../../CrossSectionEditorStateContext";
import {getSegmentSVGSpec} from "../getSegmentSVGSpec";

export const ArcLineSegment: FC<{
    segment: ArcSegmentState;
    includeLastPoint?: boolean;
}> = ({segment, includeLastPoint}) => {
    const handleSize = 5;
    const edgeWidth = 2;
    const handleOpacity = 0.8;
    const controlHandleOpacity = 0.6;
    const edgeOpacity = 0.8;

    const theme = useTheme();
    const [h] = useDataHook();
    const {scale} = useCrossSectionEditorState().getTransformation(h);

    const [path] = useMemoDataHook(h => getSegmentSVGSpec(segment, true, h), [segment]);
    const start = segment.getStart(h);
    const control = segment.getControl(h);
    const end = segment.getEnd(h);

    return (
        <>
            <path
                stroke={theme.palette.primary.main}
                d={path}
                fill="none"
                strokeWidth={edgeWidth / scale}
                opacity={edgeOpacity}
            />
            <circle
                cx={start.x}
                cy={-start.y}
                r={handleSize / scale}
                fill={theme.palette.primary.main}
                opacity={handleOpacity}
            />
            <circle
                cx={control.x}
                cy={-control.y}
                r={handleSize / scale}
                fill={theme.palette.primary.main}
                opacity={controlHandleOpacity}
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

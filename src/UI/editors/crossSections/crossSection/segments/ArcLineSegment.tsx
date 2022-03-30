import {useTheme} from "@mui/material";
import {useDataHook, useMemoDataHook} from "model-react";
import {FC, useMemo} from "react";
import {ArcSegmentState} from "../../../../../state/segments/ArcSegmentState";
import {useCrossSectionEditorState} from "../../CrossSectionEditorStateContext";
import {getSegmentSVGSpec} from "../getSegmentSVGSpec";
import {ISegmentProps} from "../_types/ISegmentProps";
import {getSegmentStyle} from "./getSegmentStyle";

export const ArcLineSegment: FC<ISegmentProps<ArcSegmentState>> = ({
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
    const control = segment.getControl(h);
    const end = segment.getEnd(h);

    return (
        <>
            <path
                stroke={theme.palette.primaryColor}
                d={path}
                fill="none"
                strokeWidth={edgeWidth / scale}
                opacity={edgeOpacity}
            />
            <circle
                cx={start.x}
                cy={-start.y}
                r={handleSize / scale}
                fill={theme.palette.primaryColor}
                opacity={handleOpacity}
            />
            <circle
                cx={control.x}
                cy={-control.y}
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

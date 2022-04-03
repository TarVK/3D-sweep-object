import {useTheme} from "@mui/material";
import {useDataHook, useMemoDataHook} from "model-react";
import {FC, useMemo} from "react";
import {StraightSegmentState} from "../../../../../state/segments/StraightSegmentState";
import {Vec2} from "../../../../../util/linearAlgebra/Vec2";
import {useCrossSectionEditorState} from "../../CrossSectionEditorStateContext";
import {getSegmentSVGSpec} from "../getSegmentSVGSpec";
import {ISegmentProps} from "../_types/ISegmentProps";
import {getSegmentStyle} from "./getSegmentStyle";

export const StraightLineSegment: FC<ISegmentProps<StraightSegmentState<Vec2>>> = ({
    segment,
    includeLastPoint,
    selected,
}) => {
    const {handleSize, edgeWidth, handleOpacity, edgeOpacity} = getSegmentStyle(
        selected ?? false
    );

    const theme = useTheme();
    const [h] = useDataHook();
    const {scale} = useCrossSectionEditorState().getTransformation(h);

    const [path] = useMemoDataHook(h => getSegmentSVGSpec(segment, true, h), [segment]);
    const start = segment.getStart(h);
    const end = segment.getEnd(h);

    return (
        <>
            <path
                stroke={theme.palette.primaryColor}
                d={path}
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

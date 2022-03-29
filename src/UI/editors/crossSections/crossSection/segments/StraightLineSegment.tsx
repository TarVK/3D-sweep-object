import {useTheme} from "@mui/material";
import {useDataHook, useMemoDataHook} from "model-react";
import {FC, useMemo} from "react";
import {StraightSegmentState} from "../../../../../state/segments/StraightSegmentState";
import {Vec2} from "../../../../../util/Vec2";
import {useCrossSectionEditorState} from "../../CrossSectionEditorStateContext";
import {getSegmentSVGSpec} from "../getSegmentSVGSpec";

export const StraightLineSegment: FC<{
    segment: StraightSegmentState<Vec2>;
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
    const end = segment.getEnd(h);

    return (
        <>
            <path
                stroke={theme.palette.primary.main}
                d={path}
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

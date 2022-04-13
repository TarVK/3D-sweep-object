import {useTheme} from "@mui/material";
import {useDataHook, useMemoDataHook} from "model-react";
import {FC} from "react";
import {useCrossSectionEditorState} from "../CrossSectionEditorStateContext";

export const CrossSectionApproximationPoints: FC = () => {
    const size = 4;
    const opacity = 0.3;

    const theme = useTheme();
    const [h] = useDataHook();
    const {scale} = useCrossSectionEditorState().getTransformation(h);

    const state = useCrossSectionEditorState();
    const [points] = useMemoDataHook(
        h =>
            state
                .getSelectedCrossSection(h)
                .normalize(
                    state.getSweepObject(h).getCrossSectionInterpolationPointCount(h),
                    h
                ),
        [state]
    );

    return (
        <>
            {points.map((point, i) => (
                <circle
                    key={i}
                    cx={point.x}
                    cy={-point.y}
                    r={(size / scale) * (i == 0 ? 2.5 : 1)}
                    fill={theme.palette.secondaryColor}
                    opacity={opacity}
                />
            ))}
        </>
    );
};

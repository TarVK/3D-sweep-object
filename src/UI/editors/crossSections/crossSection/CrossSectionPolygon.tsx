import {useTheme} from "@mui/material";
import {useDataHook, useMemoDataHook} from "model-react";
import {FC, useMemo} from "react";
import {Vec2} from "../../../../util/Vec2";
import {useCrossSectionEditorState} from "../CrossSectionEditorStateContext";
import {getSegmentSVGSpec} from "./getSegmentSVGSpec";

export const CrossSectionPolygon: FC = () => {
    const [h] = useDataHook();
    const state = useCrossSectionEditorState();
    const crossSection = state.getSelectedCrossSection(h);
    const segments = crossSection.getSegments(h);

    const theme = useTheme();

    const [path] = useMemoDataHook(
        h =>
            getSegmentSVGSpec(segments[0], true, h) +
            segments
                .slice(1)
                .map(s => getSegmentSVGSpec(s, false, h))
                .join(" "),
        [segments]
    );
    return <path fill={theme.palette.primary.light} opacity={0.6} d={path} />;
};

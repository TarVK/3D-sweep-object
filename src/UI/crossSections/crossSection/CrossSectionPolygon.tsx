import {useTheme} from "@mui/material";
import {useDataHook} from "model-react";
import {FC, useMemo} from "react";
import {Vec2} from "../../../util/Vec2";
import {getSegmentSVGSpec} from "./getSegmentSVGSpec";
import {ICrossSectionPolygonProps} from "./_types/ICrossSectionPolygonProps";

export const CrossSectionPolygon: FC<ICrossSectionPolygonProps> = ({crossSection}) => {
    const [h] = useDataHook();
    const segments = crossSection.getSegments(h);

    const theme = useTheme();

    const path = useMemo(() => {
        const {x, y} = segments[0]?.getStart() ?? new Vec2(0, 0);
        return `M ${x} ${-y} ` + segments.map(getSegmentSVGSpec).join(" ");
    }, [segments]);
    return <path fill={theme.palette.primary.main} opacity={0.8} d={path} />;
};

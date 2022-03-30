import {useDataHook} from "model-react";
import {FC, useMemo} from "react";
import {Menu} from "../Menu";
import {useCrossSectionEditorState} from "./CrossSectionEditorStateContext";
import {CustomArcIcon} from "../../custom/CustomArcIcon";
import {CustomBezierIcon} from "../../custom/CustomBezierIcon";
import {CustomStraightLineIcon} from "../../custom/CustomStraightIcon";
import {StraightSegmentState} from "../../../state/segments/StraightSegmentState";
import {ArcSegmentState} from "../../../state/segments/ArcSegmentState";
import {BezierSegmentState} from "../../../state/segments/BezierSegmentState";
import {ISegment} from "../../../state/_types/ISegment";
import {Vec2} from "../../../util/Vec2";

export const LineTypeMenu: FC = ({}) => {
    const editorState = useCrossSectionEditorState();
    const [h] = useDataHook();
    const segment = editorState.getSelectedHandle(h)?.segment;

    const lineTypeMenu = useMemo(() => {
        const createReplacer =
            (getReplacement: (replace: ISegment<Vec2>) => ISegment<Vec2>) => () => {
                if (!segment) return;
                const crossSection = editorState.getSelectedCrossSection();
                const replacement = getReplacement(segment);
                crossSection.replaceSegment(segment, replacement);
                editorState.selectHandle({segment: replacement, handle: "none"});
            };
        return [
            {
                icon: CustomStraightLineIcon,
                hoverText: "Straight Line",
                isSelected: segment instanceof StraightSegmentState,
                onClick: createReplacer(
                    segment =>
                        new StraightSegmentState(segment.getStart(), segment.getEnd())
                ),
            },
            {
                icon: CustomArcIcon,
                hoverText: "Arc Line",
                isSelected: segment instanceof ArcSegmentState,
                onClick: createReplacer(segment => {
                    const start = segment.getStart();
                    const end = segment.getEnd();
                    const center = start.add(end).mul(0.5);
                    return new ArcSegmentState(start, center, end);
                }),
            },
            {
                icon: CustomBezierIcon,
                hoverText: "Bezier Line",
                isSelected: segment instanceof BezierSegmentState,
                onClick: createReplacer(segment => {
                    const start = segment.getStart();
                    const end = segment.getEnd();
                    const startControl = start.mul(0.75).add(end.mul(0.25));
                    const endControl = start.mul(0.25).add(end.mul(0.75));
                    return new BezierSegmentState(start, startControl, endControl, end);
                }),
            },
        ];
    }, [segment, editorState]);

    if (!segment) return <></>;
    return <Menu items={lineTypeMenu} position={{top: 0, right: 0}} />;
};

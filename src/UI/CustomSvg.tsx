import { useMemoDataHook } from "model-react";
import {FC, useEffect, useState} from "react";
import {BezierSegmentState} from "../state/BezierSegmentState";
import {CrossSectionState} from "../state/CrossSectionState";
import {StraightSegmentState} from "../state/StraightSegmentState";
import {Vec2} from "../util/Vec2";

interface ICustomSvg {
    crossSection: CrossSectionState;
    strokeColor: string;
    backgroundColor: string;
    index: number;
    onClick: React.MouseEventHandler<HTMLDivElement>;
}

export const CustomSvg: FC<ICustomSvg> = ({crossSection, strokeColor, backgroundColor, index, onClick}) => {
    // const [crossSectionLocal, setCrossSectionLocal] = useState<CrossSectionState>();

    // useEffect(() => {
    //     setCrossSectionLocal(crossSection);
    // }, [crossSection]);

    const [path] = useMemoDataHook((h)=> {
        if (!crossSection) return;

        const segments = crossSection.getSegments(h);
        let path = "M";
        segments.forEach(segment => {
            if (segment instanceof BezierSegmentState) {
                const start = segment.getStart(h);
                const startControl = (
                    segment as BezierSegmentState<Vec2>
                ).getStartControl(h);
                const endControl = (segment as BezierSegmentState<Vec2>).getEndControl(h);
                const end = segment.getEnd(h);

                path += (path !== "M" ? " L" : "") + ` ${start.x} ${-start.y} C ${startControl.x} ${-startControl.y}, ${endControl.x} 
                    ${-endControl.y}, ${end.x} ${-end.y} \n`;
            } else if (segment instanceof StraightSegmentState) {
                const start = segment.getStart(h);
                const end = segment.getEnd(h);

                path += (path !== "M" ? " L" : "") +` ${start.x} ${-start.y} L ${end.x} ${-end.y} \n`;
            }
        });
        return path;
    }, [crossSection]);

    const [viewBox] = useMemoDataHook((h) => {
        if (!crossSection) return;

        const segments = crossSection.getSegments(h);
        let minX = Infinity;
        let minY = Infinity;
        let maxX = 0 - Infinity;
        let maxY = 0 - Infinity;

        segments.forEach(segment => {
            const boundingBox = segment.getBoundingBox(h);
            minX = Math.min(minX, boundingBox.minX);
            minY = Math.min(minY, -boundingBox.maxY);
            maxX = Math.max(maxX, boundingBox.maxX);
            maxY = Math.max(maxY, -boundingBox.minY);
        });

        return `${minX - 1} ${minY - 1} ${maxX - minX + 2} ${maxY - minY + 2}`;
    }, [crossSection]);

    return (
        <div css={{
            maxWidth: "40px",
            maxHeight: "40px",
            borderRadius: "4px",
            flex: "50%",
            margin: "3px",
            background: backgroundColor,
            position: "relative",
            ":hover": {
                cursor: "pointer"
            }
        }} onClick={onClick}>
            <div css={{
                position: "absolute",
                top: -3,
                left: -3,
                zIndex: 1,
                backgroundColor: "#0C2D48",
                color: "#FFF",
                width: "10px",
                height: "10px",
                fontSize: "10px",
                textAlign: "center",
                borderRadius: "4px"
            }}>{ index }</div>
            <svg
                width="40"
                height="40"
                xmlns="http://www.w3.org/2000/svg"
                viewBox={viewBox}
                preserveAspectRatio="none">
                <path d={path} stroke={strokeColor} strokeWidth=".3" fill="transparent" />
            </svg>
        </div>
    );
};

import {FC, useEffect, useState} from "react";
import {BezierSegmentState} from "../state/BezierSegmentState";
import {CrossSectionState} from "../state/CrossSectionState";
import {StraightSegmentState} from "../state/StraightSegmentState";
import {Vec2} from "../util/Vec2";

interface ICustomSvg {
    crossSection: CrossSectionState;
    strokeColor: string;
    backgroundColor: string;
    onClick: React.MouseEventHandler<HTMLDivElement>;
}

export const CustomSvg: FC<ICustomSvg> = props => {
    const [crossSectionLocal, setCrossSectionLocal] = useState<CrossSectionState>();

    useEffect(() => {
        setCrossSectionLocal(props.crossSection);
    }, [props.crossSection]);

    const getPath = () => {
        if (!crossSectionLocal) return;

        const segments = crossSectionLocal!.getSegments();
        let path = "M";
        segments.forEach(segment => {
            if (segment instanceof BezierSegmentState) {
                const start = segment.getStart();
                const startControl = (
                    segment as BezierSegmentState<Vec2>
                ).getStartControl();
                const endControl = (segment as BezierSegmentState<Vec2>).getEndControl();
                const end = segment.getEnd();

                path += (path !== "M" ? " L" : "") + ` ${start.x} ${-start.y} C ${startControl.x} ${-startControl.y}, ${endControl.x} 
                    ${-endControl.y}, ${end.x} ${-end.y} \n`;
            } else if (segment instanceof StraightSegmentState) {
                const start = segment.getStart();
                const end = segment.getEnd();

                path += (path !== "M" ? " L" : "") +` ${start.x} ${-start.y} L ${end.x} ${-end.y} \n`;
            }
        });
        return path;
    };

    const getViewBox = () => {
        if (!crossSectionLocal) return;

        const segments = crossSectionLocal!.getSegments();
        let minX = Infinity;
        let minY = Infinity;
        let maxX = 0 - Infinity;
        let maxY = 0 - Infinity;

        segments.forEach(segment => {
            const boundingBox = segment.getBoundingBox();
            minX = Math.min(minX, boundingBox.minX);
            minY = Math.min(minY, -boundingBox.maxY);
            maxX = Math.max(maxX, boundingBox.maxX);
            maxY = Math.max(maxY, -boundingBox.minY);
        });

        return `${minX - 1} ${minY - 1} ${maxX - minX + 2} ${maxY - minY + 2}`;
    };

    return (
        <div css={{
            maxWidth: "40px",
            maxHeight: "40px",
            borderRadius: "4px",
            flex: "50%",
            margin: "3px",
            background: props.backgroundColor,
            ":hover": {
                cursor: "pointer"
            }
        }} onClick={props.onClick}>
            <svg
                width="40"
                height="40"
                xmlns="http://www.w3.org/2000/svg"
                viewBox={getViewBox()}
                preserveAspectRatio="none">
                <path d={getPath()} stroke={props.strokeColor} strokeWidth=".3" fill="transparent" />
            </svg>
        </div>
    );
};

import {FC, useEffect, useMemo, useRef, useState} from "react";
import {Menu} from "./Menu";
import {ICanvasProps} from "./3D/_types/ICanvasProps";
import {
    AddCircleOutlineSharp,
    ClearOutlined,
    FileDownloadOutlined,
    FileUploadOutlined,
    MouseOutlined,
} from "@mui/icons-material";
import {CrossSectionsMenu} from "./CrossSectionsMenu";
import {RotationScaleMenu} from "./RotationScaleMenu";
import {CrossSectionEditor} from "./crossSections/CrossSectionEditor";
import {useCrossSectionEditorState} from "./crossSections/CrossSectionEditorStateContext";
import {useMemoDataHook} from "model-react";
import { CustomArcIcon } from "../custom/CustomArcIcon";
import { CustomBezierIcon } from "../custom/CustomBezierIcon";
import { CustomStraightLineIcon } from "../custom/CustomStraightIcon";

export const CrossSectionCanvas: FC<ICanvasProps> = ({sweepObjectState, ...props}) => {
    const editorState = useCrossSectionEditorState();
    const [pointMenuItems] = useMemoDataHook(h => {
        const selectedTool = editorState.getSelectedTool(h);
        return [
            {
                id: 0,
                icon: AddCircleOutlineSharp,
                hoverText: "Add point",
                isSelected: selectedTool == "add",
                onClick: () => editorState.selectTool("add"),
            },
            {
                id: 1,
                icon: MouseOutlined,
                hoverText: "Select point",
                isSelected: selectedTool == "edit",
                onClick: () => editorState.selectTool("edit"),
            },
            {
                id: 2,
                icon: ClearOutlined,
                hoverText: "Delete point",
                isSelected: selectedTool == "delete",
                onClick: () => editorState.selectTool("delete"),
            },
        ];
    }, []);
    const exportImportMenu = useMemo(
        () => [
            {
                icon:  CustomStraightLineIcon,
                hoverText: "Straight Line",
                onClick: () => {},
            },
            {
                icon: CustomArcIcon,
                hoverText: "Arc Line",
                onClick: () => {},
            },
            {
                icon:  CustomBezierIcon,
                hoverText: "Bezier Line",
                onClick: () => {},
            }
        ],
        []
    );
    return (
        <div
            {...props}
            css={{
                position: "relative",
                borderRadius: "4px",
                overflow: "hidden",
            }}>
            <CrossSectionEditor
                sweepObjectState={sweepObjectState}
                width="100%"
                height="100%"
            />
            <Menu items={pointMenuItems} position={{top: 0, left: 0}} />
            <Menu items={exportImportMenu} position={{top: 0, right: 0}} />
            <CrossSectionsMenu />
            <RotationScaleMenu />
            {/* <CustomIcon src={require=("/svgs/arc-line.svg")} /> */}
            <img src={require("/public/box.png")} />
        </div>
    );
};

import {FC, useEffect, useRef, useState} from "react";
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
import { IMenuButtonProps } from "./MenuButton";

export const CrossSectionCanvas: FC<ICanvasProps> = ({sweepObjectState, ...props}) => {
    const editorState = useCrossSectionEditorState();
    const [pointMenuItems, setPointMenuItems] = useState<Array<IMenuButtonProps>>([]);
    const pointMenuItemsArray = [
        {
            id: 0,
            icon: AddCircleOutlineSharp,
            hoverText: "Add point",
            isSelected: false,
            iconOnClick: () => editorState.selectTool("add"),
        },
        {
            id: 1,
            icon: MouseOutlined,
            hoverText: "Select point",
            isSelected: false,
            iconOnClick: () => editorState.selectTool("edit"),
        },
        {
            id: 2,
            icon: ClearOutlined,
            hoverText: "Delete point",
            isSelected: false,
            iconOnClick: () => editorState.selectTool("delete"),
        },
    ];

    const selectPointMenuItem = (index: number) => {
        pointMenuItemsArray.forEach(item => item.isSelected = false);

        pointMenuItemsArray[index].isSelected = true;

        setPointMenuItems(pointMenuItemsArray);
    }

    const exportImportMenu = [
        {
            icon: FileUploadOutlined,
            hoverText: "Import",
            iconOnClick: () => {},
        },
        {
            icon: FileDownloadOutlined,
            hoverText: "Export",
            iconOnClick: () => {},
        },
    ];

    useEffect(() => {
        setPointMenuItems(pointMenuItemsArray);
    }, []);

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
            <Menu props={{items: pointMenuItems, position: {top: 0, left: 0}, selectItem: selectPointMenuItem}} />
            <Menu props={{items: exportImportMenu, position: {top: 0, right: 0}}} />
            <CrossSectionsMenu />
            <RotationScaleMenu />
        </div>
    );
};

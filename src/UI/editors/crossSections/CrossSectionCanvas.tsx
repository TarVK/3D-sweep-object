import {FC, useMemo} from "react";
import {Menu} from "../Menu";
import {ICanvasProps} from "../3D/_types/ICanvasProps";
import {AddCircleOutlineSharp, ClearOutlined, MouseOutlined} from "@mui/icons-material";
import {CrossSectionsMenu} from "./CrossSectionsMenu";
import {RotationScaleMenu} from "../RotationScaleMenu";
import {CrossSectionEditor} from "./CrossSectionEditor";
import {useCrossSectionEditorState} from "./CrossSectionEditorStateContext";
import {useMemoDataHook} from "model-react";
import {LineTypeMenu} from "./LineTypeMenu";

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
            <LineTypeMenu />
            <CrossSectionsMenu />
            <RotationScaleMenu />
        </div>
    );
};

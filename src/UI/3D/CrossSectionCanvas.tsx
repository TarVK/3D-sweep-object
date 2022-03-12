import {FC, useEffect, useRef} from "react";
import {Renderer} from "./Renderer";
import {useRefLazy} from "../hooks/useRefLazy";
import {Menu} from "./Menu";
import {Scene} from "./Scene";
import {ICanvasProps} from "./_types/ICanvasProps";
import {
    AddCircleOutlineSharp,
    ClearOutlined,
    FileDownloadOutlined,
    FileUploadOutlined,
    MouseOutlined,
} from "@mui/icons-material";
import {CrossSectionsMenu} from "./CrossSectionsMenu";
import {RotationScaleMenu} from "./RotationScaleMenu";
import {CrossSectionEditor} from "../crossSections/CrossSectionEditor";

export const CrossSectionCanvas: FC<ICanvasProps> = ({sweepObjectState, ...props}) => {
    const pointMenuItems = [
        {
            icon: AddCircleOutlineSharp,
            hoverText: "Add point",
            iconOnClick: () => {},
        },
        {
            icon: MouseOutlined,
            hoverText: "Select point",
            iconOnClick: () => {},
        },
        {
            icon: ClearOutlined,
            hoverText: "Delete point",
            iconOnClick: () => {},
        },
    ];

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
            <Menu props={{items: pointMenuItems, position: {top: 0, left: 0}}} />
            <Menu props={{items: exportImportMenu, position: {top: 0, right: 0}}} />
            <CrossSectionsMenu crossSections={["Cross section 1", "Cross section 2"]} />
            <RotationScaleMenu />
        </div>
    );
};

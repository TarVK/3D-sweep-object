import {
    DataObjectOutlined,
    InsertPhotoOutlined,
    ViewInArOutlined,
} from "@mui/icons-material";
import {Button, Menu, MenuItem, Modal} from "@mui/material";
import {FC, useState} from "react";

interface IExportModelProps {
    exportToFile: Function;
}

export enum FileType {
    OBJ = "obj",
    STL = "stl",
    PNG = "png",
    JSON = "json",
    NONE = "none",
}

export const ExportModel: FC<IExportModelProps> = ({exportToFile}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const selectFileType = (type: FileType) => {
        setAnchorEl(null);

        exportToFile(type);
    };

    return (
        <div>
            <Button
                variant="contained"
                onClick={event => handleClick(event)}
                sx={{
                    borderRadius: "4px",
                    maxWidth: 140,
                }}
                size="small">
                Export Model
            </Button>
            <Menu
                id="fade-menu"
                MenuListProps={{
                    "aria-labelledby": "fade-button",
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}>
                <MenuItem onClick={() => selectFileType(FileType.OBJ)}>
                    <ViewInArOutlined
                        css={{
                            marginRight: "10px",
                        }}
                    />
                    .OBJ
                </MenuItem>
                <MenuItem onClick={() => selectFileType(FileType.STL)}>
                    {" "}
                    <ViewInArOutlined
                        css={{
                            marginRight: "10px",
                        }}
                    />
                    .STL
                </MenuItem>
                <MenuItem onClick={() => selectFileType(FileType.PNG)}>
                    <InsertPhotoOutlined
                        css={{
                            marginRight: "10px",
                        }}
                    />
                    .PNG
                </MenuItem>
                <MenuItem onClick={() => selectFileType(FileType.JSON)}>
                    <DataObjectOutlined
                        css={{
                            marginRight: "10px",
                        }}
                    />
                    .JSON
                </MenuItem>
            </Menu>
        </div>
    );
};

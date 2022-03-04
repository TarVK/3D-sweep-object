import {Button, ListItemIcon, MenuItem, MenuList, TextField} from "@mui/material";
import {
    ChangeHistoryOutlined,
    CircleOutlined,
    HexagonOutlined,
    KeyboardArrowDownSharp,
} from "@mui/icons-material";
import {FC, useState} from "react";
import {StyledMenu} from "./3D/styled/StyledMenu";

export const InputMenu: FC = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
        console.log(open)
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div
            css={{
                margin: "auto auto",
                display: "flex",
                justifyContent: "center",
                verticalAlign: "center",
                gap: "25px"
            }}
            className="input-menu-wrapper">
            <TextField
                id="outlined-basic"
                label="Cross sections"
                variant="outlined"
                type="number"
                size="small"
            />
            <TextField
                id="outlined-basic"
                label="Intersections"
                variant="outlined"
                type="number"
                size="small"
            />
            <div css={{
                margin: "auto 0"
            }}>
                <Button
                    id="demo-customized-button"
                    aria-controls={open ? "demo-customized-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    variant="contained"
                    disableElevation
                    onClick={handleClick}
                    endIcon={<KeyboardArrowDownSharp />}>
                    Start shape
                </Button>
                <StyledMenu
                    id="demo-customized-menu"
                    MenuListProps={{
                        "aria-labelledby": "demo-customized-button",
                    }}
                    anchorEl={anchorEl}
                    opened={open}
                    onClose={handleClose}>
                    <MenuItem onClick={handleClose} disableRipple>
                        <CircleOutlined />
                    </MenuItem>
                    <MenuItem onClick={handleClose} disableRipple>
                        <ChangeHistoryOutlined />
                    </MenuItem>
                    <MenuItem onClick={handleClose} disableRipple>
                        <HexagonOutlined />
                    </MenuItem>
                </StyledMenu>
            </div>
        </div>
    );
};

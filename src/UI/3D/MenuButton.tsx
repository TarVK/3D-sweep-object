import { SvgIconComponent } from "@mui/icons-material";
import { Button, Tooltip } from "@mui/material";
import { FC } from "react";

interface MenuButtonProps {
    icon: SvgIconComponent,
    hoverText: string,
    iconOnClick: Function
};

export const MenuButton: FC<{props: MenuButtonProps}> = ({props}) => {
    return (
        <div css={{
            maxWidth: "64px",
            minWidth: "50px",
            display: "flex",
            justifyContent: "center"
        }}>
            <Tooltip title={props.hoverText}>
                <Button onClick={() => props.iconOnClick()} size="small" style={{
                    maxWidth: "50px",
                    color: "#145DA0"
                }}>
                    <props.icon></props.icon>
                </Button>
            </Tooltip>
        </div>
    );
};
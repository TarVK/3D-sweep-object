import {SvgIconComponent} from "@mui/icons-material";
import {Button, Tooltip} from "@mui/material";
import {FC} from "react";

export interface IMenuButtonProps {
    id: number;
    icon: SvgIconComponent;
    hoverText: string;
    isSelected: boolean;
    iconOnClick: Function;
    selectItem?: Function;
}

export const MenuButton: FC<{props: IMenuButtonProps}> = ({props}) => {
    return (
        <div
            css={{
                maxWidth: "64px",
                minWidth: "50px",
                display: "flex",
                justifyContent: "center",
                backgroundColor: props.isSelected ? "#145DA0" : "#B1D4E0",
                borderRadius: "4px",
            }}>
            <Tooltip title={props.hoverText}>
                <Button
                    onClick={() => {
                        console.log(props.selectItem)
                        if (props.selectItem) props.selectItem(props.id);
                        props.iconOnClick();
                    }}
                    size="small"
                    style={{
                        maxWidth: "50px",
                        color: props.isSelected ? "#FFF" : "#145DA0",
                    }}>
                    <props.icon></props.icon>
                </Button>
            </Tooltip>
        </div>
    );
};

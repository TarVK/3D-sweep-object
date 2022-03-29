import {SvgIconComponent} from "@mui/icons-material";
import {Button, Tooltip} from "@mui/material";
import {FC} from "react";

export interface IMenuButtonProps {
    id?: number;
    icon: SvgIconComponent;
    hoverText: string;
    isSelected?: boolean;
    onClick: () => void;
}

export const MenuButton: FC<IMenuButtonProps> = ({
    isSelected,
    hoverText,
    onClick,
    icon: Icon,
}) => {
    return (
        <div
            css={{
                maxWidth: "64px",
                minWidth: "50px",
                display: "flex",
                justifyContent: "center",
                backgroundColor: isSelected ? "#145DA0" : "#B1D4E0",
                borderRadius: "4px",
            }}>
            <Tooltip title={hoverText}>
                <Button
                    onClick={onClick}
                    size="small"
                    style={{
                        maxWidth: "50px",
                        color: isSelected ? "#FFF" : "#145DA0",
                    }}>
                    <Icon />
                </Button>
            </Tooltip>
        </div>
    );
};

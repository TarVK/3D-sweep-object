import {SvgIconComponent} from "@mui/icons-material";
import {Button, Tooltip} from "@mui/material";
import {useTheme} from "@mui/system";
import {FC} from "react";

export interface IMenuButtonProps {
    id?: number;
    icon: SvgIconComponent;
    hoverText: string;
    isSelected?: boolean;
    isCustomIcon?: boolean;
    isDisabled?: boolean;
    onClick: () => void;
}

export const MenuButton: FC<IMenuButtonProps> = ({
    isSelected,
    hoverText,
    onClick,
    icon: Icon,
    isCustomIcon,
    isDisabled,
}) => {
    const theme = useTheme();

    return (
        <div
            css={{
                maxWidth: "64px",
                minWidth: "50px",
                display: "flex",
                justifyContent: "center",
                backgroundColor: isSelected
                    ? theme.palette.primaryColor
                    : theme.palette.lightBlue,
                borderRadius: "4px",
            }}>
            <Tooltip title={hoverText}>
                <Button
                    onClick={onClick}
                    size="small"
                    style={{
                        maxWidth: "50px",
                        color: isSelected ? "#FFF" : theme.palette.primaryColor,
                    }}>
                    {isCustomIcon ? (
                        <Icon
                            color={isDisabled ? "disabled" : "inherit"}
                            sx={{
                                stroke: isSelected ? "#FFF" : theme.palette.primaryColor,
                            }}
                        />
                    ) : (
                        <Icon color={isDisabled ? "disabled" : "inherit"} />
                    )}
                </Button>
            </Tooltip>
        </div>
    );
};

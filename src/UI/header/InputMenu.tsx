import {HelpOutline} from "@mui/icons-material";
import {Button, TextField, Tooltip, useTheme} from "@mui/material";
import {FC} from "react";
import {ExportModel} from "../editors/ExportModel";
import {IInputMenuProps} from "../_types/IInputMenuProps";
import {ImportButton} from "./ImportButton";

export const InputMenu: FC<IInputMenuProps> = ({
    open,
    exportToFile,
    onSweepObjectChange,
}) => {
    const theme = useTheme();

    return (
        <div
            css={{
                margin: "auto auto",
                display: "flex",
                justifyContent: "left",
                gap: "25px",
                alignItems: "center",
                paddingLeft: "25px",
                background: theme.palette.primaryColor,
            }}>
            <h1
                css={{
                    ...theme.typography.h1,
                }}>
                Logo
            </h1>
            <Button variant="contained" size="small">
                <ImportButton onInput={onSweepObjectChange} />
                Import model
            </Button>
            <ExportModel open={open} exportToFile={exportToFile} />
            <TextField
                label="Intersections"
                type="number"
                size="small"
                InputLabelProps={{
                    style: {
                        color: "#FFF",
                    },
                }}
                InputProps={{
                    style: {
                        border: "4px solid #FFF !important",
                    },
                }}
                sx={{
                    input: {
                        color: "#FFF",
                    },
                    "&.Mui-focused": {
                        color: "#23A5EB",
                    },
                }}
            />
            <div
                css={{
                    position: "relative",
                }}>
                <TextField
                    label="Cross section points"
                    type="number"
                    size="small"
                    InputLabelProps={{
                        style: {
                            color: "#FFF",
                        },
                    }}
                    InputProps={{
                        style: {
                            border: "4px solid #FFF !important",
                        },
                    }}
                    sx={{
                        minWidth: "200px",
                        input: {
                            color: "#FFF",
                        },
                        "&.Mui-focused": {
                            color: "#23A5EB",
                        },
                    }}
                />
                <Tooltip
                    title="Number of cross sections defines the morphing precision."
                    disableInteractive>
                    <HelpOutline
                        sx={{transform: "scale(0.7)", opacity: 0.7}}
                        css={{
                            position: "absolute",
                            top: -10,
                            right: -10,
                            zIndex: 2,
                            color: theme.palette.lightBlue,
                        }}
                    />
                </Tooltip>
            </div>
        </div>
    );
};

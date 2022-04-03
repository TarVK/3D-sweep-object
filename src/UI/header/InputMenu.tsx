import {HelpOutline} from "@mui/icons-material";
import {Button, TextField, Tooltip, useTheme} from "@mui/material";
import {FC, useEffect, useState} from "react";
import {useDataHook} from "model-react";
import {ExportModel} from "../editors/ExportModel";
import {IInputMenuProps} from "../_types/IInputMenuProps";
import {ImportButton} from "./ImportButton";

export const InputMenu: FC<IInputMenuProps> = ({
    sweepObjectState,
    exportToFile,
    onSweepObjectChange,
}) => {
    const theme = useTheme();
    const [h] = useDataHook();

    const currentLinePoints = sweepObjectState.getSweepLineInterpolationPointCount(h);
    const [linePoints, setLinePoints] = useState(currentLinePoints + "");
    useEffect(() => setLinePoints(currentLinePoints + ""), [currentLinePoints]);

    const currentCrossSectionPoints =
        sweepObjectState.getCrossSectionInterpolationPointCount(h);
    const [crossSectionPoints, setCrossSectionPoints] = useState(
        currentCrossSectionPoints + ""
    );
    useEffect(
        () => setCrossSectionPoints(currentCrossSectionPoints + ""),
        [currentCrossSectionPoints]
    );

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
            <ExportModel exportToFile={exportToFile} />
            <div
                css={{
                    position: "relative",
                }}>
                <TextField
                    label="Sweepline points"
                    type="number"
                    size="small"
                    value={linePoints}
                    onChange={e => setLinePoints(e.target.value)}
                    onBlur={() =>
                        sweepObjectState.setSweepLineInterpolationPointCount(
                            Math.max(5, Number(linePoints))
                        )
                    }
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
                <Tooltip
                    title="The number of cross-sections to be placed along the sweepline"
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
            <div
                css={{
                    position: "relative",
                }}>
                <TextField
                    label="Cross section points"
                    type="number"
                    size="small"
                    value={crossSectionPoints}
                    onChange={e => setCrossSectionPoints(e.target.value)}
                    onBlur={e =>
                        sweepObjectState.setCrossSectionInterpolationPointCount(
                            Math.max(3, Number(crossSectionPoints))
                        )
                    }
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
                    title="The number of points to approximate each cross-section by"
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

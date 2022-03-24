import {Button, TextField} from "@mui/material";
import {FC} from "react";
import { sweepObjectToJSON } from "../../state/JSON/sweepObjectToJSON";
import { ExportModel } from "../editors/ExportModel";
import { IInputMenuProps } from "../_types/IInputMenuProps";

export const InputMenu: FC<IInputMenuProps> = ({sweepObjectState, openExportModel, open, exportToFile, onSweepObjectChange}) => {
    return (
        <div
            css={{
                margin: "auto auto",
                display: "flex",
                justifyContent: "left",
                gap: "25px",
                alignItems: "center",
                paddingLeft: "25px",
            }}>
            <h1>Logo</h1>
            <Button variant="contained" size="small">
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
        </div>
    );
};

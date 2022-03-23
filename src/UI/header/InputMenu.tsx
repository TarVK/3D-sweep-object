import {Button, TextField} from "@mui/material";
import {FC} from "react";
import {sweepObjectToJSON} from "../../state/JSON/sweepObjectToJSON";
import {IInputMenuProps} from "../_types/IInputMenuProps";
import {ImportButton} from "./ImportButton";

export const InputMenu: FC<IInputMenuProps> = ({
    sweepObjectState,
    onSweepObjectChange,
}) => {
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
                <ImportButton onInput={onSweepObjectChange} />
            </Button>
            <Button
                variant="contained"
                size="small"
                onClick={
                    // TODO: replace with the proper download modal/functionality
                    () => {
                        const json = sweepObjectToJSON(sweepObjectState);
                        (window as any).output = JSON.stringify(json, null, 4);
                        console.log(json);
                    }
                }>
                Export model
            </Button>
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

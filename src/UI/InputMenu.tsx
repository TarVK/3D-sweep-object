import {Button, TextField} from "@mui/material";
import {FC} from "react";

export const InputMenu: FC = () => {

    return (
        <div
            css={{
                margin: "auto auto",
                display: "flex",
                justifyContent: "left",
                gap: "25px",
                alignItems: "center",
                paddingLeft: "25px"
            }}>
            <h1>Logo</h1>
            <Button variant="contained" size="small">Import model</Button>
            <Button variant="contained" size="small">Export model</Button>
            <Button variant="contained" size="small">Start shape</Button>
            <TextField label="Intersections" type="number" size="small" />
        </div>
    );
};

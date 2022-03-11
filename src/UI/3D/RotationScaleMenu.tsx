import {TextField} from "@mui/material";
import {FC, useState} from "react";

// TO-DO add props for this component
export const RotationScaleMenu: FC = () => {
    const [rotation, setRotation] = useState<number>();
    const [scale, setScale] = useState<number>();

    return (
        <div
            css={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: "rgba(177,212,224,0.7)",
                margin: "10px",
                borderRadius: "4px",
                maxWidth: "150px",
                padding: "5px",
                color: "#145DA0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                minHeight: "110px",
            }}>
            <TextField
                id="standard-basic"
                type="number"
                label="Rotation"
                value={rotation}
                size="small"
                onChange={value => setRotation(value.target.value as unknown as number)}
                inputProps={{
                    style: {
                        borderRadius: "4px",
                        borderColor: "transparent"
                    },
                }}
            />
            <TextField
                id="standard-basic"
                type="number"
                label="Scale"
                value={scale}
                size="small"
                onChange={value => setScale(value.target.value as unknown as number)}
            />
        </div>
    );
};

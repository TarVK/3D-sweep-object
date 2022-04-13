import {HelpOutline, HelpOutlined} from "@mui/icons-material";
import {Input, Tooltip, useTheme, Typography} from "@mui/material";
import {FC, useEffect, useRef, useState} from "react";
import {Object3D} from "three";

interface SelectedPointProps {
    point: Object3D;
    triggerUpdate: Function;
}

export const SelectedPoint: FC<SelectedPointProps> = ({point, triggerUpdate}) => {
    const theme = useTheme();
    const [localX, setLocalX] = useState<number>(point.position.x);
    const [localY, setLocalY] = useState<number>(point.position.y);
    const [localZ, setLocalZ] = useState<number>(point.position.z);

    const [xIsOnEditMode, setXIsOnEditMode] = useState<boolean>(false);
    const [yIsOnEditMode, setYIsOnEditMode] = useState<boolean>(false);
    const [zIsOnEditMode, setZIsOnEditMode] = useState<boolean>(false);

    useEffect(() => {
        setLocalX(point.position.x);
    }, [point.position.x]);

    useEffect(() => {
        setLocalY(point.position.y);
    }, [point.position.y]);

    useEffect(() => {
        setLocalZ(point.position.z);
    }, [point.position.z]);

    const enterXValue = (value: number) => {
        point.position.set(value, localY, localZ);
        setLocalX(value);
        triggerUpdate();
        setXIsOnEditMode(false);
    };

    const enterYValue = (value: number) => {
        point.position.set(localX, value, localZ);
        triggerUpdate();
        setLocalY(value);
        setYIsOnEditMode(false);
    };

    const enterZValue = (value: number) => {
        point.position.set(localX, localY, value);
        triggerUpdate();
        setLocalZ(value);
        setZIsOnEditMode(false);
    };

    return (
        <div
            css={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                minWidth: "160px",
                maxWidth: "160px",
                maxHeight: "160px",
                position: "absolute",
                bottom: "0px",
                right: "0px",
                backgroundColor: "rgba(177,212,224,0.7)",
                margin: "10px",
                borderRadius: "4px",
                color: theme.palette.primaryColor,
                padding: "5px",
            }}>
            <div
                css={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                    borderBottom: "2px dashed #145DA0",
                }}>
                <Typography
                    variant="h3"
                    component="h3"
                    css={{
                        margin: "0",
                    }}>
                    Selected point
                </Typography>{" "}
                <Tooltip title="Double click on value to update.">
                    <HelpOutline sx={{transform: "scale(0.7)", opacity: 0.7}} />
                </Tooltip>
            </div>

            <div
                className="coordinates"
                css={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                }}>
                {" "}
                {!xIsOnEditMode ? (
                    <h4
                        className="xCoordinate"
                        css={{
                            margin: "5px",
                            ...theme.typography.h4,
                        }}
                        onClick={() => setXIsOnEditMode(true)}>
                        <b>X:</b> {Number(localX).toFixed(2)}
                    </h4>
                ) : (
                    <CoordinateInput value={localX} onChange={enterXValue} />
                )}
                {!yIsOnEditMode ? (
                    <h4
                        className="yCoordinate"
                        css={{
                            margin: "5px",
                            ...theme.typography.h4,
                        }}
                        onClick={() => setYIsOnEditMode(true)}>
                        <b>Y:</b> {Number(localY).toFixed(2)}
                    </h4>
                ) : (
                    <CoordinateInput value={localY} onChange={enterYValue} />
                )}
                {!zIsOnEditMode ? (
                    <h4
                        className="zCoordinate"
                        css={{
                            margin: "5px",
                            ...theme.typography.h4,
                        }}
                        onClick={() => setZIsOnEditMode(true)}>
                        <b>Z:</b> {Number(localZ).toFixed(2)}
                    </h4>
                ) : (
                    <CoordinateInput value={localZ} onChange={enterZValue} />
                )}
            </div>
        </div>
    );
};

const CoordinateInput: FC<{value: number; onChange: (value: number) => void}> = ({
    value,
    onChange,
}) => {
    const [newValueText, setNewValueText] = useState(value + "");
    useEffect(() => setNewValueText(value + ""), [value]);

    const updateValue = () => {
        const newValue = Number(newValueText);
        if (isNaN(newValue)) onChange(value);
        else onChange(newValue);
    };

    return (
        <Input
            value={newValueText}
            onChange={e => setNewValueText(e.target.value)}
            onBlur={updateValue}
            autoFocus
            onKeyDown={event => {
                if (event.key === "Enter") updateValue();
            }}
        />
    );
};

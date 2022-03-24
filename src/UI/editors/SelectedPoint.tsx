import {Input} from "@mui/material";
import {FC, useEffect, useState} from "react";
import {Object3D} from "three";

interface SelectedPointProps {
    point: Object3D;
}

export const SelectedPoint: FC<SelectedPointProps> = props => {
    const [localX, setLocalX] = useState<number>(props.point.position.x);
    const [localY, setLocalY] = useState<number>(props.point.position.y);
    const [localZ, setLocalZ] = useState<number>(props.point.position.z);

    const [xIsOnEditMode, setXIsOnEditMode] = useState<boolean>(false);
    const [yIsOnEditMode, setYIsOnEditMode] = useState<boolean>(false);
    const [zIsOnEditMode, setZIsOnEditMode] = useState<boolean>(false);

    useEffect(() => {
        setLocalX(props.point.position.x);
    }, [props.point.position.x]);

    useEffect(() => {
        setLocalY(props.point.position.y);
    }, [props.point.position.y]);

    useEffect(() => {
        setLocalZ(props.point.position.z);
    }, [props.point.position.z]);

    const enterXValue = (event: any) => {
        // setLocalX(event.target.value);
        // props.point.position.setX(event.target.value);
        props.point.position.set(event.target.value, localY, localZ);
        setLocalX(props.point.position.x);
    };

    const enterYValue = (event: any) => {
        props.point.position.set(localX, event.target.value, localZ);
        setLocalY(event.target.value);
    };

    const enterZValue = (event: any) => {
        props.point.position.set(localX, localY, event.target.value);
        setLocalZ(event.target.value);
    };

    return (
        <div
            css={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                minWidth: "140px",
                maxHeight: "160px",
                position: "absolute",
                bottom: "0px",
                right: "0px",
                backgroundColor: "rgba(177,212,224,0.7)",
                margin: "10px",
                borderRadius: "4px",
                color: "#145DA0",
                padding: "5px",
            }}>
            <h3
                css={{
                    margin: "0px 5px 5px",
                }}>
                Selected point
            </h3>
            <div
                className="coordinates"
                css={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                }}>
                {" "}
                {!xIsOnEditMode ? (
                    <p
                        className="xCoordinate"
                        css={{
                            margin: "5px",
                        }}
                        onDoubleClick={() => setXIsOnEditMode(true)}>
                        <b>X:</b> {Number(localX).toFixed(2)}
                    </p>
                ) : (
                    <Input
                        value={localX}
                        onChange={enterXValue}
                        onKeyDown={event => {
                            if (event.key === "Enter") setXIsOnEditMode(false)}}
                    />
                )}
                {!yIsOnEditMode ? (
                    <p
                        className="yCoordinate"
                        css={{
                            margin: "5px",
                        }}
                        onDoubleClick={() => setYIsOnEditMode(true)}>
                        <b>Y:</b> {Number(localY).toFixed(2)}
                    </p>
                ) : (
                    <Input
                        value={localY}
                        onChange={enterYValue}
                        onKeyDown={event => {
                            if (event.key === "Enter") setYIsOnEditMode(false);
                        }}
                    />
                )}
                {!zIsOnEditMode ? (
                    <p
                        className="zCoordinate"
                        css={{
                            margin: "5px",
                        }}
                        onDoubleClick={() => setZIsOnEditMode(true)}>
                        <b>Z:</b> {Number(localZ).toFixed(2)}
                    </p>
                ) : (
                    <Input
                        value={localZ}
                        onChange={enterZValue}
                        onKeyDown={event => {
                            if (event.key === "Enter") setZIsOnEditMode(false);
                        }}
                    />
                )}
            </div>
        </div>
    );
};

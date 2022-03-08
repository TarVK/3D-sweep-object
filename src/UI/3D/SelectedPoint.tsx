import { FC } from "react";

interface SelectedPointProps {
    x: number,
    y: number,
    z: number
};

export const SelectedPoint: FC<{props: SelectedPointProps}> = ({props}) => {
    return (
        <div css={{
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
            padding: "5px"
        }}>
            <h3 css={{
                margin: "0px 5px 5px",
            }}>Selected point</h3>
            <div className="coordinates" css={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start"
            }}>
                <p className="xCoordinate" css={{
                    margin: "5px"
                }}><b>X:</b> {props.x}</p>
                <p className="yCoordinate" css={{
                    margin: "5px"
                }}><b>Y:</b> {props.y}</p>
                <p className="zCoordinate" css={{
                    margin: "5px"
                }}><b>X:</b> {props.z}</p>
            </div>
        </div>
    );
};

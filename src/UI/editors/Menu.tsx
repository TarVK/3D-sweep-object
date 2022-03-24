import {FC, useEffect, useState} from "react";
import {MenuButton} from "./MenuButton";

interface IMenuProps {
    items: Array<any>;
    selectItem?: Function;
    position?: {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
        margin?: string;
    };
}

export const Menu: FC<{props: IMenuProps}> = ({props}) => {
    return (
        <div
            css={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                position: "absolute",
                backgroundColor: "rgba(177,212,224,0.7)",
                margin: "10px",
                borderRadius: "4px",
                ...props.position,
            }}>
            {props.items.map((item, index) => {
                return <MenuButton props={{...item, selectItem: props.selectItem}} key={index}/>;
            })}
        </div>
    );
};

import {FC, useEffect, useState} from "react";
import {IMenuButtonProps, MenuButton} from "./MenuButton";

interface IMenuProps {
    items: Array<IMenuButtonProps>;
    position?: {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
        margin?: string;
    };
}

export const Menu: FC<IMenuProps> = ({position, items}) => {
    return (
        <div
            css={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                gap: "4px",
                padding: "4px",
                position: "absolute",
                backgroundColor: "rgba(177,212,224,0.4)",
                margin: "10px",
                borderRadius: "4px",
                ...position,
            }}>
            {items.map((item, index) => (
                <MenuButton {...item} key={index} />
            ))}
        </div>
    );
};

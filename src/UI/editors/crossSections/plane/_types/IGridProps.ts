import {Vec2} from "../../../../../util/Vec2";

export type IGridProps = {
    gridSize: number;
    scale: number;
    offset: Vec2;
    type: "none" | "minor" | "major";
};

import {Vec2} from "../../util/Vec2";
import {ISegment} from "./ISegment";

export type ICrossSectionHandleSelection = {
    handle: string;
    segment: ISegment<Vec2>;
};

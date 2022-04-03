import {ISegment} from "../../../../../state/_types/ISegment";
import {Vec2} from "../../../../../util/linearAlgebra/Vec2";

export type ISegmentProps<T extends ISegment<Vec2>> = {
    segment: T;
    includeLastPoint?: boolean;
    selected?: boolean;
};

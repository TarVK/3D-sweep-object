import {createContext, useContext} from "react";
import {BezierSegmentState} from "../../../state/segments/BezierSegmentState";
import {CrossSectionEditorState} from "../../../state/CrossSectionEditorState";
import {CrossSectionState} from "../../../state/CrossSectionState";
import {StraightSegmentState} from "../../../state/segments/StraightSegmentState";
import {SweepLineState} from "../../../state/SweepLineState";
import {SweepObjectState} from "../../../state/SweepObjectState";
import {Vec2} from "../../../util/Vec2";
import {Vec3} from "../../../util/Vec3";

export const CrossSectionEditorStateContext = createContext(
    new CrossSectionEditorState(
        new SweepObjectState(
            new SweepLineState([
                new BezierSegmentState(
                    new Vec3(0, 0, 0),
                    new Vec3(0, 20, 0),
                    new Vec3(20, 0, 0),
                    new Vec3(20, 20, 0)
                ),
            ]),
            [
                new CrossSectionState([
                    new StraightSegmentState(new Vec2(0, 0), new Vec2(0, 6)),
                    new StraightSegmentState(new Vec2(0, 6), new Vec2(6, 3)),
                    new StraightSegmentState(new Vec2(6, 3), new Vec2(0, 0)),
                ]),
            ]
        )
    )
);

/**
 * Retrieves the cross section editor's state
 * @returns The state
 */
export const useCrossSectionEditorState = () =>
    useContext(CrossSectionEditorStateContext);

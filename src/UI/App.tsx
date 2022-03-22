import {useDataHook} from "model-react";
import {FC, useMemo} from "react";
import {BezierSegmentState} from "../state/BezierSegmentState";
import {CrossSectionState} from "../state/CrossSectionState";
import {StraightSegmentState} from "../state/StraightSegmentState";
import {SweepLineState} from "../state/SweepLineState";
import {SweepObjectState} from "../state/SweepObjectState";
import {Vec2} from "../util/Vec2";
import {Vec3} from "../util/Vec3";
import {Canvas} from "./3D/Canvas";
import {useRefLazy} from "./hooks/useRefLazy";
import {CrossSectionCanvas} from "./3D/CrossSectionCanvas";
import {InputMenu} from "./InputMenu";

export const App: FC = () => {
    const [h] = useDataHook();
    const sweepObjectState = useRefLazy(
        () =>
            // new SweepObjectState(
            //     new SweepLineState([
            //         new BezierSegmentState(new Vec3(0, 0, 0), new Vec3(1, 1, 0)),
            //     ]),
            //     [
            //         new CrossSectionState([
            //             new StraightSegmentState(new Vec2(0, 0), new Vec2(0, 1)),
            //             new StraightSegmentState(new Vec2(0, 1), new Vec2(1, 0.5)),
            //             new StraightSegmentState(new Vec2(0.5, 1), new Vec2(0, 0)),
            //         ]),
            //     ]
            // )
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
                        new BezierSegmentState(new Vec2(0, 0), new Vec2(0, 6)),
                        new StraightSegmentState(new Vec2(0, 6), new Vec2(6, 3)),
                        new StraightSegmentState(new Vec2(6, 3), new Vec2(0, 0)),
                    ]),
                ]
            )
    );

    const sweepObject = sweepObjectState.current;
    return (
        <div
            css={{
                background: "#C3E0E5",
                minHeight: "100vh",
            }}>
            <div
                className="input-menu-holder"
                css={{
                    width: "100%",
                    margin: "0px 0px 25px",
                    background: "#145DA0",
                    color: "#FFF",
                }}>
                <InputMenu sweepObjectState={sweepObject} />
            </div>
            <div
                css={{
                    display: "flex",
                    justifyContent: "space-around",
                    margin: "auto auto",
                    userSelect: "none"
                }}>
                <Canvas
                    css={{
                        minHeight: 450,
                        maxWidth: 700,
                        margin: "auto auto",
                        flex: 1,
                    }}
                    sweepObjectState={sweepObject}
                />
                <CrossSectionCanvas
                    css={{
                        height: 450,
                        maxWidth: 700,
                        margin: "auto auto",
                        flex: 1,
                        backgroundColor: "white",
                    }}
                    sweepObjectState={sweepObject}
                />
            </div>
        </div>
    );
};

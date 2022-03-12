import {useDataHook} from "model-react";
import {FC, useMemo} from "react";
import {BezierSegmentState} from "../state/BezierSegmentState";
import {CrossSectionState} from "../state/CrossSectionState";
import {StraightSegmentState} from "../state/StraightSegmentState";
import {SweepLineState} from "../state/SweepLineState";
import {SweepObjectState} from "../state/SweepObjectState";
import {createSweepObject} from "../sweepObject/createSweepObject";
import {IMesh} from "../sweepObject/_types/IMesh";
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
            new SweepObjectState(
                new SweepLineState([
                    new BezierSegmentState(new Vec3(0, 0, 0), new Vec3(8, 8, 0)),
                ]),
                [
                    new CrossSectionState([
                        new StraightSegmentState(new Vec2(0, 0), new Vec2(0, 10)),
                        new StraightSegmentState(new Vec2(0, 10), new Vec2(10, 5)),
                        new StraightSegmentState(new Vec2(10, 5), new Vec2(0, 0)),
                    ]),
                ]
            )
    );

    const mesh = useMemo<IMesh>(() => {
        // return {
        //     faces: [
        //         [1, 0, 2],
        //         [0, 1, 3],
        //         [2, 0, 3],
        //         [1, 2, 3],
        //     ],
        //     points: [
        //         new Vec3(-1, 0, 0),
        //         new Vec3(1, 0, 0),
        //         new Vec3(0, 1, 0),
        //         new Vec3(0, 0, 1),
        //     ],
        // };
        return createSweepObject({
            sampleCount: 10,
            sweepLine: [
                {
                    start: new Vec3(0, 0, 0),
                    startControl: new Vec3(0, 2, 0),
                    endControl: new Vec3(2, 4, 0),
                    end: new Vec3(4, 4, 0),
                },
                {
                    start: new Vec3(4, 4, 0),
                    startControl: new Vec3(6, 4, 0),
                    endControl: new Vec3(8, 4, 2),
                    end: new Vec3(8, 8, 4),
                },
            ],
            // crossSection: [
            //     new Vec2(0, -0.3),
            //     new Vec2(0.6, -0.8),
            //     new Vec2(0.3, -0.1),
            //     new Vec2(1, 0.4),
            //     new Vec2(0.2, 0.3),
            //     new Vec2(0, 1),
            //     new Vec2(-0.2, 0.3),
            //     new Vec2(-1, 0.4),
            //     new Vec2(-0.3, -0.1),
            //     new Vec2(-0.6, -0.8),
            // ],
            // sweepLine: [
            //     {
            //         start: new Vec3(0, 0, 0),
            //         startControl: new Vec3(0, 0, 2),
            //         endControl: new Vec3(2, 0, 4),
            //         end: new Vec3(4, 3, 4),
            //     },
            // ],
            crossSection: [
                new Vec2(-1, -2),
                new Vec2(1, -2),
                new Vec2(1, 2),
                new Vec2(-1, 2),
            ],
        });
    }, []);

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

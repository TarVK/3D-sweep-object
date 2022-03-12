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
import {CrossSectionEditor} from "./crossSection/CrossSectionEditor";
import {useRefLazy} from "./hooks/useRefLazy";

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
                    new BezierSegmentState(new Vec3(0, 0, 0), new Vec3(0, 2, 0), new Vec3(2, 4, 0), new Vec3(4, 4, 0)),
                    new BezierSegmentState(new Vec3(4, 4, 0), new Vec3(6, 4, 0), new Vec3(8, 4, 2), new Vec3(8, 8, 4)),
                ]),
                [
                    new CrossSectionState([
                        new StraightSegmentState(new Vec2(-1, -2), new Vec2(1, -2)),
                        new StraightSegmentState(new Vec2(1, -2), new Vec2(1, 2)),
                        new StraightSegmentState(new Vec2(1, 2), new Vec2(-1, 2)),
                        new StraightSegmentState(new Vec2(-1, 2), new Vec2(-1, -2))
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

    return (
        <>
            <Canvas
                css={{
                    height: 400,
                    width: 700,
                }}
                sweepObjectMesh={mesh}
            />
            <CrossSectionEditor
                sweepObjectState={sweepObjectState.current}
                width={500}
                height={500}
            />
        </>
    );
};

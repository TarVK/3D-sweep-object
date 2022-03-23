import {useDataHook} from "model-react";
import {FC, useMemo} from "react";
import {BezierSegmentState} from "../state/BezierSegmentState";
import {CrossSectionState} from "../state/CrossSectionState";
import {StraightSegmentState} from "../state/StraightSegmentState";
import {SweepLineState} from "../state/SweepLineState";
import {SweepObjectState} from "../state/SweepObjectState";
import {Vec2} from "../util/Vec2";
import {Vec3} from "../util/Vec3";
import {Canvas} from "./editors/3D/Canvas";
import {useRefLazy} from "./hooks/useRefLazy";
import {CrossSectionCanvas} from "./editors/CrossSectionCanvas";
import {InputMenu} from "./header/InputMenu";
import {useStateLazy} from "./hooks/useStateLazy";

export const App: FC = () => {
    const [h] = useDataHook();
    const [sweepObjectState, setSweepObjectState] = useStateLazy(() => {
        const crossSection1 = new CrossSectionState([
            new StraightSegmentState(new Vec2(-3, 0), new Vec2(3, -3)),
            new BezierSegmentState(new Vec2(3, -3), new Vec2(3, 3)),
            new StraightSegmentState(new Vec2(3, 3), new Vec2(-3, 0)),
        ]);
        // const crossSection2 = new CrossSectionState([
        //     new StraightSegmentState(new Vec2(-3, 3), new Vec2(3, 3)),
        //     new StraightSegmentState(new Vec2(3, 3), new Vec2(3, -3)),
        //     new StraightSegmentState(new Vec2(3, -3), new Vec2(-3, -3)),
        //     new StraightSegmentState(new Vec2(-3, -3), new Vec2(-3, 3)),
        // ]);
        // crossSection2.setPosition(1);

        const crossSection2 = new CrossSectionState([
            new StraightSegmentState(new Vec2(-3, 0), new Vec2(3, -3)),
            new BezierSegmentState(new Vec2(3, -3), new Vec2(3, 3)),
            new StraightSegmentState(new Vec2(3, 3), new Vec2(-3, 0)),
        ]);
        crossSection2.setRotation(2 * Math.PI);
        crossSection2.setPosition(1);

        return new SweepObjectState(
            new SweepLineState([
                new BezierSegmentState(
                    new Vec3(0, 0, 0),
                    new Vec3(0, 20, 0),
                    new Vec3(20, 0, 0),
                    new Vec3(20, 20, 0)
                ),
            ]),
            [crossSection1, crossSection2]
        );
    });

    const sweepObject = sweepObjectState;

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
                <InputMenu
                    sweepObjectState={sweepObject}
                    onSweepObjectChange={setSweepObjectState}
                />
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

import {useDataHook} from "model-react";
import {FC, useMemo} from "react";
import {AppState} from "../state/AppState";
import {createSweepObject} from "../sweepObject/createSweepObject";
import {IMesh} from "../sweepObject/_types/IMesh";
import {Vec2} from "../util/Vec2";
import {Vec3} from "../util/Vec3";
import {Canvas} from "./3D/Canvas";
import {CrossSectionCanvas} from "./3D/CrossSectionCanvas";
import {InputMenu} from "./InputMenu";

export const App: FC<{state: AppState}> = ({state}) => {
    const [h] = useDataHook();
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
            {/* <div css={{color: "purple", ":hover": {color: "red"}}}>
                {state.getText(h)}
            </div>
            <input
                type="text"
                value={state.getText(h)}
                onChange={event => state.setText(event.target.value)}
            /> */}
            <div
                className="input-menu-holder"
                css={{
                    width: "100%",
                    margin: "25px 0px",
                }}>
                <InputMenu />
            </div>
            <div css={{display: "flex", justifyContent: "space-around", margin: "auto auto"}}>
                <Canvas
                    css={{
                        minHeight: 450,
                        maxWidth: 700,
                        margin: "auto auto",
                        flex: 1,
                    }}
                    sweepObjectMesh={mesh}
                />
                <CrossSectionCanvas
                    css={{
                        minHeight: 450,
                        maxWidth: 700,
                        margin: "auto auto",
                        flex: 1,
                    }}
                    sweepObjectMesh={mesh}
                />
            </div>
        </>
    );
};

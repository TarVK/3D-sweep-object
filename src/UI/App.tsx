import {useDataHook} from "model-react";
import {FC, useMemo, useState} from "react";
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
import { FileType} from "./3D/ExportModel";
import {OBJExporter} from "../exporters/OBJExporter";
import {IMesh} from "../sweepObject/_types/IMesh";
import {SweepObject} from "./3D/SweepObject";
import { STLExporter } from "../exporters/STLExporter";
import { Scene } from "three";

export const App: FC = () => {
    const [h] = useDataHook();
    const [exportModelOpen, setExportModelOpen] = useState<boolean>(false);
    const [scene, setScene] = useState<Scene>();
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

    const convertIMeshToThreeMesh = (iMesh: IMesh) => {
        const sweepObj = new SweepObject();
        sweepObj.updateMesh(iMesh);
        return sweepObj.getMesh();
    };

    const sweepObject = sweepObjectState.current;

    const exportToFile = (fileType: FileType) => {
        if (!sweepObjectState.current)
            return;

        if (fileType === FileType.OBJ) {
            const mesh = convertIMeshToThreeMesh(sweepObjectState.current.getMesh()!);
            const exporter = new OBJExporter();
            const exportedString = exporter.parse(mesh);
            download(exportedString, "3DSweepObject.obj", "obj");
        } else if (fileType === FileType.STL) {
            const exporter = new STLExporter();
            const exportedString = exporter.parse((scene as any).current!, {});
            download(exportedString, "3DSweepObject.stl", "stl");
        }
    };

    const download = (data: string, filename: string, type: string) => {
        const file = new Blob([data], {type: type});

        const a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }

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
                    openExportModel={() => setExportModelOpen(true)}
                    open exportToFile={exportToFile}
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
                        maxWidth: "45%",
                        margin: "auto auto",
                        flex: 1,
                    }}
                    sweepObjectState={sweepObject}
                    updateScene={(sceneRef: Scene) => setScene(sceneRef)}
                />
                <CrossSectionCanvas
                    css={{
                        height: 450,
                        maxWidth: "45%",
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

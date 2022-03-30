import {useDataHook} from "model-react";
import {FC, useState} from "react";
import {BezierSegmentState} from "../state/segments/BezierSegmentState";
import {CrossSectionState} from "../state/CrossSectionState";
import {StraightSegmentState} from "../state/segments/StraightSegmentState";
import {SweepLineState} from "../state/SweepLineState";
import {SweepObjectState} from "../state/SweepObjectState";
import {Vec2} from "../util/Vec2";
import {Vec3} from "../util/Vec3";
import {Canvas} from "./editors/3D/Canvas";
import {useRefLazy} from "./hooks/useRefLazy";
import {CrossSectionCanvas} from "./editors/CrossSectionCanvas";
import {InputMenu} from "./header/InputMenu";
import {FileType} from "./editors/ExportModel";
import {OBJExporter} from "../exporters/OBJExporter";
import {IMesh} from "../sweepOperation/_types/IMesh";
import {SweepObject} from "./editors/3D/SweepObject";
import {STLExporter} from "../exporters/STLExporter";
import {Scene} from "three";
import {useStateLazy} from "./hooks/useStateLazy";
import {sweepObjectToJSON} from "../state/JSON/sweepObjectToJSON";
import {ArcSegmentState} from "../state/segments/ArcSegmentState";
import {theme} from "../themes/MUITheme";
import {ThemeProvider} from "@mui/system";

export const App: FC = () => {
    const [h] = useDataHook();
    const [exportModelOpen, setExportModelOpen] = useState<boolean>(false);
    const [sweepObjectState, setSweepObjectState] = useStateLazy(() => {
        const crossSection1 = new CrossSectionState([
            new StraightSegmentState(new Vec2(-3, 0), new Vec2(3, -3)),
            new BezierSegmentState(new Vec2(3, -3), new Vec2(3, 3)),
            new ArcSegmentState(new Vec2(3, 3), new Vec2(0, 0), new Vec2(-3, 0)),
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
            new ArcSegmentState(new Vec2(3, 3), new Vec2(0, 3), new Vec2(-3, 0)),
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
    const [scene, setScene] = useState<Scene>();
    const [imports, setImports] = useState<boolean>(false);

    const setSweepObj = (object: SweepObjectState) => {
        setImports(true);
        sweepObjectState.setCrossSections(object.getCrossSections());
        sweepObjectState.getSweepLine().setSegments(object.getSweepLine().getSegments());
        sweepObjectState.setCrossSectionInterpolationPointCount(
            object.getCrossSectionInterpolationPointCount()
        );
        sweepObjectState.setSweepLineInterpolationPointCount(
            object.getSweepLineInterpolationPointCount()
        );
        setImports(false);
    };

    const convertIMeshToThreeMesh = (iMesh: IMesh) => {
        const sweepObj = new SweepObject();
        sweepObj.updateMesh(iMesh);
        return sweepObj.getMesh();
    };

    // const sweepObject = sweepObjectState;

    const exportToFile = (fileType: FileType) => {
        if (!sweepObjectState) return;

        if (fileType === FileType.OBJ) {
            const mesh = convertIMeshToThreeMesh(sweepObjectState.getMesh()!);
            const exporter = new OBJExporter();
            const exportedString = exporter.parse(mesh);
            download(exportedString, "3DSweepObject.obj", "obj");
        } else if (fileType === FileType.STL) {
            const exporter = new STLExporter();
            const exportedString = exporter.parse((scene as any).current!, {});
            download(exportedString, "3DSweepObject.stl", "stl");
        } else if (fileType === FileType.JSON) {
            const json = sweepObjectToJSON(sweepObjectState);
            const jsonSting = JSON.stringify(json, null, 4);
            download(jsonSting, "3DSweepObject.json", "json");
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
    };

    return (
        <ThemeProvider theme={theme}>
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
                        background: theme.palette.primaryColor,
                        color: "#FFF",
                    }}>
                    <InputMenu
                        sweepObjectState={sweepObjectState}
                        onSweepObjectChange={setSweepObj}
                        openExportModel={() => setExportModelOpen(true)}
                        open
                        exportToFile={exportToFile}
                    />
                </div>
                <div
                    css={{
                        display: "flex",
                        justifyContent: "space-around",
                        margin: "auto auto",
                        userSelect: "none",
                    }}>
                    <Canvas
                        css={{
                            minHeight: 450,
                            maxWidth: "45%",
                            margin: "auto auto",
                            flex: 1,
                        }}
                        sweepObjectState={sweepObjectState}
                        updateScene={(sceneRef: Scene) => setScene(sceneRef)}
                        imports={imports}
                    />
                    <CrossSectionCanvas
                        css={{
                            height: 450,
                            maxWidth: "45%",
                            margin: "auto auto",
                            flex: 1,
                            backgroundColor: "white",
                        }}
                        sweepObjectState={sweepObjectState}
                    />
                </div>
            </div>
        </ThemeProvider>
    );
};

import {useDataHook} from "model-react";
import {FC, MutableRefObject, useState} from "react";
import {BezierSegmentState} from "../state/segments/BezierSegmentState";
import {CrossSectionState} from "../state/CrossSectionState";
import {StraightSegmentState} from "../state/segments/StraightSegmentState";
import {SweepLineState} from "../state/SweepLineState";
import {SweepObjectState} from "../state/SweepObjectState";
import {Vec2} from "../util/linearAlgebra/Vec2";
import {Vec3} from "../util/linearAlgebra/Vec3";
import {Canvas} from "./editors/3D/Canvas";
import {CrossSectionCanvas} from "./editors/crossSections/CrossSectionCanvas";
import {InputMenu} from "./header/InputMenu";
import {FileType} from "./editors/ExportModel";
import {OBJExporter} from "../exporters/OBJExporter";
import {IMesh} from "../sweepOperation/_types/IMesh";
import {SweepObject} from "./editors/3D/SweepObject";
import {STLExporter} from "../exporters/STLExporter";
import {useStateLazy} from "./hooks/useStateLazy";
import {sweepObjectToJSON} from "../state/JSON/sweepObjectToJSON";
import {theme} from "../themes/MUITheme";
import {ThemeProvider} from "@mui/system";
import {Renderer} from "./editors/3D/Renderer";
import {download} from "../util/download";
import {Scene} from "./editors/3D/Scene";

export const App: FC = () => {
    const [sweepObjectState, setSweepObjectState] = useStateLazy(() => {
        const size = 10;
        const points = [
            new Vec2(-1, -1),
            new Vec2(1, -1),
            new Vec2(1, 1),
            new Vec2(-1, 1),
        ];
        const segments = points.map((point, i) => {
            const nextPoint = points[(i + 1) % points.length];
            return new StraightSegmentState(point.mul(size / 2), nextPoint.mul(size / 2));
        });
        const crossSection = new CrossSectionState(segments);

        const sweepLine = new SweepLineState([
            new BezierSegmentState(
                new Vec3(0, 0, 0).mul(size),
                new Vec3(0, 1, 0).mul(size),
                new Vec3(0, 2, 0).mul(size),
                new Vec3(0, 3, 0).mul(size)
            ),
        ]);

        return new SweepObjectState(sweepLine, [crossSection]);
    });
    const [scene, setScene] = useState<MutableRefObject<Scene>>();
    const [renderer, setRenderer] = useState<Renderer>();

    const convertIMeshToThreeMesh = (iMesh: IMesh) => {
        const sweepObj = new SweepObject();
        sweepObj.updateMesh(iMesh);
        return sweepObj.getMesh();
    };

    const sweepObject = sweepObjectState;

    const exportToFile = (fileType: FileType) => {
        if (fileType === FileType.OBJ) {
            const mesh = convertIMeshToThreeMesh(sweepObjectState.getMesh()!);
            const exporter = new OBJExporter();
            const exportedString = exporter.parse(mesh);
            download(exportedString, "3DSweepObject.obj", "obj");
        } else if (fileType === FileType.STL) {
            const exporter = new STLExporter();
            const mesh = scene?.current.sweepObject;
            if (!mesh) return;
            const exportedString = exporter.parse(mesh, {});
            download(exportedString, "3DSweepObject.stl", "stl");
        } else if (fileType === FileType.JSON) {
            const json = sweepObjectToJSON(sweepObjectState);
            const jsonSting = JSON.stringify(json, null, 4);
            download(jsonSting, "3DSweepObject.json", "json");
        } else if (fileType === FileType.PNG) {
            let a = document.createElement("a");
            a.href =
                renderer
                    ?.getRendererDomElem()
                    .toDataURL()
                    .replace("image/png", "image/octet-stream") || "";
            a.download = "canvas.png";
            a.click();
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <div
                css={{
                    background: "#C3E0E5",
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                }}>
                <div
                    className="input-menu-holder"
                    css={{
                        width: "100%",
                        background: theme.palette.primaryColor,
                        color: "#FFF",
                    }}>
                    <InputMenu
                        sweepObjectState={sweepObject}
                        onSweepObjectChange={setSweepObjectState}
                        exportToFile={exportToFile}
                    />
                </div>
                <div
                    css={{
                        flexGrow: 1,
                        gap: 20,
                        padding: 20,
                        minHeight: 0,
                        display: "flex",
                        justifyContent: "space-evenly",
                        userSelect: "none",
                    }}>
                    <Canvas
                        css={{
                            height: "100%",
                            flex: 1,
                        }}
                        sweepObjectState={sweepObject}
                        updateScene={setScene}
                        updateRenderer={setRenderer}
                    />
                    <CrossSectionCanvas
                        css={{
                            height: "100%",
                            flex: 1,
                            backgroundColor: "white",
                        }}
                        sweepObjectState={sweepObject}
                    />
                </div>
            </div>
        </ThemeProvider>
    );
};

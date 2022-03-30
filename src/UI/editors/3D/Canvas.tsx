import {FC, useEffect, useRef, useState} from "react";
import {ICanvasProps} from "./_types/ICanvasProps";
import {Scene} from "./Scene";
import {Renderer} from "./Renderer";
import {useRefLazy} from "../../hooks/useRefLazy";
import {ViewCube} from "./ViewCube/ViewCube";
import {SelectedPoint} from "../SelectedPoint";
import {
    AddCircleOutlineSharp,
    CameraAltOutlined,
    ClearOutlined,
    MouseOutlined,
    RestartAltOutlined,
    ZoomOutMapOutlined,
} from "@mui/icons-material";
import {Menu} from "../Menu";
import {useDataHook} from "model-react";
import {OrbitTransformControls} from "./controllers/OrbitTransformControls";
import editSweepPoints from "./EditSweepPoints";
import {Object3D} from "three";

export const Canvas: FC<ICanvasProps> = ({
    sweepObjectState,
    updateScene,
    imports,
    ...props
}) => {
    const [h] = useDataHook();
    const sweepObjectRef = useRef(sweepObjectState);
    sweepObjectRef.current = sweepObjectState; // Keep a reference to the latest state

    const rendererRef = useRef<Renderer | undefined>();
    const controlsRef = useRef<OrbitTransformControls | undefined>();
    const sceneRef = useRefLazy<Scene>(() => new Scene());
    const elementRef = useRef<HTMLDivElement>(null);

    const viewCubeRef = useRef<ViewCube | undefined>();
    const cubeRef = useRef<HTMLDivElement>(null);
    const cubeSize = 100; //px
    const scene = sceneRef.current;
    const [selectedObj, setSelectedObj] = useState<Object3D>();

    // TODO: place this somewhere
    function toggleMeshDisplaying() {
        scene.sweepObject.visible = !scene.sweepObject.visible;
    }

    useEffect(() => {
        updateScene!(sceneRef);
    }, [sceneRef]);

    useEffect(() => {
        setSelectedObj(controlsRef.current?.currObj);
    }, [controlsRef.current?.currObj]);

    const pointMenuItems = [
        {
            icon: AddCircleOutlineSharp,
            hoverText: "Add point",
            onClick: () => {
                controlsRef.current!.setMode("add");
                scene.sweepPoints.visible = true;
                scene.sweepLine.visible = true;
            },
        },
        {
            icon: MouseOutlined,
            hoverText: "Select point",
            onClick: () => {
                controlsRef.current!.setMode("transform");
                scene.sweepPoints.visible = true;
                scene.sweepLine.visible = true;
            },
        },
        {
            icon: ClearOutlined,
            hoverText: "Delete point",
            onClick: () => {
                controlsRef.current!.setMode("delete");
                scene.sweepPoints.visible = true;
                scene.sweepLine.visible = true;
            },
        },
        {
            icon: ZoomOutMapOutlined,
            hoverText: "Change camera position",
            onClick: () => {
                controlsRef.current!.setMode("move");
                scene.sweepPoints.visible = true;
                scene.sweepLine.visible = true;
            },
        },
    ];

    const cameraMenuItems = [
        {
            icon: RestartAltOutlined,
            hoverText: "Reset camera",
            onClick: () => {
                controlsRef.current!.resetCamera();
            },
        },
        {
            icon: CameraAltOutlined,
            hoverText: "Camera mode",
            onClick: () => {
                rendererRef.current!.toggleCamera();
            },
        },
    ];

    useEffect(() => {
        const cubeEl = cubeRef.current;
        const el = elementRef.current;
        if (el && cubeEl) {
            const viewCube = (viewCubeRef.current = new ViewCube(cubeEl));
            const renderer = (rendererRef.current = new Renderer(el, scene));
            const controls = (controlsRef.current = new OrbitTransformControls(
                scene,
                scene.sweepPoints.points,
                renderer.getCamera(),
                renderer.getRendererDomElem()
            ));
            renderer.attachControls(controls);
            controls.resetCamera();

            viewCube.onOrbiting(() => {
                controls.setRotation(
                    viewCube.getAzimuthAngle(),
                    viewCube.getPolarAngle()
                );
            });
            controls.onOrbiting(() => {
                viewCube.setRotation(
                    controls.getAzimuthAngle(),
                    controls.getPolarAngle()
                );
            });
            viewCube.setRotation(controls.getAzimuthAngle(), controls.getPolarAngle());

            const {
                getSweeplineAsBezierSegments: getBezierSegments,
                addPointToSweepline: addPoint,
                deletePointFromSweepline: deletePoint,
            } = editSweepPoints(scene.sweepPoints);
            controls.onTransform(() => {
                const segments = getBezierSegments();
                sweepObjectState.getSweepLine().setSegments(segments, true);
                scene.sweepPoints.updatePoints(segments);
            });
            controls.onAdd(pointVec => {
                const segments = addPoint(pointVec);
                sweepObjectState.getSweepLine().setSegments(segments, true);
                scene.sweepPoints.updatePoints(segments, true);
            });
            controls.onDelete(pointObj => {
                const segments = deletePoint(pointObj);
                sweepObjectState.getSweepLine().setSegments(segments, true);
                scene.sweepPoints.updatePoints(segments, true);
            });

            return () => renderer.destroy();
        }
    }, []);

    // TO-DO figure out how to do with transformEvents
    const triggerUpdate = () => {
        const {getSweeplineAsBezierSegments: getBezierSegments} = editSweepPoints(
            scene.sweepPoints
        );
        const segments = getBezierSegments();
        sweepObjectState.getSweepLine().setSegments(segments, true);
        scene.sweepPoints.updatePoints(segments);
    };

    const sweepObjectMesh = sweepObjectState.getMesh(h);

    useEffect(() => {
        if (sweepObjectMesh) {
            scene.sweepObject.updateMesh(sweepObjectMesh);
            const sweepLine = sweepObjectState.getSweepLine().getSegments(h);
            scene.sweepLine.updateLine(sweepLine);
            if (imports) {
                scene.sweepPoints.updatePoints(sweepLine, true);
            } else {
                scene.sweepPoints.updatePoints(sweepLine);
            }

            // update controls, so that sweep line points are editable
            controlsRef.current!.changeObjects(scene.sweepPoints.points);
        }
    }, [sweepObjectMesh]);

    useEffect(() => {
        const sweepLine = sweepObjectState.getSweepLine().getSegments(h);
        if (imports) {
            scene.sweepPoints.updatePoints(sweepLine, true);
        } else {
            scene.sweepPoints.updatePoints(sweepLine);
        }
    }, [imports]);

    // this div decides the size of the canvas
    return (
        <div
            ref={elementRef}
            {...props}
            css={{
                position: "relative",
                borderRadius: "4px",
                overflow: "hidden",
            }}>
            <Menu items={pointMenuItems} position={{top: 0, left: 0}} />
            <Menu items={cameraMenuItems} position={{top: 0, right: 0}} />
            {selectedObj ? (
                <SelectedPoint triggerUpdate={triggerUpdate} point={selectedObj} />
            ) : null}
            <div
                ref={cubeRef}
                {...props}
                css={{
                    width: cubeSize + "px !important",
                    maxWidth: cubeSize + "px !important",
                    minWidth: cubeSize + "px !important",
                    height: cubeSize + "px !important",
                    maxHeight: cubeSize + "px !important",
                    minHeight: cubeSize + "px !important",
                    position: "absolute",
                    top: 50,
                    right: 20,
                }}
            />
        </div>
    );
};

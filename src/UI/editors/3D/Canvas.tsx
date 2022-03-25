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

export const Canvas: FC<ICanvasProps> = ({sweepObjectState, ...props}) => {
    const [h] = useDataHook();
    const rendererRef = useRef<Renderer | undefined>();
    const controlsRef = useRef<OrbitTransformControls | undefined>();
    const sceneRef = useRefLazy<Scene>(() => new Scene());
    const elementRef = useRef<HTMLDivElement>(null);

    const viewCubeRef = useRef<ViewCube | undefined>();
    const cubeRef = useRef<HTMLDivElement>(null);
    const cubeSize = 100; //px

    const [selectedPoint] = useState({x: 100, y: 211, z: 5});
    const scene = sceneRef.current;

    function toggleMeshDisplaying() {
        scene.sweepObject.visible = !scene.sweepObject.visible;
    }

    const pointMenuItems = [
        {
            icon: AddCircleOutlineSharp,
            hoverText: "Add point",
            iconOnClick: () => {
                controlsRef.current!.setMode("add");
                scene.sweepPoints.visible = true;
                scene.sweepLine.visible = true;
            },
        },
        {
            icon: MouseOutlined,
            hoverText: "Select point",
            iconOnClick: () => {
                controlsRef.current!.setMode("transform");
                scene.sweepPoints.visible = true;
                scene.sweepLine.visible = true;
            },
        },
        {
            icon: ClearOutlined,
            hoverText: "Delete point",
            iconOnClick: () => {
                controlsRef.current!.setMode("delete");
                scene.sweepPoints.visible = true;
                scene.sweepLine.visible = true;
            },
        },
        {
            icon: ZoomOutMapOutlined,
            hoverText: "Change camera position",
            // TODO: remove the toggling from here
            iconOnClick: () => {
                toggleMeshDisplaying();
            },
        },
    ];

    const cameraMenuItems = [
        {
            icon: RestartAltOutlined,
            hoverText: "Reset camera",
            iconOnClick: () => {
                rendererRef.current!.resetCameraPosition();
            },
        },
        {
            icon: CameraAltOutlined,
            hoverText: "Camera mode",
            iconOnClick: () => {
                rendererRef.current!.toggleCamera();
            },
        },
    ];

    useEffect(() => {
        const cubeEl = cubeRef.current;
        const el = elementRef.current;
        if (el && cubeEl) {
            viewCubeRef.current = new ViewCube(cubeEl);
            viewCubeRef.current.attachRenderer(rendererRef);

            const renderer = (rendererRef.current = new Renderer(el, scene));
            renderer.attachViewCube(viewCubeRef);
            const controls = (controlsRef.current = new OrbitTransformControls(
                scene,
                scene.sweepPoints.points,
                renderer.getCamera(),
                renderer.getRendererDomElem()
            ));
            renderer.attachControls(controls);
            controls.orbitControls.addEventListener("change", () => {
                viewCubeRef.current!.setRotation(renderer.getRotation());
            });
            viewCubeRef.current!.setRotation(renderer.getRotation());

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
                // prettier-ignore
                const segments = deletePoint(pointObj);
                sweepObjectState.getSweepLine().setSegments(segments, true);
                scene.sweepPoints.updatePoints(segments, true);
            });

            return () => renderer.destroy();
        }
    }, []);

    const sweepObjectMesh = sweepObjectState.getMesh(h);

    useEffect(() => {
        if (sweepObjectMesh) {
            scene.sweepObject.updateMesh(sweepObjectMesh);
            const sweepLine = sweepObjectState.getSweepLine().getSegments(h);
            scene.sweepLine.updateLine(sweepLine);
            scene.sweepPoints.updatePoints(sweepLine);

            // update controls, so that sweep line points are editable
            controlsRef.current!.changeObjects(scene.sweepPoints.points);
        }
    }, [sweepObjectMesh]);

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
            <Menu props={{items: pointMenuItems, position: {top: 0, left: 0}}} />
            <Menu props={{items: cameraMenuItems, position: {top: 0, right: 0}}} />
            {selectedPoint ? <SelectedPoint props={selectedPoint} /> : null}
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

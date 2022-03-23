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

export const Canvas: FC<ICanvasProps> = ({sweepObjectState, ...props}) => {
    const [h] = useDataHook();
    const rendererRef = useRef<Renderer | undefined>();
    const sceneRef = useRefLazy<Scene>(() => new Scene());
    const elementRef = useRef<HTMLDivElement>(null);

    const viewCubeRef = useRef<ViewCube | undefined>();
    const cubeRef = useRef<HTMLDivElement>(null);
    const cubeSize = 100; //px
    
    const [selectedPoint] = useState({x: 100, y: 211, z: 5});
    const scene = sceneRef.current;

    function toggleMeshDisplaying(){
        scene.sweepObject.visible = !scene.sweepObject.visible;
    }


    const pointMenuItems = [
        {
            icon: AddCircleOutlineSharp,
            hoverText: "Add point",
            iconOnClick: () => {
                rendererRef.current!.controls.setMode("add");
                scene.sweepPoints.visible = true;
                scene.sweepLine.visible = true;
            },
        },
        {
            icon: MouseOutlined,
            hoverText: "Select point",
            iconOnClick: () => {
                rendererRef.current!.controls.setMode("transform");
                scene.sweepPoints.visible = true;
                scene.sweepLine.visible = true;
            },
        },
        {
            icon: ClearOutlined,
            hoverText: "Delete point",
            iconOnClick: () => {
                rendererRef.current!.controls.setMode("delete");
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
            iconOnClick: () => {rendererRef.current!.resetCameraPosition()},
        },
        {
            icon: CameraAltOutlined,
            hoverText: "Camera mode",
            iconOnClick: () => {rendererRef.current!.toggleCamera()},
        },
    ];

    useEffect(() => {
        const cubeEl = cubeRef.current;
        if (cubeEl) {
            viewCubeRef.current = new ViewCube();
            viewCubeRef.current.initScene(cubeEl);
            viewCubeRef.current.attachRenderer(rendererRef);
        }

        const el = elementRef.current;
        if (el) {
            const renderer = (rendererRef.current = new Renderer(el, scene));
            rendererRef.current.attachViewCube(viewCubeRef);
            rendererRef.current.controls.onTransform(()=>{
                const segments = scene.sweepPoints.getPointsAsBezierSegments();
                sweepObjectState.getSweepLine().setSegments( segments, true );
            });
            rendererRef.current.controls.onAdd((point) => {
                const segments = scene.sweepPoints.edit.addPoint(point);
                sweepObjectState.getSweepLine().setSegments( segments, true );
            });
            rendererRef.current.controls.onDelete((point) => {
                const segments = scene.sweepPoints.edit.deletePoint(point);
                sweepObjectState.getSweepLine().setSegments( segments, true );
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
            rendererRef.current?.controls.changeObjects(
                scene.sweepPoints.points
            )
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

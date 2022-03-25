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
import {
    BufferGeometry,
    Float32BufferAttribute,
    Points,
    PointsMaterial,
    Vector3,
} from "three";
import {useDataHook} from "model-react";
import { Vec3 } from "../../../util/Vec3";

export const Canvas: FC<ICanvasProps> = ({sweepObjectState, updateScene, ...props}) => {
    const [h] = useDataHook();
    const sweepObjectRef = useRef(sweepObjectState);
    sweepObjectRef.current = sweepObjectState; // Keep a reference to the latest state

    const rendererRef = useRef<Renderer | undefined>();
    const sceneRef = useRefLazy<Scene>(() => new Scene());
    const elementRef = useRef<HTMLDivElement>(null);

    const viewCubeRef = useRef<ViewCube | undefined>();
    const cubeRef = useRef<HTMLDivElement>(null);
    const cubeSize = 100; //px

    const [selectedObj, setSelectedObj] = useState();

    function toggleMeshDisplaying() {
        const scene = sceneRef.current;
        scene.sweepPoints.visible = !scene.sweepPoints.visible;
        scene.sweepLine.visible = !scene.sweepLine.visible;
        scene.sweepObject.visible = !scene.sweepObject.visible;

        scene.sweepPoints.visible
            ? rendererRef.current?.controls.enableTransform()
            : rendererRef.current?.controls.disableTransform();
    }

    function updateSweepLine() {
        const sweepObject = sweepObjectRef.current;
        const segments = sceneRef.current.sweepPoints.getPointsAsBezierSegments();
        sweepObject.getSweepLine().setSegments(segments);
    }

    useEffect(() => {
        updateScene!(sceneRef);
    }, [sceneRef]);

    useEffect(() => {
        setSelectedObj(rendererRef.current?.controls.currObj as any);
    }, [rendererRef.current?.controls.currObj]);


    useEffect(() => {
        const cubeEl = cubeRef.current;
        if (cubeEl) {
            viewCubeRef.current = new ViewCube();
            viewCubeRef.current.initScene(cubeEl);
            viewCubeRef.current.attachRenderer(rendererRef);
        }

        const el = elementRef.current;
        if (el) {
            const renderer = (rendererRef.current = new Renderer(el, sceneRef.current));
            rendererRef.current.attachViewCube(viewCubeRef);
            rendererRef.current.controls.onTransform(updateSweepLine);
            return () => renderer.destroy();
        }
    }, []);

    const sweepObjectMesh = sweepObjectState.getMesh(h);

    useEffect(() => {
        const scene = sceneRef.current;
        const sweepLine = sweepObjectState.getSweepLine().getSegments(h);
        scene.sweepLine.updateLine(sweepLine, false);
        scene.sweepPoints.updatePoints(sweepLine, false);
    }, [sweepObjectState]);

    useEffect(() => {
        console.log("li")
        const scene = sceneRef.current;
        if (sweepObjectMesh) {
            scene.sweepObject.updateMesh(sweepObjectMesh);
            const sweepLine = sweepObjectState.getSweepLine().getSegments(h);
            scene.sweepLine.updateLine(sweepLine);
            scene.sweepPoints.updatePoints(sweepLine);

            // update controls, so that sweep line points are editable
            rendererRef.current?.controls.changeObjects(
                sceneRef.current.sweepPoints.points
            );
        }
    }, [sweepObjectMesh, rendererRef.current?.controls.currObj?.position]);

    const triggerUpdate = () => {
        rendererRef.current?.controls.transformEvents.forEach(cb => cb());
    }

    // Just to simulate a button click (testing purposes)
    function addPoint() {
        const dotGeometry = new BufferGeometry();
        dotGeometry.setAttribute(
            "position",
            new Float32BufferAttribute(new Vector3(2, 2, 2).toArray(), 3)
        );
        const dotMaterial = new PointsMaterial({size: 0.1});
        const dot = new Points(dotGeometry, dotMaterial);
        sceneRef.current.add(dot);
    }

    const pointMenuItems = [
        {
            icon: AddCircleOutlineSharp,
            hoverText: "Add point",
            iconOnClick: addPoint,
        },
        {
            icon: MouseOutlined,
            hoverText: "Select point",
            iconOnClick: () => {},
        },
        {
            icon: ClearOutlined,
            hoverText: "Delete point",
            iconOnClick: () => {},
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
            {selectedObj ? <SelectedPoint triggerUpdate={triggerUpdate} point={selectedObj} /> : null}
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

import {FC, useEffect, useRef, useState} from "react";
import {ICanvasProps} from "./_types/ICanvasProps";
import {Scene} from "./Scene";
import {Renderer} from "./Renderer";
import {useRefLazy} from "../hooks/useRefLazy";
import {SelectedPoint} from "./SelectedPoint";
import {
    AddCircleOutlineSharp,
    CameraAltOutlined,
    ClearOutlined,
    MouseOutlined,
    RestartAltOutlined,
    ViewInArOutlined,
    ZoomOutMapOutlined,
} from "@mui/icons-material";
import {Menu} from "./Menu";
import {
    BufferGeometry,
    Float32BufferAttribute,
    Points,
    PointsMaterial,
    Vector3,
} from "three";
import {useDataHook} from "model-react";

export const Canvas: FC<ICanvasProps> = ({sweepObjectState, ...props}) => {
    const [h] = useDataHook();
    const rendererRef = useRef<Renderer | undefined>();
    const sceneRef = useRefLazy<Scene>(() => new Scene());
    const elementRef = useRef<HTMLDivElement>(null);
    const [selectedPoint] = useState({x: 100, y: 211, z: 5});

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
            iconOnClick: () => {},
        },
    ];

    const cameraMenuItems = [
        {
            icon: RestartAltOutlined,
            hoverText: "Reset camera",
            iconOnClick: () => {},
        },
        {
            icon: CameraAltOutlined,
            hoverText: "Camera mode",
            iconOnClick: () => {},
        },
    ];

    const rotationMenuItems = [
        {
            icon: ViewInArOutlined,
            hoverText: "Rotate",
            iconOnClick: () => {},
        },
    ];

    useEffect(() => {
        const el = elementRef.current;
        if (el) {
            const renderer = (rendererRef.current = new Renderer(el, sceneRef.current));
            return () => renderer.destroy();
        }
    }, []);

    const sweepObjectMesh = sweepObjectState.getMesh(h);
    useEffect(() => {
        const scene = sceneRef.current;
        if (sweepObjectMesh) scene.sweepObject.updateMesh(sweepObjectMesh);
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
            <Menu
                props={{
                    items: rotationMenuItems,
                    position: {top: 50, right: 0, margin: "0px 10px 0px"},
                }}
            />
            {selectedPoint ? <SelectedPoint props={selectedPoint} /> : null}
        </div>
    );
};

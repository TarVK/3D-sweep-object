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

export const Canvas: FC<ICanvasProps> = ({sweepObjectMesh, ...props}) => {
    const rendererRef = useRef<Renderer | undefined>();
    const sceneRef = useRefLazy<Scene>(() => new Scene());
    const elementRef = useRef<HTMLDivElement>(null);
    const [selectedPoint] = useState({x: 100, y: 211, z: 5});

    const pointMenuItems = [
        {
            icon: AddCircleOutlineSharp,
            hoverText: "Add point",
            iconOnClick: () => {},
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

    useEffect(() => {
        const scene = sceneRef.current;
        scene.sweepObject.updateMesh(sweepObjectMesh);
    }, [sweepObjectMesh]);

    // this div decides the size of the canvas
    return (
        <div
            ref={elementRef}
            {...props}
            css={{
                position: "relative",
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

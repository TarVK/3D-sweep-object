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
    Grid4x4Outlined,
    MouseOutlined,
    RestartAltOutlined,
    SvgIconComponent,
    ViewInArOutlined,
    VisibilityOffOutlined,
    VisibilityOutlined,
    ZoomOutMapOutlined,
} from "@mui/icons-material";
import {Menu} from "../Menu";
import {useDataHook} from "model-react";
import {OrbitTransformControls, Modes} from "./controllers/OrbitTransformControls";
import editSweepPoints from "./EditSweepPoints";
import {Object3D} from "three";
import {usePrevious} from "../../hooks/usePrevious";

export const Canvas: FC<ICanvasProps> = ({
    sweepObjectState,
    updateScene,
    updateRenderer,
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

    const [selectedMode, setSelectedMode] = useState<Modes>("transform");

    const [skeletonVisibilityIcon, setSkeletonVisibilityIcon] =
        useState<SvgIconComponent>(VisibilityOffOutlined);
    const [skeletonVisibilityText, setSkeletonVisibilityText] =
        useState<string>("Hide object skeleton");
    const [skeletonIconDisabled, setSkeletonIconDisabled] = useState<boolean>(false);

    const [meshVisibilityText, setMeshVisibilityText] =
        useState<string>("Hide object mesh");
    const [meshIconDisabled, setMeshIconDisabled] = useState<boolean>(false);

    const [wireframeVisibilityText, setWireframeVisibilityText] = useState<string>(
        "Show object wireframe"
    );
    const [wireframeIconDisabled, setWireFrameIconDisabled] = useState<boolean>(true);

    useEffect(() => {
        updateScene?.(sceneRef);
    }, [sceneRef]);

    useEffect(() => {
        if (rendererRef) {
            updateRenderer!(rendererRef.current);
        }
    }, [rendererRef.current]);

    useEffect(() => {
        setSelectedObj(controlsRef.current?.currObj);
    }, [controlsRef.current?.currObj]);

    const pointMenuItems = [
        {
            icon: AddCircleOutlineSharp,
            hoverText: "Add point",
            isSelected: selectedMode === "add",
            onClick: () => {
                controlsRef.current!.setMode("add");
                scene.sweepPoints.visible = true;
                scene.sweepLine.visible = true;
                setSelectedMode(controlsRef.current!.getMode());
            },
        },
        {
            icon: MouseOutlined,
            hoverText: "Select point",
            isSelected: selectedMode === "transform",
            onClick: () => {
                controlsRef.current!.setMode("transform");
                scene.sweepPoints.visible = true;
                scene.sweepLine.visible = true;
                setSelectedMode(controlsRef.current!.getMode());
            },
        },
        {
            icon: ClearOutlined,
            hoverText: "Delete point",
            isSelected: selectedMode === "delete",
            onClick: () => {
                controlsRef.current!.setMode("delete");
                scene.sweepPoints.visible = true;
                scene.sweepLine.visible = true;
                setSelectedMode(controlsRef.current!.getMode());
            },
        },
        {
            icon: ZoomOutMapOutlined,
            hoverText: "Change camera position",
            isSelected: selectedMode === "move",
            onClick: () => {
                controlsRef.current!.setMode("move");
                scene.sweepPoints.visible = true;
                scene.sweepLine.visible = true;
                setSelectedMode(controlsRef.current!.getMode());
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

    const visibilityMenuItems = [
        {
            icon: skeletonVisibilityIcon,
            hoverText: skeletonVisibilityText,
            isDisabled: skeletonIconDisabled,
            onClick: () => handleSkeletonVisibilityOnClick(),
        },
        {
            icon: ViewInArOutlined,
            hoverText: meshVisibilityText,
            isDisabled: meshIconDisabled,
            onClick: () => handleMeshVisibilityOnClick(),
        },
        {
            icon: Grid4x4Outlined,
            hoverText: wireframeVisibilityText,
            isDisabled: wireframeIconDisabled,
            onClick: () => handleWireframeVisibilityOnClick(),
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
            const getSweepLine = () => sweepObjectRef.current.getSweepLine();
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
                movePointFromSweepline: movePoint,
            } = editSweepPoints(scene.sweepPoints);
            controls.onTransform(() => {
                if (controls.currObj) {
                    movePoint(getSweepLine().getSegments(), controls.currObj);
                }
            });
            controls.onAdd(pointVec => {
                const segments = addPoint(getSweepLine().getSegments(), pointVec);
                getSweepLine().setSegments(segments, true);
                scene.sweepPoints.updatePoints(segments, true);
            });
            controls.onDelete(pointObj => {
                const segments = deletePoint(pointObj);
                getSweepLine().setSegments(segments, true);
                scene.sweepPoints.updatePoints(segments, true);
            });

            setSelectedMode(controls.getMode());

            return () => renderer.destroy();
        }
    }, []);

    // TODO:  figure out how to do with transformEvents
    const triggerUpdate = () => {
        const {getSweeplineAsBezierSegments: getBezierSegments} = editSweepPoints(
            scene.sweepPoints
        );
        const segments = getBezierSegments();
        sweepObjectRef.current.getSweepLine().setSegments(segments, true);
        scene.sweepPoints.updatePoints(segments);
    };

    const handleSkeletonVisibilityOnClick = () => {
        if (skeletonIconDisabled === false) {
            setSkeletonVisibilityIcon(VisibilityOutlined);
            setSkeletonVisibilityText("Show object skeleton");
            setSkeletonIconDisabled(true);
            sceneRef.current.sweepLine.visible = false;
            sceneRef.current.sweepPoints.visible = false;
        } else {
            setSkeletonVisibilityIcon(VisibilityOffOutlined);
            setSkeletonVisibilityText("Hide object skeleton");
            setSkeletonIconDisabled(false);
            sceneRef.current.sweepLine.visible = true;
            sceneRef.current.sweepPoints.visible = true;
        }
    };

    const handleMeshVisibilityOnClick = () => {
        if (meshIconDisabled === false) {
            setMeshVisibilityText("Show object mesh");
            setMeshIconDisabled(true);
            sceneRef.current.sweepObject.visible = false;
        } else {
            setMeshVisibilityText("Hide object mesh");
            setMeshIconDisabled(false);
            sceneRef.current.sweepObject.visible = true;
        }
    };

    const handleWireframeVisibilityOnClick = () => {
        if (wireframeIconDisabled === false) {
            setWireframeVisibilityText("Show object wireframe");
            setWireFrameIconDisabled(true);
            scene.sweepObject.toggleWireframe();
        } else {
            setWireframeVisibilityText("Hide object wireframe");
            setWireFrameIconDisabled(false);
            scene.sweepObject.toggleWireframe();
        }
    };

    const sweepObjectMesh = sweepObjectState.getMesh(h);

    const prevObjectState = usePrevious(sweepObjectState);
    useEffect(() => {
        if (sweepObjectMesh) {
            const forceUpdate = prevObjectState != sweepObjectState;

            scene.sweepObject.updateMesh(sweepObjectMesh, forceUpdate);
            const sweepLine = sweepObjectRef.current.getSweepLine().getSegments(h);
            scene.sweepLine.updateLine(sweepLine);
            scene.sweepPoints.updatePoints(sweepLine, forceUpdate);

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
            <Menu items={pointMenuItems} position={{top: 0, left: 0}} />
            <Menu items={cameraMenuItems} position={{top: 0, right: 0}} />
            <Menu items={visibilityMenuItems} position={{bottom: 0, left: 0}} />

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

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
    ChangeHistory as TriangleIcon,
    ViewInArOutlined,
    VisibilityOffOutlined,
    VisibilityOutlined,
    ZoomOutMapOutlined,
} from "@mui/icons-material";
import {Menu} from "../Menu";
import {Observer, useDataHook} from "model-react";
import {OrbitTransformControls, Modes} from "./controllers/OrbitTransformControls";
import editSweepPoints from "./EditSweepPoints";
import {Object3D} from "three";
import {CrossSection} from "./CrossSection";
import {getSweepLineTransformationMatrices} from "./getSweeplineTransformationMatrices";
import {useCrossSectionEditorState} from "../crossSections/CrossSectionEditorStateContext";
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

    const [skeletonEnabled, setSkeletonEnabled] = useState(true);
    const [meshEnabled, setMeshEnabled] = useState(true);
    const [wireframeEnabled, setWireframeEnabled] = useState(false);
    const [smoothLightingEnabled, setSmoothLightingEnabled] = useState(true);
    const [plainMode, setPlainMode] = useState(false); // Used for taking report pictures

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
                setSelectedMode(controlsRef.current!.getMode());
                setSkeletonEnabled(true);
            },
        },
        {
            icon: MouseOutlined,
            hoverText: "Select point",
            isSelected: selectedMode === "transform",
            onClick: () => {
                controlsRef.current!.setMode("transform");
                setSelectedMode(controlsRef.current!.getMode());
                setSkeletonEnabled(true);
            },
        },
        {
            icon: ClearOutlined,
            hoverText: "Delete point",
            isSelected: selectedMode === "delete",
            onClick: () => {
                controlsRef.current!.setMode("delete");
                setSelectedMode(controlsRef.current!.getMode());
                setSkeletonEnabled(true);
            },
        },
        {
            icon: ZoomOutMapOutlined,
            hoverText: "Change camera position",
            isSelected: selectedMode === "move",
            onClick: () => {
                controlsRef.current!.setMode("move");
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
            icon: skeletonEnabled ? VisibilityOffOutlined : VisibilityOutlined,
            hoverText: skeletonEnabled ? "Hide object skeleton" : "Show object skeleton",
            isDisabled: !skeletonEnabled,
            onClick: () => setSkeletonEnabled(!skeletonEnabled),
        },
        {
            icon: ViewInArOutlined,
            hoverText: meshEnabled ? "Hide object mesh" : "Show object mesh",
            isDisabled: !meshEnabled,
            onClick: () => setMeshEnabled(!meshEnabled),
        },
        {
            icon: Grid4x4Outlined,
            hoverText: wireframeEnabled
                ? "Hide object wireframe"
                : "Show object wireframe",
            isDisabled: !wireframeEnabled,
            onClick: () => setWireframeEnabled(!wireframeEnabled),
        },
        {
            icon: TriangleIcon, // TODO: find better icon
            hoverText: smoothLightingEnabled
                ? "Disable smooth lighting"
                : "Enable smooth lighting",
            isDisabled: !smoothLightingEnabled,
            onClick: () => setSmoothLightingEnabled(!smoothLightingEnabled),
        },
    ];

    useEffect(() => {
        sceneRef.current.sweepLine.visible = skeletonEnabled;
        sceneRef.current.sweepPoints.visible = skeletonEnabled && !plainMode;
        sceneRef.current.crossSections.forEach(crossSection => {
            crossSection.visible = skeletonEnabled;
        });
    }, [skeletonEnabled, plainMode]);
    useEffect(() => {
        sceneRef.current.sweepObject.visible = meshEnabled;
    }, [meshEnabled]);
    useEffect(() => {
        scene.sweepObject.setWireframe(wireframeEnabled);
    }, [wireframeEnabled]);
    useEffect(() => {
        scene.sweepObject.setSmoothLighting(smoothLightingEnabled);
    }, [smoothLightingEnabled]);
    useEffect(() => {
        scene.setPlainMode(plainMode);
    }, [plainMode]);

    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key == "p") setPlainMode(plain => !plain);
            e.preventDefault();
        };
        window.addEventListener("keydown", listener);
        return () => window.removeEventListener("keydown", listener);
    }, []);

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
            controls.onSelect(setSelectedObj);

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

    // Synchronize sweep object/line
    const sweepObjectMesh = sweepObjectState.getMesh(h);

    const prevObjectState = usePrevious(sweepObjectState);
    useEffect(() => {
        if (sweepObjectMesh) {
            const sweepLineObserver = new Observer(h =>
                sweepObjectState.getSweepLine().getSegments(h)
            ).listen(sweepLine => {
                const forceUpdate = prevObjectState != sweepObjectState;

                scene.sweepObject.updateMesh(sweepObjectMesh);
                scene.sweepLine.updateLine(sweepLine, plainMode);
                scene.sweepPoints.updatePoints(sweepLine, forceUpdate);

                // update controls, so that sweep line points are editable
                controlsRef.current!.changeObjects(scene.sweepPoints.points);
            }, true);

            return () => sweepLineObserver.destroy();
        }
    }, [sweepObjectMesh, plainMode]);

    // Synchronize cross sections
    const crossSectionStates = sweepObjectState.getCrossSections(h);
    const crossSectionEditorState = useCrossSectionEditorState();
    useEffect(() => {
        const sweepLine = sweepObjectState.getSweepLine();

        const crossSections = crossSectionStates.map(
            crossSectionState => new CrossSection(crossSectionState)
        );
        sceneRef.current.setCrossSections(crossSections);
        crossSections.forEach(crossSection => {
            crossSection.visible = skeletonEnabled;
        });

        const crossSectionPositioner = new Observer(h => {
            const sweepPoints = sweepObjectState.getSweepLineInterpolationPointCount(h);
            const positions = crossSectionStates.map(crossSectionState => ({
                position: crossSectionState.getPosition(h),
                angle: crossSectionState.getRotation(h),
                scale: crossSectionState.getScale(h),
            }));
            const transformations = getSweepLineTransformationMatrices(
                sweepLine,
                positions,
                sweepPoints,
                h
            );
            return transformations;
        }).listen(transformations => {
            crossSections.forEach((crossSection, i) => {
                const transformation = transformations[i];
                if (transformation) crossSection.setTransformation(transformation);
            });
        }, true);

        const crossSectionSelector = new Observer(h =>
            crossSectionEditorState.getSelectCrossSectionIndex(h)
        ).listen((index, _, prevIndex) => {
            const prevCrossSection = crossSections[prevIndex];
            if (prevCrossSection) prevCrossSection.setSelected(false);
            const crossSection = crossSections[index];
            if (crossSection && !plainMode) crossSection.setSelected(true);
        }, true);

        return () => {
            crossSections.forEach(crossSection => crossSection.destroy());
            crossSectionPositioner.destroy();
            crossSectionSelector.destroy();
        };
    }, [sweepObjectState, crossSectionStates, plainMode]);

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

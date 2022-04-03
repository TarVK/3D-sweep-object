import {useDataHook} from "model-react";
import {FC, useCallback, useEffect, useRef, useState} from "react";
import {Vec2} from "../../../../util/linearAlgebra/Vec2";
import {useStateLazy} from "../../../hooks/useStateLazy";
import {useWindowSize} from "../../../hooks/useWindowSize";
import {useCrossSectionEditorState} from "../CrossSectionEditorStateContext";
import {XAxis, YAxis} from "./Axes";
import {Grid} from "./Grid";
import {ICrossSectionPlaneProps} from "./_types/ICrossSectionPlaneProps";

export const CrossSectionPlane: FC<ICrossSectionPlaneProps> = ({
    children,
    width = "100%",
    height = "100%",
    onMouseDown: onMouseDownHandler,
    onMouseUp: onMouseUpHandler,
    onMouseMove: onMouseMoveHandler,
    onKeyDown: onKeyDownHandler,
    onKeyUp: onKeyUpHandler,
    onMouseEnter,
    onMouseLeave,
}) => {
    const state = useCrossSectionEditorState();
    const [h] = useDataHook();
    const [size, setSize] = useStateLazy<Vec2>(() => new Vec2(0, 0));
    const containerRef = useRef<HTMLDivElement>();

    const getWorldPoint = useCallback((point: Vec2, el: HTMLDivElement) => {
        const {offset, scale} = state.getTransformation();
        const elBox = el.getBoundingClientRect();
        const screenspacePoint = new Vec2(
            point.x - elBox.x - elBox.width / 2,
            elBox.height - (point.y - elBox.y) - elBox.height / 2
        );
        return {
            point: screenspacePoint.sub(offset).mul(1 / scale),
            inPlane:
                elBox.x <= point.x &&
                elBox.y <= point.y &&
                elBox.x + elBox.width >= point.x &&
                elBox.y + elBox.height >= point.y,
        };
    }, []);
    const getEventData = useCallback((evt: React.MouseEvent<HTMLDivElement>) => {
        const {scale} = state.getTransformation();
        const delta = new Vec2(evt.movementX / scale, -evt.movementY / scale);
        const el = containerRef.current;
        if (!el)
            return {
                worldPoint: new Vec2(evt.clientX, evt.clientY),
                worldDelta: delta,
            };

        const {point: worldspacePoint} = getWorldPoint(
            new Vec2(evt.clientX, evt.clientY),
            el
        );

        return {
            worldPoint: worldspacePoint,
            worldDelta: delta,
        };
    }, []);

    const setContainer = useCallback((container: HTMLDivElement | null) => {
        if (container) {
            const rect = container.getBoundingClientRect();
            setSize(new Vec2(rect.width, rect.height));
            containerRef.current = container;

            // // Move the plane to focus on the top right quadrant
            // const {scale} = state.getTransformation();
            // state.setTransformation({
            //     offset: new Vec2((-rect.width / 2) * 0.8, (-rect.height / 2) * 0.8),
            //     scale: scale,
            // });
        }
    }, []);

    const windowSize = useWindowSize();
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const update = () => {
            const rect = container.getBoundingClientRect();
            setSize(new Vec2(rect.width, rect.height));
        };
        update();
        setTimeout(update); // Requires rerender first
    }, [windowSize]);

    const onMouseDrag = useCallback(
        (evt: React.MouseEvent<HTMLDivElement>) => {
            if (onMouseMoveHandler) {
                const {worldDelta, worldPoint} = getEventData(evt);
                const preventDefault = onMouseMoveHandler(evt, worldPoint, worldDelta);
                if (preventDefault) return;
            }
            if (evt.buttons == 2)
                state.translate(new Vec2(evt.movementX, -evt.movementY));
        },
        [onMouseMoveHandler]
    );
    const onContextMenu = useCallback((evt: React.MouseEvent<HTMLDivElement>) => {
        evt.preventDefault();
    }, []);
    const onMouseDown = useCallback(
        (evt: React.MouseEvent<HTMLDivElement>) => {
            if (onMouseDownHandler) {
                const {worldDelta, worldPoint} = getEventData(evt);
                onMouseDownHandler(evt, worldPoint, worldDelta);
            }
        },
        [onMouseDownHandler]
    );
    const onMouseUp = useCallback(
        (evt: React.MouseEvent<HTMLDivElement>) => {
            if (onMouseUpHandler) {
                const {worldDelta, worldPoint} = getEventData(evt);
                onMouseUpHandler(evt, worldPoint, worldDelta);
            }
        },
        [onMouseUpHandler]
    );

    const onWheel = useCallback((evt: React.WheelEvent<HTMLDivElement>) => {
        // TODO: also handle pinch events: https://stackoverflow.com/a/11183333/8521718
        const dir = evt.deltaY < 0 ? 1 : evt.deltaY > 0 ? -1 : 0;
        if (dir != 0) {
            const el = containerRef.current;
            if (!el) return;
            const elBox = el.getBoundingClientRect();

            const pos = new Vec2(
                evt.clientX - elBox.x - elBox.width / 2,
                elBox.height - (evt.clientY - elBox.y) - elBox.height / 2
            );

            const zoomSpeed = 1 - state.getConfig().zoomSpeed;
            const oldScale = state.getTransformation().scale;
            const newScale = dir > 0 ? oldScale / zoomSpeed : oldScale * zoomSpeed;

            state.scaleAt(newScale, pos);
        }
    }, []);

    useEffect(() => {
        const getMouseData = () => {
            if (!containerRef.current) return;
            const worldPoint = getWorldPoint(mousePosition, containerRef.current);
            if (!worldPoint.inPlane) return;
            return worldPoint.point;
        };
        const downHandler = (event: KeyboardEvent) => {
            const mousePoint = getMouseData();
            if (mousePoint) onKeyDownHandler?.(event, mousePoint);
        };
        const upHandler = (event: KeyboardEvent) => {
            const mousePoint = getMouseData();
            if (mousePoint) onKeyUpHandler?.(event, mousePoint);
        };

        let mousePosition = new Vec2(0, 0);
        const mouseHandler = (mouseMoveEvent: MouseEvent) => {
            mousePosition = new Vec2(mouseMoveEvent.pageX, mouseMoveEvent.pageY);
        };

        if (onKeyDownHandler || onKeyUpHandler)
            window.addEventListener("mousemove", mouseHandler);
        if (onKeyDownHandler) window.addEventListener("keydown", downHandler);
        if (onKeyUpHandler) window.addEventListener("keyup", upHandler);
        return () => {
            window.removeEventListener("mousemove", mouseHandler);
            window.removeEventListener("keydown", downHandler);
            window.removeEventListener("keyup", upHandler);
        };
    }, [onKeyDownHandler, onKeyUpHandler]);

    const {offset, scale} = state.getTransformation(h);
    const gridSize = state.getGridSize(h);
    const {showAxis, grid} = state.getConfig(h);
    return (
        <div
            className="plane"
            ref={setContainer}
            style={{
                width,
                height,
                overflow: "hidden",
                position: "relative",
            }}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseDrag}
            onWheel={onWheel}
            onContextMenu={onContextMenu}
            onMouseLeave={onMouseLeave}
            onMouseEnter={onMouseEnter}>
            {size.x != 0 && (
                <>
                    <Grid offset={offset} scale={scale} gridSize={gridSize} type={grid} />
                    {showAxis && (
                        <XAxis
                            containerSize={size}
                            offset={offset}
                            scale={scale}
                            spacing={gridSize}
                        />
                    )}
                    {showAxis && (
                        <YAxis
                            containerSize={size}
                            offset={offset}
                            scale={scale}
                            spacing={gridSize}
                        />
                    )}
                </>
            )}
            {children}
        </div>
    );
};

import {FC, useEffect, useRef} from "react";
import {ICanvasProps} from "./_types/ICanvasProps";
import {Scene} from "./Scene";
import {Renderer} from "./Renderer";
import {useRefLazy} from "../hooks/useRefLazy";

export const Canvas: FC<ICanvasProps> = ({sweepObjectMesh, ...props}) => {
    const rendererRef = useRef<Renderer | undefined>();
    const sceneRef = useRefLazy<Scene>(() => new Scene());
    const elementRef = useRef<HTMLDivElement>(null);

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
    return <div ref={elementRef} {...props} />;
};

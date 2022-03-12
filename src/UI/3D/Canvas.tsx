import {FC, useEffect, useRef} from "react";
import {ICanvasProps} from "./_types/ICanvasProps";
import {Scene} from "./Scene";
import {Renderer} from "./Renderer";
import {useRefLazy} from "../hooks/useRefLazy";
import { ViewCube } from "./ViewCube/ViewCube";

export const Canvas: FC<ICanvasProps> = ({sweepObjectMesh, ...props}) => {
    const rendererRef = useRef<Renderer | undefined>();
    const sceneRef = useRefLazy<Scene>(() => new Scene());
    const elementRef = useRef<HTMLDivElement>(null);
    
    const viewCubeRef = useRef<ViewCube | undefined>();
    const cubeRef = useRef<HTMLDivElement>(null);
    

    useEffect(() => {
        const cubeEl = cubeRef.current;
        if(cubeEl){
            viewCubeRef.current = new ViewCube();
            viewCubeRef.current?.initScene(cubeEl);
            viewCubeRef.current?.attachRenderer(rendererRef);
        }

        const el = elementRef.current;
        if (el) {
            const renderer = (rendererRef.current = new Renderer(el, sceneRef.current));
            rendererRef.current.attachViewCube(viewCubeRef);
            return () => renderer.destroy();
        }  
    }, []);


    useEffect(() => {
        const scene = sceneRef.current;
        scene.sweepObject.updateMesh(sweepObjectMesh);
    }, [sweepObjectMesh]);

    return <>
        <button onClick={()=>{rendererRef.current?.resetCameraPosition()}}>Reset Camera</button>
        <button onClick={()=>{rendererRef.current?.toggleCamera()}}>Toogle Camera</button>
        <button onClick={()=>{rendererRef.current?.toggleCamera()}}>Toogle Camera</button>
        <div css={{position: "relative"}}>
            <div ref={elementRef} {...props} />
            <div ref={cubeRef} {...props} css={{width: 100+"px !important", height: 100+"px !important", position: "absolute", top: 0, left: 0}} />
        </div>
    </>;
};

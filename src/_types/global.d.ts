declare module "*.jpg" {
    const data: string;
    export default data;
}

declare module "three-orbitcontrols" {
    import {Camera} from "three";
    class OrbitControls {
        constructor(camera: Camera, element: HTMLElement);
    }
    export default OrbitControls;
}

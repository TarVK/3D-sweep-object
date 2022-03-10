declare module "*.jpg" {
    const data: string;
    export default data;
}

declare module "three-orbitcontrols" {
    import * as THREE from "three";
    class OrbitControls {
        constructor(camera: THREE.Camera, element: HTMLElement);
        public dispose(): void;
    }
    export default OrbitControls;
}

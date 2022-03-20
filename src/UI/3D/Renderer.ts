import { MutableRefObject } from "react";
import * as THREE from "three";
import { OrbitDragControls, OrbitTransformControls } from "./controllers/OrbitDragControls";
import { ViewCube } from "./ViewCube/ViewCube";


export class Renderer {
    protected isOrthographic = false;

    protected scene: THREE.Scene;
    protected renderer: THREE.WebGLRenderer;
    
    protected camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
    public controls: OrbitTransformControls;

    protected width: number;
    protected height: number;

    protected container: HTMLElement;
    protected destroyed = false;


    protected viewCube: MutableRefObject<ViewCube | undefined>;
    /**
     * Creates a new scene in which the sweep object is rendered
     * @param target The target container to render the scene in
     * @param scene The scene to be rendered
     */
    public constructor(target: HTMLElement, scene: THREE.Scene) {
        this.width = target.offsetWidth;
        this.height = target.offsetHeight;
        this.container = target;
        this.scene = scene;
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.shadowMap.enabled = true;
        this.renderer.setSize(this.width, this.height);
        target.appendChild(this.renderer.domElement);

        this.setPerspectiveCamera();
        this.resetCameraPosition();

        this.animate();
        window.addEventListener("resize", this.updateSize);
    }
    
    public attachViewCube = (viewCube: MutableRefObject<ViewCube | undefined>) => {
        this.viewCube = viewCube;
        this.viewCube.current!.setRotation(this.getRotation());
    }

    private updateSize = () => {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.renderer.setSize(this.width, this.height);

        this.isOrthographic ? this.setOrthographicCamera() : this.setPerspectiveCamera();
    };

    /**
     * Calculates a more correct projection for the orthogonal camera
     * @see {@link https://stackoverflow.com/questions/48187416/how-to-switch-between-perspective-and-orthographic-cameras-keeping-size-of-desir | stackoverflow }
     * @returns {size_x: Number, size_y: Number}
     */
    private calculateOrthograhicProjection(){
        // TODO: look into how to make this better, this might help (Also could remove it cuz might be better )
        // TODO: fov, Z and the depth_s division is hardcoded, so fix it later
        // https://stackoverflow.com/questions/48758959/what-is-required-to-convert-threejs-perspective-camera-to-orthographic
        let fov_y   = 90;
        let depht_s = Math.tan(fov_y/2.0 * Math.PI/180.0) * 2.0;
        let Z      = 12;
        let aspect = this.width / this.height;
        let size_y = depht_s * Z;
        let size_x = depht_s * Z * aspect; 

        return {size_x, size_y};
    }

    private setPerspectiveCamera() {
        const camera = new THREE.PerspectiveCamera(
            90,
            this.width / this.height,
            0.1,
            10000
        );
        this.setNewCamera(camera);
    }

    private setOrthographicCamera() {
        const {size_x, size_y} = this.calculateOrthograhicProjection();
        const camera = new THREE.OrthographicCamera(
            -size_x/2,  size_x/2,
             size_y/2, -size_y/2,
             0.1, 10000 );
        this.setNewCamera(camera);
    }

    private setNewCamera(camera: THREE.PerspectiveCamera | THREE.OrthographicCamera){
        if(this.camera){
            camera.position.copy(this.camera.position);
            camera.rotation.copy(this.camera.rotation);
            camera.zoom = this.camera.zoom;
        }
        this.camera = camera;
        if(this.controls){
            this.controls.changeCamera(this.camera);
        }
    }

    private animate = () => {
        if (!this.destroyed) requestAnimationFrame(this.animate);
        this.renderer?.render(this.scene, this.camera);
    };

    private setOrbitControls = () => {
        if(this.controls) this.controls.dispose();
        this.controls = new OrbitTransformControls(this.scene, [], this.camera, this.renderer.domElement); 
        this.controls.orbitControls.addEventListener("change", ()=>{this.viewCube?.current!.setRotation(this.getRotation())});
    };

    public destroy() {
        this.destroyed = true;
        window.removeEventListener("resize", this.updateSize);
    }
    
    public resetCameraPosition(){
        this.camera.position.set(-10, 6, 12);
        this.camera.rotation.set(0,0,0);
        this.camera.zoom = 1;
        this.setOrbitControls();

        this.viewCube?.current?.setRotation(this.getRotation());
    }

    public setRotation(matrix: THREE.Matrix4){
        const fwd = new THREE.Vector3(0,0,-1);
        fwd.applyMatrix4(matrix).normalize();
        const dist = 30;
        const offset = fwd.multiplyScalar(dist);
        this.camera.position.copy(this.controls.getTarget()).sub(offset);
        this.controls.update();
    }

    public getRotation(){
        return new THREE.Matrix4().makeRotationFromEuler(this.camera.rotation);
    }
    
    public toggleCamera(){
        this.isOrthographic = !this.isOrthographic;
        if(this.isOrthographic){
            this.setOrthographicCamera();
        }else{
            this.setPerspectiveCamera();
        }
    }
}

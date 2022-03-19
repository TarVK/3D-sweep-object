import { MutableRefObject } from "react";
import * as THREE from "three";
import { OrbitDragControls, OrbitTransformControls } from "./controllers/OrbitDragControls";
import { ViewCube } from "./ViewCube/ViewCube";


export class Renderer {
    protected isOrthographic = false;

    protected scene: THREE.Scene;
    protected renderer: THREE.WebGLRenderer;

    
    // TODO: Make a camera controller class (maybe together with controlls)
    protected perCamera: THREE.PerspectiveCamera;
    protected orthCamera: THREE.OrthographicCamera;

    protected width: number;
    protected height: number;

    protected container: HTMLElement;
    protected destroyed = false;

    public perControls: OrbitTransformControls;
    public orthControls: OrbitTransformControls;

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

        this.setOrthographicCamera();
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

        this.perCamera.aspect = this.width / this.height;
        this.perCamera.updateProjectionMatrix();

        const {size_x, size_y} = this.calculateOrthograhicProjection();
        this.orthCamera.left = -size_x / 2;
        this.orthCamera.right = size_x / 2;
        this.orthCamera.top = -size_y / 2;
        this.orthCamera.bottom = size_y / 2;
        this.orthCamera.updateProjectionMatrix();
    };

    /**
     * Calculates a more correct projection for the orthogonal camera
     * @see {@link https://stackoverflow.com/questions/48187416/how-to-switch-between-perspective-and-orthographic-cameras-keeping-size-of-desir | stackoverflow }
     * @returns {size_x: Number, size_y: Number}
     */
    private calculateOrthograhicProjection(){
        //TODO: look into how to make this better, this might help (Also could remove it cuz might be better )
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
        this.isOrthographic = false;
        this.perCamera = new THREE.PerspectiveCamera(
            90,
            this.width / this.height,
            0.1,
            10000
        );
    }

    private setOrthographicCamera() {
        this.isOrthographic = true;
        const {size_x, size_y} = this.calculateOrthograhicProjection();

        this.orthCamera = new THREE.OrthographicCamera(
            -size_x/2,  size_x/2,
             size_y/2, -size_y/2,
             0.1, 10000 );
    }

    private animate = () => {
        if (!this.destroyed) requestAnimationFrame(this.animate);
        const camera = this.isOrthographic ? this.orthCamera : this.perCamera;
        this.renderer?.render(this.scene, camera);
    };

    private setOrbitControls = () => {
        if(this.orthControls) this.orthControls.dispose();
        if(this.perControls) this.perControls.dispose();
        
        // TODO: do not hardcode this children[3] but pass the points that can be edited instead
        this.orthControls = new OrbitTransformControls(this.scene, [], this.orthCamera, this.renderer.domElement);
        this.perControls = new OrbitTransformControls(this.scene, [], this.perCamera, this.renderer.domElement);
        // TODO: handle this more clearly
        this.isOrthographic ? this.perControls.disableTransform() : this.orthControls.disableTransform();

        // TODO: Do this with orthCamera as well 
        this.perControls.orbitControls.addEventListener("change", ()=>{this.viewCube?.current!.setRotation(this.getRotation())});
    };

    public destroy() {
        this.destroyed = true;
        window.removeEventListener("resize", this.updateSize);
    }
    
    public resetCameraPosition(){
        this.perCamera.position.set(-10, 6, 12);
        // TODO: remove it or something
        // a little offset of the position to make it look more correct
        this.orthCamera.position.set(-8, 11, 10);
        this.perCamera.zoom = 1;
        this.orthCamera.zoom = 1;
        this.perCamera.rotation.set(0,0,0);
        this.orthCamera.rotation.set(0,0,0);
        this.setOrbitControls();

        this.viewCube?.current?.setRotation(this.getRotation());
    }

    public setRotation(matrix: THREE.Matrix4){
        const fwd = new THREE.Vector3(0,0,-1);
        fwd.applyMatrix4(matrix).normalize();

        //find distance to the object for the multiplication
        // TODO: do not hardcode this children[3] but pass sweepobject instead
        // TODO: apply same shit in the view cube
        // TODO: do same for orthogonal
        // TODO: 
        const dist = this.perCamera.position.distanceTo( this.scene.children[3].position )
        const offset = fwd.multiplyScalar(dist);

        this.perCamera.position.copy(this.perControls.getTarget()).sub(offset);
        this.perControls.update();
    }

    public getRotation(){
        return new THREE.Matrix4().makeRotationFromEuler(this.perCamera.rotation);
    }
    

    public useOrthographicCamera(){
        this.isOrthographic = true;
        this.orthControls.enableTransform();
        this.perControls.disableTransform();
    }

    public usePerspectiveCamera(){
        this.isOrthographic = false;
        this.orthControls.disableTransform();
        this.perControls.enableTransform();
    }
    
    public toggleCamera(){
        this.isOrthographic = !this.isOrthographic;
        this.isOrthographic ? this.orthControls.enableTransform() : this.orthControls.disableTransform();
        !this.isOrthographic ? this.perControls.enableTransform() : this.perControls.disableTransform();
    }
}

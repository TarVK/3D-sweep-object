import * as THREE from "three";
import OrbitControls from "three-orbitcontrols";

export class Renderer {
    protected scene: THREE.Scene;
    protected renderer: THREE.WebGLRenderer;
    protected camera: THREE.Camera;

    protected width: number;
    protected height: number;

    protected container: HTMLElement;
    protected destroyed = false;

    protected controls: OrbitControls;
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

        this.animate();
        this.setOrbitControls();

        window.addEventListener("resize", this.updateSize);
    }

    /**
     * Makes sure that the renderer's size corresponds to the container's
     */
    public updateSize = () => {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.renderer.setSize(this.width, this.height);
        // TODO: update the camera's ratio param
    };

    public setPerspectiveCamera() {
        this.camera = new THREE.PerspectiveCamera(
            90,
            this.width / this.height,
            0.1,
            10000
        );
        this.resetCameraPosition();
        // TODO: update orbit controls
    }

    public setOrthographicCamera() {
        this.camera = new THREE.OrthographicCamera(
            this.width / -2,
            this.width / 2,
            this.height / 2,
            this.height / -2,
            0.1,
            10000
        );
        this.resetCameraPosition();
        //TODO: use previous camera's position.
        // TODO: update orbit controls
    }

    public resetCameraPosition(){
        this.camera.position.set(-10, 6, 12);
    }

    private animate = () => {
        if (!this.destroyed) requestAnimationFrame(this.animate);
        this.renderer?.render(this.scene, this.camera);
    };

    private setOrbitControls = () => {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    };

    public destroy() {
        this.destroyed = true;
        window.removeEventListener("resize", this.updateSize);
    }
}

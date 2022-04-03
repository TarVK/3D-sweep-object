import * as THREE from "three";
import {OrbitTransformControls} from "./controllers/OrbitTransformControls";

export class Renderer {
    protected isOrthographic = false;

    protected scene: THREE.Scene;
    protected renderer: THREE.WebGLRenderer;

    protected camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
    public controls: OrbitTransformControls | undefined;

    protected width: number;
    protected height: number;

    protected container: HTMLElement;
    protected destroyed = false;

    public readonly cameraFov = 90;
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
        this.renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer: true});
        this.renderer.shadowMap.enabled = true;
        this.renderer.setSize(this.width, this.height);
        this.renderer.autoClear = false;
        this.renderer.autoClearColor = false;

        target.appendChild(this.renderer.domElement);

        this.setPerspectiveCamera();
        this.camera.position.set(-10, 6, 12);
        this.camera.rotation.set(0, 0, 0);
        this.camera.zoom = 1;

        this.animate();
        window.addEventListener("resize", this.updateSize);
    }

    private animate = () => {
        if (!this.destroyed) requestAnimationFrame(this.animate);
        this.renderer.clear();
        this.renderer.clearColor();

        this.controls?.update();

        this.camera.layers.set(0);
        this.renderer.render(this.scene, this.camera);
        this.camera.layers.set(1);
        this.renderer.render(this.scene, this.camera);
    };

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
    private calculateOrthograhicProjection() {
        let depht_s = Math.tan((this.cameraFov / 2.0) * THREE.MathUtils.DEG2RAD) * 2.0;
        // Z is 12 because that's how we initialized the camera
        let Z = 12;
        let aspect = this.width / this.height;
        let size_y = depht_s * Z;
        let size_x = depht_s * Z * aspect;

        return {size_x, size_y};
    }

    private setPerspectiveCamera() {
        const camera = new THREE.PerspectiveCamera(
            this.cameraFov,
            this.width / this.height,
            0.1,
            10000
        );
        this.setNewCamera(camera);
    }

    private setOrthographicCamera() {
        const {size_x, size_y} = this.calculateOrthograhicProjection();
        const camera = new THREE.OrthographicCamera(
            -size_x / 2,
            size_x / 2,
            size_y / 2,
            -size_y / 2,
            0.1,
            10000
        );
        this.setNewCamera(camera);
    }

    private setNewCamera(camera: THREE.PerspectiveCamera | THREE.OrthographicCamera) {
        if (this.camera) {
            camera.position.copy(this.camera.position);
            camera.rotation.copy(this.camera.rotation);
            camera.zoom = this.camera.zoom;
            this.scene.remove(this.camera);
        }
        this.camera = camera;
        this.camera.updateProjectionMatrix();

        this.controls?.changeCamera(this.camera);
    }

    public destroy() {
        this.destroyed = true;
        window.removeEventListener("resize", this.updateSize);
    }

    public toggleCamera() {
        this.isOrthographic = !this.isOrthographic;
        if (this.isOrthographic) {
            this.setOrthographicCamera();
        } else {
            this.setPerspectiveCamera();
        }
    }

    public getCamera() {
        return this.camera;
    }

    public getRendererDomElem() {
        return this.renderer.domElement;
    }

    public attachControls(controls: OrbitTransformControls) {
        this.controls = controls;
    }
}

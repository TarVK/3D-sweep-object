import * as THREE from "three";
import {TransformControls} from "three/examples/jsm/controls/TransformControls";
import {colors} from "../ColorSchema";
import CameraControls from "camera-controls";

type Camera = THREE.PerspectiveCamera | THREE.OrthographicCamera;
type Modes = "add" | "delete" | "transform" | "move";

//Thanks https://sbcode.net/threejs/multi-controls-example/#video-lecture
export class OrbitTransformControls {
    private initialOrbitRadius: number;
    private transformControls: TransformControls;
    private orbitControls: CameraControls;

    private raycaster: THREE.Raycaster;
    private clock: THREE.Clock;

    private objects: THREE.Mesh[];
    private scene: THREE.Scene;
    private camera: Camera;
    private domElem: HTMLElement;

    private transformEnabled = true;

    private transformListeners: (() => void)[] = [];
    private addListeners: ((point: THREE.Vector3) => void)[] = [];
    private deleteListeners: ((point: THREE.Object3D) => void)[] = [];
    private orbitListeners: (() => void)[] = [];

    private hoverObj: THREE.Object3D | undefined;
    private mode: Modes = "transform";

    public currObj: THREE.Object3D | undefined;

    constructor(
        scene: THREE.Scene,
        objects: THREE.Mesh[],
        camera: Camera,
        domElem: HTMLElement
    ) {
        CameraControls.install({THREE: THREE});

        this.orbitControls = new CameraControls(camera, domElem);
        this.orbitControls.mouseButtons.left = CameraControls.ACTION.ROTATE;
        this.orbitControls.mouseButtons.wheel = CameraControls.ACTION.DOLLY;
        this.orbitControls.mouseButtons.right = CameraControls.ACTION.OFFSET;
        this.orbitControls.mouseButtons.middle = CameraControls.ACTION.NONE;
        this.orbitControls.mouseButtons.shiftLeft = CameraControls.ACTION.NONE;

        this.orbitControls.saveState();
        this.initialOrbitRadius = this.orbitControls.distance;

        this.raycaster = new THREE.Raycaster();
        this.raycaster.layers.set(1);
        this.clock = new THREE.Clock();
        this.objects = objects;
        this.scene = scene;
        this.camera = camera;
        this.domElem = domElem;
        domElem.addEventListener("mousemove", this.hoverPoint);
        domElem.addEventListener("mousedown", this.onMouseDown);
        domElem.addEventListener("dblclick", this.deselectOnDoubleClick);
    }

    public setMode(mode: Modes) {
        this.mode = mode;
        if (this.mode == "transform") {
            this.enableTransform();
            this.orbitControls.enabled = true;
        } else if (this.mode == "add") {
            this.disableTransform();
            this.orbitControls.enabled = false;
        } else if (this.mode == "delete") {
            this.disableTransform();
            this.orbitControls.enabled = true;
        } else if (this.mode == "move") {
        }
    }

    private onMouseDown = (event: MouseEvent) => {
        if (this.mode == "transform") {
            this.selectPointForMovement(event);
        } else if (this.mode == "add") {
            this.createNewPointOnClick(event);
        } else if (this.mode == "delete") {
            this.deletePointOnClick(event);
        } else if (this.mode == "move") {
        }
    };

    private deselectOnDoubleClick = (event: MouseEvent) => {
        if (this.mode == "add") return;

        const {x, y} = this.getMouseXandY(event);
        this.raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);
        const intersects = this.raycaster.intersectObjects(this.objects);
        if (intersects.length == 0) {
            this.disposeTransform();
        }
    };

    private selectPointForMovement = (event: MouseEvent) => {
        if (!this.transformEnabled) {
            this.orbitControls.enabled = true;
            return;
        }

        const {x, y} = this.getMouseXandY(event);
        this.raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);
        const intersects = this.raycaster.intersectObjects(this.objects);

        if (intersects.length > 0) {
            if (this.currObj == intersects[0].object) return;
            this.disposeTransform();
            this.currObj = intersects[0].object;

            this.transformControls = new TransformControls(this.camera, this.domElem);
            this.transformControls.attach(this.currObj);
            this.transformControls.setMode("translate");
            this.scene.add(this.transformControls);
            this.transformControls.addEventListener("dragging-changed", event => {
                this.orbitControls.enabled = !event.value;
            });
            this.transformControls.addEventListener("objectChange", () => {
                this.transformListeners.forEach(cb => cb());
            });
            this.setObjectColors();
        }
    };

    private hoverPoint = (event: MouseEvent) => {
        const {x, y} = this.getMouseXandY(event);
        this.raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);
        const intersects = this.raycaster.intersectObjects(this.objects);

        if (intersects.length > 0) {
            this.hoverObj = intersects[0].object;
        } else {
            this.hoverObj = undefined;
        }
        this.setObjectColors();
    };

    private setObjectColors() {
        this.objects.forEach(o => {
            if (o == this.currObj) {
                //@ts-ignore
                o.material.color.setHex(colors.SWEEP_POINT_SELECTED);
            } else if (o == this.hoverObj) {
                //@ts-ignore
                o.material.color.setHex(colors.SWEEP_POINT_HOVER);
            } else {
                //@ts-ignore
                o.material.color.setHex(colors.SWEEP_POINT);
            }
        });
    }

    private createNewPointOnClick(event: MouseEvent) {
        const plane = new THREE.Plane();
        const cameraQ = this.camera.quaternion.clone();
        plane.normal.set(0, 0, -1).applyQuaternion(cameraQ);

        const {x, y} = this.getMouseXandY(event);
        this.raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);
        const point = this.raycaster.ray.intersectPlane(plane, new THREE.Vector3());

        if (point) {
            this.addListeners.forEach(cb => cb(point));
        }
    }

    private deletePointOnClick(event: MouseEvent) {
        const {x, y} = this.getMouseXandY(event);
        this.raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);
        const intersects = this.raycaster.intersectObjects(this.objects);

        if (intersects.length > 0) {
            this.deleteListeners.forEach(cb => cb(intersects[0].object));
        }
    }

    private getMouseXandY(event: MouseEvent) {
        const canvasBounds = this.domElem.getBoundingClientRect()!;
        const x =
            ((event.clientX - canvasBounds.left) /
                (canvasBounds.right - canvasBounds.left)) *
                2 -
            1;
        const y =
            -(
                (event.clientY - canvasBounds.top) /
                (canvasBounds.bottom - canvasBounds.top)
            ) *
                2 +
            1;
        return {x, y};
    }

    private setZoom(zoom: number, smooth = false) {
        this.orbitControls.zoomTo(zoom, smooth);
    }

    private setDolly(dolly: number, smooth = false) {
        this.orbitControls.dollyTo(dolly, smooth);
    }

    private disposeTransform() {
        this.currObj = undefined;
        this.orbitControls.enabled = this.mode != "add";
        if (this.transformControls) {
            this.transformControls.dispose();
            this.transformControls.removeFromParent();
        }
        this.setObjectColors();
    }

    public dispose() {
        this.disposeTransform();
        this.orbitControls.dispose();
    }

    public onTransform(cb: () => void) {
        this.transformListeners.push(cb);
    }

    public onAdd(cb: (point: THREE.Vector3) => void) {
        this.addListeners.push(cb);
    }

    public onDelete(cb: (point: THREE.Object3D) => void) {
        this.deleteListeners.push(cb);
    }

    public onOrbiting(cb: () => void) {
        this.orbitListeners.push(cb);
        this.orbitControls.addEventListener("control", cb);
    }

    public update() {
        const delta = this.clock.getDelta();
        return this.orbitControls.update(delta);
    }

    public enableTransform() {
        this.transformEnabled = true;
    }

    public disableTransform() {
        this.transformEnabled = false;
        this.disposeTransform();
    }

    public changeCamera(camera: Camera) {
        this.camera = camera;
        this.orbitControls.camera = this.camera;

        if (this.camera instanceof THREE.PerspectiveCamera) {
            // dolly is the radius of the control sphere
            const dolly = this.initialOrbitRadius / this.camera.zoom;
            this.setZoom(1);
            this.setDolly(dolly);
            this.orbitControls.mouseButtons.wheel = CameraControls.ACTION.DOLLY;
        } else if (this.camera instanceof THREE.OrthographicCamera) {
            // zoom is the fraction of the initial control radius and the current one
            const zoom = this.initialOrbitRadius / this.orbitControls.distance;
            this.setZoom(zoom);
            this.orbitControls.mouseButtons.wheel = CameraControls.ACTION.ZOOM;
        }

        if (this.transformControls) {
            this.transformControls.camera = camera;
            this.transformControls.updateMatrix();
        }
    }

    public changeObjects(objects: THREE.Mesh[]) {
        if (objects == this.objects) return;
        this.disposeTransform();
        this.objects = objects;
    }

    public getAzimuthAngle() {
        return this.orbitControls.azimuthAngle;
    }

    public getPolarAngle() {
        return this.orbitControls.polarAngle;
    }

    public setRotation(azimuthAngle: number, polarAngle: number, smooth = false) {
        this.orbitControls.rotateTo(azimuthAngle, polarAngle, smooth);
    }

    public resetCamera(smooth = false) {
        this.orbitControls.reset(smooth);
        this.orbitListeners.forEach(cb => cb());
    }
}

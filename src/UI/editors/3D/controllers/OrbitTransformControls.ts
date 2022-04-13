import * as THREE from "three";
import {TransformControls} from "three/examples/jsm/controls/TransformControls";
import {colors} from "../ColorSchema";
import CameraControls from "camera-controls";

type Camera = THREE.PerspectiveCamera | THREE.OrthographicCamera;
export type Modes = "add" | "delete" | "transform" | "move";

//Thanks https://sbcode.net/threejs/multi-controls-example/#video-lecture
export class OrbitTransformControls {
    private readonly zoomScale = 0.5;

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
    private selectListeners: ((point: THREE.Object3D | null) => void)[] = [];

    private allowOrbitListeners = true;

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

        camera.position.set(-18, 35, 22);
        this.orbitControls = new CameraControls(camera, domElem);
        this.orbitControls.mouseButtons.left = CameraControls.ACTION.ROTATE;
        this.orbitControls.mouseButtons.wheel = CameraControls.ACTION.DOLLY;
        this.orbitControls.mouseButtons.right = CameraControls.ACTION.OFFSET;
        this.orbitControls.mouseButtons.shiftLeft = CameraControls.ACTION.ROTATE;
        this.orbitControls.mouseButtons.middle = CameraControls.ACTION.NONE;

        this.orbitControls.saveState();
        this.orbitControls.addEventListener("transitionstart", () => {
            this.allowOrbitListeners = true;
        });
        this.orbitControls.addEventListener("rest", () => {
            this.allowOrbitListeners = false;
        });
        this.orbitControls.addEventListener("update", () => {
            if (this.camera instanceof THREE.OrthographicCamera) {
                const dolly = this.getDollyFromZoom(this.camera.zoom) * this.zoomScale;
                this.setDolly(dolly);
            }
        });

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

        // Set the defaults
        this.orbitControls.setTarget(0, 15, 0);
        this.setZoom(1);
        this.orbitControls.saveState();
        this.initialOrbitRadius = this.orbitControls.distance;
    }

    public setMode(mode: Modes) {
        this.mode = mode;
        if (this.mode == "transform") {
            this.orbitControls.mouseButtons.left = CameraControls.ACTION.ROTATE;
            this.orbitControls.mouseButtons.right = CameraControls.ACTION.OFFSET;
        } else if (this.mode == "add") {
            this.disposeTransform();
            this.orbitControls.mouseButtons.left = CameraControls.ACTION.NONE;
            this.orbitControls.mouseButtons.right = CameraControls.ACTION.OFFSET;
        } else if (this.mode == "delete") {
            this.disposeTransform();
            this.orbitControls.mouseButtons.left = CameraControls.ACTION.ROTATE;
            this.orbitControls.mouseButtons.right = CameraControls.ACTION.OFFSET;
        } else if (this.mode == "move") {
            this.orbitControls.enabled = true;
            this.disposeTransform();
            this.orbitControls.mouseButtons.left = CameraControls.ACTION.ROTATE;
            this.orbitControls.mouseButtons.right = CameraControls.ACTION.OFFSET;
        }
    }

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

    private onMouseDown = (event: MouseEvent) => {
        if (this.mode == "transform") {
            this.selectPointForMovement(event);
        } else if (this.mode == "add") {
            this.createNewPointOnClick(event);
        } else if (this.mode == "delete") {
            this.deletePointOnClick(event);
        } else if (this.mode == "move") {
            return;
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

        this.selectListeners.forEach(cb => cb(null));
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

    private selectPointForMovement = (event: MouseEvent) => {
        if (event.button != 0) return;
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

            this.selectListeners.forEach(cb => cb(this.currObj!));
        }

        this.orbitControls.enabled = intersects.length == 0;
    };

    private createNewPointOnClick(event: MouseEvent) {
        if (event.button != 0 || event.shiftKey) return;
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
        if (event.button != 0) return;
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

    public onSelect(cb: (point: THREE.Object3D) => void) {
        this.selectListeners.push(cb);
    }

    public onOrbiting(cb: () => void) {
        this.orbitListeners.push(cb);
        this.orbitControls.addEventListener("update", () => {
            if (this.allowOrbitListeners) {
                cb();
            }
        });
    }

    public update() {
        const delta = this.clock.getDelta();
        return this.orbitControls.update(delta);
    }

    private getDollyFromZoom(zoom: number) {
        return this.initialOrbitRadius / zoom;
    }

    private fixZoomAndDoly() {
        if (this.camera instanceof THREE.PerspectiveCamera) {
            // dolly is the radius of the control sphere
            const dolly = this.getDollyFromZoom(this.camera.zoom * (1 / this.zoomScale));
            this.setZoom(1);
            this.setDolly(dolly);
            this.orbitControls.mouseButtons.wheel = CameraControls.ACTION.DOLLY;
        } else if (this.camera instanceof THREE.OrthographicCamera) {
            // zoom is the fraction of the initial control radius and the current one
            const zoom = this.initialOrbitRadius / this.orbitControls.distance;
            const dolly = this.getDollyFromZoom(zoom);
            this.setZoom(zoom * this.zoomScale);
            this.setDolly(dolly);
            this.orbitControls.mouseButtons.wheel = CameraControls.ACTION.ZOOM;
        }
    }

    public changeCamera(camera: Camera) {
        this.camera = camera;
        this.orbitControls.camera = this.camera;

        this.fixZoomAndDoly();

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

    public resetCamera(smooth = true) {
        this.orbitControls.reset(smooth);
        this.orbitListeners.forEach(cb => cb());
    }

    public getMode(): Modes {
        return this.mode;
    }
}

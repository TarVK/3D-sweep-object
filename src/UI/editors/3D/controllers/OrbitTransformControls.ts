import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {TransformControls} from "three/examples/jsm/controls/TransformControls";

type Camera = THREE.PerspectiveCamera | THREE.OrthographicCamera;
type Modes = "add" | "delete" | "transform" | "move";

//Thanks https://sbcode.net/threejs/multi-controls-example/#video-lecture
export class OrbitTransformControls {
    public transformControls: TransformControls;
    public orbitControls: OrbitControls;

    private raycaster: THREE.Raycaster;
    private objects: THREE.Object3D[];
    private scene: THREE.Scene;
    private camera: Camera;
    private domElem: HTMLElement;

    private transformEnabled = true;

    private transformListeners: (() => void)[] = [];
    private addListeners: ((point: THREE.Vector3) => void)[] = [];
    private deleteListeners: ((point: THREE.Object3D) => void)[] = [];

    public currObj: THREE.Object3D | undefined;
    private mode: Modes = "transform";

    constructor(
        scene: THREE.Scene,
        objects: THREE.Object3D[],
        camera: Camera,
        domElem: HTMLElement
    ) {
        this.orbitControls = new OrbitControls(camera, domElem);
        this.raycaster = new THREE.Raycaster();
        this.objects = objects;
        this.scene = scene;
        this.camera = camera;
        this.domElem = domElem;
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
        }
    };

    private createNewPointOnClick(event: MouseEvent) {
        const target = this.getTarget().clone();
        const plane = new THREE.Plane();
        let normal = target.clone().normalize().sub(this.camera.position);
        plane.setFromNormalAndCoplanarPoint(normal, target);

        const {x, y} = this.getMouseXandY(event);
        this.raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);
        const point = this.raycaster.ray.intersectPlane(plane, target);

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

    public dispose() {
        this.disposeTransform();
        this.orbitControls.dispose();
    }

    private disposeTransform() {
        this.currObj = undefined;
        this.orbitControls.enabled = this.mode != "add";
        if (this.transformControls) {
            this.transformControls.dispose();
            this.transformControls.removeFromParent();
        }
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

    public getTarget() {
        return this.orbitControls.target;
    }

    public update() {
        this.orbitControls.update();
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
        this.orbitControls.object = camera;
        this.orbitControls.update();
        if (this.transformControls) {
            this.transformControls.camera = camera;
            this.transformControls.updateMatrix();
        }
    }

    public changeObjects(objects: THREE.Object3D[]) {
        if (objects == this.objects) return;
        this.disposeTransform();
        this.objects = objects;
    }

    // public createCopyAndDispose(){
    //     const copy = new OrbitTransformControls(this.scene, this.objects, this.camera, this.domElem);
    //     this.transformListeners.forEach(cb => {
    //         copy.onTransform(cb);
    //     })
    //     this.dispose();
    //     return copy;
    // }
}

import * as THREE from "three";
import {colors} from "../ColorSchema";
import CameraControls from "camera-controls";

export class ViewCube {
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private scene: THREE.Scene;

    private cube: THREE.Mesh;
    readonly cubeFaces = ["Right", "Left", "Top", "Bottom", "Front", "Back"];
    private activeFaceIndex = 0;

    private raycaster: THREE.Raycaster;
    private clock: THREE.Clock;
    private controls: CameraControls;
    private orbitListeners: (() => void)[] = [];
    private allowOrbitListeners = true;

    constructor(domElem: HTMLElement) {
        this.initScene(domElem);
    }

    public initScene = (domElem: HTMLElement) => {
        const width = domElem.clientWidth;
        const height = domElem.clientHeight;

        this.camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
        this.camera.position.set(0, 0, 35);
        this.camera.rotation.set(0, 0, 0);
        this.scene = new THREE.Scene();

        this.raycaster = new THREE.Raycaster();

        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setPixelRatio(width / height);
        this.renderer.setSize(width, height);
        this.clock = new THREE.Clock();

        // remove bg
        this.scene.background = null;
        this.renderer.setClearColor(0x000000, 0);

        const geometry = new THREE.BoxGeometry(20, 20, 20);
        const materials = this.cubeFaces.map(
            t =>
                new THREE.MeshBasicMaterial({
                    color: colors.VIEWCUBE,
                    side: THREE.DoubleSide,
                    map: this.getTextTexture(t),
                })
        );
        this.cube = new THREE.Mesh(geometry, materials);
        this.scene.add(this.cube);

        const geo = new THREE.EdgesGeometry(this.cube.geometry);
        const mat = new THREE.LineBasicMaterial({
            color: colors.VIEWCUBE_OUTLINE,
            linewidth: 4,
        });
        const cubeEdges = new THREE.LineSegments(geo, mat);
        cubeEdges.renderOrder = 1;
        this.scene.add(cubeEdges);

        domElem.appendChild(this.renderer.domElement);

        this.createOrbitControls(this.camera, domElem);
        this.setEvents(domElem);
        this.animate();
    };

    public getAzimuthAngle() {
        return this.controls.azimuthAngle;
    }

    public getPolarAngle() {
        return this.controls.polarAngle;
    }

    public setRotation(azimuthAngle: number, polarAngle: number, smooth = false) {
        this.controls.rotateTo(azimuthAngle, polarAngle, smooth);
    }

    private animate = () => {
        requestAnimationFrame(this.animate);
        const delta = this.clock.getDelta();
        if (this.controls.update(delta)) {
            this.renderer?.render(this.scene, this.camera);
        }
    };

    private getTextTexture = (text: string, flipH = false, flipV = false) => {
        const canvas = document.createElement("canvas");
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext("2d")!;

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, 256, 256);

        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.font = "60px Arial";

        const hIndex = flipH ? -1 : 1;
        const vIndex = flipV ? -1 : 1;
        ctx.scale(hIndex, vIndex);

        ctx.fillText(
            text,
            (hIndex * (canvas.width + hIndex * 100)) % canvas.width,
            (vIndex * (canvas.height + vIndex * 115)) % canvas.height
        );

        return new THREE.CanvasTexture(canvas);
    };

    private createOrbitControls = (
        camera: THREE.PerspectiveCamera,
        elem: HTMLElement
    ) => {
        if (this.controls) this.controls.dispose();
        CameraControls.install({THREE: THREE});
        this.controls = new CameraControls(camera, elem);
        this.controls.enabled = true;
        this.controls.mouseButtons.left = CameraControls.ACTION.ROTATE;
        this.controls.mouseButtons.middle = CameraControls.ACTION.NONE;
        this.controls.mouseButtons.right = CameraControls.ACTION.NONE;
        this.controls.mouseButtons.shiftLeft = CameraControls.ACTION.NONE;
        this.controls.mouseButtons.wheel = CameraControls.ACTION.NONE;
        this.controls.maxPolarAngle = Math.PI * 2;

        this.controls.addEventListener("transitionstart", () => {
            this.allowOrbitListeners = true;
        });
        this.controls.addEventListener("rest", () => {
            this.allowOrbitListeners = false;
        });
    };

    private setEvents = (domElem: HTMLElement) => {
        const dragDelta = 12;
        domElem.addEventListener("mousemove", e => this.hoverCube(e, domElem));
        domElem.addEventListener("mousedown", downEvent => {
            let drag = false;
            const copyMovement = (moveEvent: MouseEvent) => {
                const xMoved =
                    Math.abs(moveEvent.clientX - downEvent.clientX) < dragDelta;
                const yMoved =
                    Math.abs(moveEvent.clientY - downEvent.clientY) < dragDelta;
                if (xMoved || yMoved) drag = true;
                this.orbitListeners.forEach(cb => cb());
            };
            window.addEventListener("mousemove", copyMovement, false);
            window.addEventListener(
                "mouseup",
                upEvent => {
                    if (!drag) {
                        this.clickCube(upEvent, domElem);
                    }
                    window.removeEventListener("mousemove", copyMovement, false);
                },
                {once: true}
            );
        });
    };

    private getRayIntersection = (event: MouseEvent, domElem: HTMLElement) => {
        const canvasBounds = domElem.getBoundingClientRect()!;
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
        this.raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);
        return this.raycaster.intersectObjects([this.cube], false);
    };

    private hoverCube = (event: MouseEvent, domElem: HTMLElement) => {
        // TODO: do something about the ts-ignore
        const intersects = this.getRayIntersection(event, domElem);
        if (intersects.length > 0) {
            if (
                intersects[0].face!.materialIndex !== this.activeFaceIndex &&
                this.activeFaceIndex !== -1
            ) {
                //@ts-ignore
                intersects[0].object.material[this.activeFaceIndex].color.setHex(
                    colors.VIEWCUBE
                );
            }
            this.activeFaceIndex = intersects[0].face!.materialIndex;
            //@ts-ignore
            this.cube.material[this.activeFaceIndex].color.setHex(colors.VIEWCUBE_HOVER);
        } else {
            if (this.activeFaceIndex !== -1) {
                //@ts-ignore
                this.cube.material[this.activeFaceIndex].color.setHex(colors.VIEWCUBE);
            }
            this.activeFaceIndex = -1;
        }
    };

    private clickCube(event: MouseEvent, domElem: HTMLElement) {
        const intersects = this.getRayIntersection(event, domElem);
        if (intersects.length > 0) {
            switch (this.cubeFaces[intersects[0].face!.materialIndex]) {
                case "Front":
                    this.setRotation(0, Math.PI / 2);
                    break;

                case "Back":
                    this.setRotation(Math.PI, Math.PI / 2);
                    break;

                case "Left":
                    this.setRotation(-Math.PI / 2, Math.PI / 2);
                    break;

                case "Right":
                    this.setRotation(Math.PI / 2, Math.PI / 2);
                    break;

                case "Top":
                    this.setRotation(0, -Math.PI / 2);
                    break;

                case "Bottom":
                    this.setRotation(0, Math.PI);
                    break;
            }
            this.activeFaceIndex = -1;
            this.orbitListeners.forEach(cb => cb());
        }
    }

    public onOrbiting(cb: () => void) {
        this.orbitListeners.push(cb);
        this.controls.addEventListener("update", () => {
            if (this.allowOrbitListeners) {
                cb();
            }
        });
    }
}

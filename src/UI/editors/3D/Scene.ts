import * as THREE from "three";
import {SweepObject} from "./SweepObject";
import {CrossSection} from "./CrossSection";
import {SweepLine} from "./SweepLine";
import {IMateriable} from "./_types/IMateriable";
import {SweepPoints} from "./SweepPoints";
import {colors} from "./ColorSchema";

export class Scene extends THREE.Scene {
    public sweepObject: SweepObject;
    public crossSections: CrossSection[];
    public sweepLine: SweepLine;
    public sweepPoints: SweepPoints;
    public objects: IMateriable[] = [];

    protected ground: THREE.Mesh;
    protected grid: THREE.GridHelper;

    public constructor() {
        super();
        this.addBackground(colors.BACKGROUND);
        this.addFog(colors.BACKGROUND, 100, 300);
        this.addDirectionalLight(colors.LIGHT);
        this.addHemiLight(colors.LIGHT, colors.GROUND);
        this.addGround(colors.GROUND);

        this.sweepObject = new SweepObject();
        this.crossSections = [];
        this.sweepLine = new SweepLine(true);
        this.sweepPoints = new SweepPoints(true);

        this.objects.push(this.sweepObject, this.sweepLine, this.sweepPoints);
        this.add(this.sweepObject, this.sweepLine, this.sweepPoints);

        this.addGrid(10000, 1000);
    }

    public addGrid = (size = 1000, divisions = 100) => {
        this.grid = new THREE.GridHelper(size, divisions, 0x000000, 0x000000);
        // this is just to relax typescript.
        if (!Array.isArray(this.grid.material)) {
            this.grid.material.opacity = 0.2;
            this.grid.material.transparent = true;
        }
        this.add(this.grid);

        // this.add(new THREE.AxesHelper(5));
    };

    public addGround = (color: number) => {
        this.ground = new THREE.Mesh(
            new THREE.PlaneGeometry(2000, 2000),
            new THREE.MeshPhongMaterial({color: color, depthWrite: false})
        );
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.receiveShadow = true;
        this.add(this.ground);
    };

    public setPlainMode(enabled: boolean): void {
        if (enabled) {
            this.remove(this.grid);
            this.remove(this.ground);
            this.addBackground(0xffffff);
        } else {
            this.add(this.grid);
            this.add(this.ground);
            this.addBackground(colors.BACKGROUND);
        }
    }

    public addBackground(color: number) {
        this.background = new THREE.Color(color);
    }

    public addFog(color: number, near = 10, far = 100) {
        this.fog = new THREE.Fog(color, near, far);
    }

    public addDirectionalLight(color: number) {
        const directionalLight = new THREE.DirectionalLight(color, 0.6);
        directionalLight.position.set(0, 200, 0);
        this.add(directionalLight);

        // TODO: make dynamic shadow size
        // directionalLight.castShadow = true;
        // const sc = directionalLight.shadow.camera;
        // const s = 50;
        // sc.left = -s;
        // sc.right = s;
        // sc.top = s;
        // sc.bottom = -s;
    }

    public addHemiLight(skyColor: number, groundColor: number) {
        const hemiLight = new THREE.HemisphereLight(skyColor, groundColor, 0.6);
        hemiLight.position.set(0, 200, 0);
        this.add(hemiLight);
    }

    public removeFog() {
        this.fog = new THREE.Fog(0x000000, Number.MAX_VALUE, Number.MAX_VALUE);
    }

    public setCrossSections(crossSections: CrossSection[]): void {
        this.crossSections.forEach(crossSection => {
            crossSection.removeFromParent();
            const index = this.objects.indexOf(crossSection);
            if (index != -1) this.objects.splice(index, 1);
        });

        this.objects.push(...crossSections);
        this.crossSections = crossSections;
        this.add(...crossSections);
    }
}

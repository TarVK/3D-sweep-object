import * as THREE from "three";
import {SweepObject} from "./SweepObject";
import {CrossSection} from "./CrossSection";
import {SweepLine} from "./SweepLine";
import {IMateriable} from "./_types/IMateriable";
import {SweepPoints} from "./SweepPoints";
import {colors} from "./ColorSchema";

export class Scene extends THREE.Scene {
    public sweepObject: SweepObject;
    public crossSection: CrossSection;
    public sweepLine: SweepLine;
    public sweepPoints: SweepPoints;
    public objects: IMateriable[] = [];

    public constructor() {
        super();
        this.addBackground(colors.BACKGROUND);
        this.addFog(colors.BACKGROUND, 100, 300);
        this.addDirectionalLight(colors.LIGHT);
        this.addHemiLight(colors.LIGHT, colors.GROUND);
        this.addGround(colors.GROUND);

        this.sweepObject = new SweepObject();
        this.crossSection = new CrossSection();
        this.sweepLine = new SweepLine(true);
        this.sweepPoints = new SweepPoints(true);

        this.objects.push(
            this.sweepObject,
            this.sweepLine,
            this.crossSection,
            this.sweepPoints
        );
        this.add(this.sweepObject, this.sweepLine, this.crossSection, this.sweepPoints);

        this.addGrid(10000, 1000);
    }

    public addGrid = (size = 1000, divisions = 100) => {
        const grid = new THREE.GridHelper(size, divisions, 0x000000, 0x000000);
        // this is just to relax typescript.
        if (!Array.isArray(grid.material)) {
            grid.material.opacity = 0.2;
            grid.material.transparent = true;
        }
        this.add(grid);

        this.add(new THREE.AxesHelper(5));
    };

    public addGround = (color: number) => {
        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(2000, 2000),
            new THREE.MeshPhongMaterial({color: color, depthWrite: false})
        );
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.add(ground);
    };

    public addBackground(color: number) {
        this.background = new THREE.Color(color);
    }

    public addFog(color: number, near = 10, far = 100) {
        this.fog = new THREE.Fog(color, near, far);
    }

    public addDirectionalLight = (color: number) => {
        const directionalLight = new THREE.DirectionalLight(color);
        directionalLight.position.set(0, 200, 100);
        directionalLight.castShadow = true;
        this.add(directionalLight);
    };

    public addHemiLight(skyColor: number, groundColor: number) {
        const hemiLight = new THREE.HemisphereLight(skyColor, groundColor);
        hemiLight.position.set(0, 200, 0);
        this.add(hemiLight);
    }

    public removeFog() {
        this.fog = new THREE.Fog(0x000000, Number.MAX_VALUE, Number.MAX_VALUE);
    }
}

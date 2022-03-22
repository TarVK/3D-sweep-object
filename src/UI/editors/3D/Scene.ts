import * as THREE from "three";
import {SweepObject} from "./SweepObject";
import {CrossSection} from "./CrossSection";
import {SweepLine} from "./SweepLine";
import {IMateriable} from "./_types/IMateriable";
import { SweepPoints } from "./SweepPoints";

export class Scene extends THREE.Scene {
    public sweepObject: SweepObject;
    public crossSection: CrossSection;
    public sweepLine: SweepLine;
    public sweepPoints: SweepPoints;
    public objects: IMateriable[] = [];

    readonly bgColor = 0xa0a0a0;
    readonly lightColor = 0xffffff;
    readonly groundColor = 0x999999;

    public constructor() {
        super();
        this.addBackground(this.bgColor);
        this.addFog(this.bgColor, 100, 300);
        this.addDirectionalLight(this.lightColor);
        this.addHemiLight(this.lightColor, this.groundColor);
        this.addGround(this.groundColor);

        this.sweepObject = new SweepObject();
        this.sweepLine = new SweepLine();
        this.crossSection = new CrossSection();
        this.sweepPoints = new SweepPoints();

        this.objects.push(this.sweepObject, this.sweepLine, this.crossSection, this.sweepPoints);
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

    public addGround = (color = this.groundColor) => {
        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(2000, 2000),
            new THREE.MeshPhongMaterial({color: color, depthWrite: false})
        );
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.add(ground);
    };

    public addBackground(color = this.bgColor) {
        this.background = new THREE.Color(color);
    }

    public addFog(color = this.bgColor, near = 10, far = 100) {
        this.fog = new THREE.Fog(color, near, far);
    }

    public addDirectionalLight = (color = this.lightColor) => {
        const directionalLight = new THREE.DirectionalLight(color);
        directionalLight.position.set(0, 200, 100);
        directionalLight.castShadow = true;
        this.add(directionalLight);

        // const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
        // this.add(directionalLightHelper);
    };

    public addHemiLight(skyColor = this.lightColor, groundColor = this.groundColor) {
        const hemiLight = new THREE.HemisphereLight(skyColor, groundColor);
        hemiLight.position.set(0, 200, 0);
        this.add(hemiLight);
    }

    public removeFog() {
        this.fog = new THREE.Fog(0x000000, Number.MAX_VALUE, Number.MAX_VALUE);
    }
}

import * as THREE from "three";
import {SweepObject} from "./SweepObject";
import {Vec3} from "../../util/Vec3";
import {CrossSection} from "./CrossSection";
import {SweepLine} from "./SweepLine";
import {IMateriable} from "./_types/IMateriable";

export class Scene extends THREE.Scene {
    public sweepObject: SweepObject;
    public crossSection: CrossSection;
    public sweepLine: SweepLine;
    public objects: IMateriable[] = [];

    readonly bgColor = 0xa0a0a0;
    readonly lightColor = 0xffffff;
    readonly groundColor = 0x999999;

    public constructor() {
        super();
        this.addBackground(this.bgColor);
        this.addFog(this.bgColor);
        this.addDirectionalLight(this.lightColor);
        this.addHemiLight(this.lightColor, this.groundColor);
        this.addGround(this.groundColor);

        this.sweepObject = new SweepObject();
        this.sweepLine = new SweepLine();
        this.crossSection = new CrossSection();

        this.objects.push(this.sweepObject, this.sweepLine, this.crossSection);
        this.add(this.sweepObject, this.sweepLine, this.crossSection);

        this.addGrid(10000, 1000);
    }

    public addGrid = (size = 1000, divisions = 100) => {
        const grid = new THREE.GridHelper( size, divisions, 0x000000, 0x000000 );
        // this is just to relax typescript.
        if(!Array.isArray(grid.material)){
            grid.material.opacity = 0.2;
            grid.material.transparent = true;
        }
        this.add(grid);

        this.add(new THREE.AxesHelper(5));
    };

    public addGround = (color = this.groundColor) => {
        const ground = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: color, depthWrite: false } ) );
        ground.rotation.x = - Math.PI / 2;
        ground.receiveShadow = true;
        this.add( ground );
    }

    public addBackground(color =  this.bgColor ){
        this.background = new THREE.Color(color);
    }

    public addFog(color = this.bgColor, near=10, far=100){        
        this.fog = new THREE.Fog(color , near, far );
    }

    public addDirectionalLight = (color = this.lightColor) => {
        const directionalLight = new THREE.DirectionalLight( color );
        directionalLight.position.set( 0, 200, 100 );
        directionalLight.castShadow = true;
        this.add( directionalLight );

        // const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
        // this.add(directionalLightHelper);
    }

    public addHemiLight(skyColor = this.lightColor, groundColor = this.groundColor){
        const hemiLight = new THREE.HemisphereLight( skyColor, groundColor);
        hemiLight.position.set( 0, 200, 0 );    
        this.add( hemiLight );
    }

    public removeFog(){        
        this.fog = new THREE.Fog(0x000000, Number.MAX_VALUE, Number.MAX_VALUE);
    }


    // TODO: Remove these functions from here till the end
    /*
    public addPointLight = (color = 0xffffff) => {
        const light = new THREE.PointLight(color, 3, 1000, 0.01);
        light.position.set(-3, 6, -3);
        this.add(light);
        const ambientLight = new THREE.AmbientLight(0x808080); // soft white light
        this.add(ambientLight);

        const sphereSize = 1;
        const pointLightHelper = new THREE.PointLightHelper(light, sphereSize);
        this.add(pointLightHelper);
    };
    
    public addCube = (color = 0x00ff00) => {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({
            color,
            // wireframe: true
        });

        const cube = new THREE.Mesh(geometry, material);
        cube.position.y += 0.5;
        this.add(cube);
    };

    public polygonToPositionCoordinates = (polygon: [number, number][], posZ = 1) => {
        const vecArr = polygon.map(point => new THREE.Vector2(point[0], point[1]), []);
        const triangles = THREE.ShapeUtils.triangulateShape(vecArr, []);
        const positions: Array<number> = [];

        for (const triangle of triangles) {
            for (const pointId of triangle) {
                positions.push(polygon[pointId][0]);
                positions.push(polygon[pointId][1]);
                positions.push(posZ);
            }
        }
        return positions;
    };

    public addPolygon = (polygon: [number, number][], posZ = 1, color = 0x0000ff) => {
        const positions = this.polygonToPositionCoordinates(polygon, posZ);
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        geometry.computeVertexNormals();
        const material = new THREE.MeshBasicMaterial({
            color,
            // wireframe: true,
            side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(geometry, material);
        this.add(mesh);
    };

    public addLine = (points: Array<Vec3>, color = 0xff0000, polygon = false) => {
        const vecPoints = points.map(p => new THREE.Vector3(p.x, p.y, p.z));
        if (polygon)
            vecPoints.push(new THREE.Vector3(points[0].x, points[0].y, points[0].z));
        const geometry = new THREE.BufferGeometry().setFromPoints(vecPoints);
        const material = new THREE.MeshBasicMaterial({
            color,
            // wireframe: true,
            side: THREE.DoubleSide,
        });
        const line = new THREE.Line(geometry, material);

        // vertices stored here
        console.log(line.geometry.attributes.position.array);
        // order of vertices stored here (if null, order is as seen in vertices)
        console.log(line.geometry.index);
        this.add(line);
    };
    */
}
import React, {Component} from "react";
import * as THREE from "three";
//@ts-ignore
import OrbitControls from "three-orbitcontrols";
import sky from "../../public/skybox.jpg";
import flameBK from "../../public/flame/flame_bk.jpg";
import flameDN from "../../public/flame/flame_dn.jpg";
import flameFT from "../../public/flame/flame_ft.jpg";
import flameLF from "../../public/flame/flame_lf.jpg";
import flameRT from "../../public/flame/flame_rt.jpg";
import flameUP from "../../public/flame/flame_up.jpg";

const polygonToPositionCoordinates = (polygon:[number, number][], posZ = 1) => {
    const vecArr = polygon.map(point => new THREE.Vector2(point[0], point[1]), []);
    const triangles = THREE.ShapeUtils.triangulateShape(vecArr, []);
    const positions: Array<number> = [];

    for (const triangle of triangles){
        for (const pointId of triangle){
            positions.push(polygon[pointId][0]);
            positions.push(polygon[pointId][1]);
            positions.push(posZ);
        } 
    }
    return positions;
}



//////////////////////////////////////////////////// SWEEP LINE BULLSHIT STARTS ////////////////////////////////////////////////////////////
//////////////////////////////////////////////////// SWEEP LINE BULLSHIT STARTS ////////////////////////////////////////////////////////////
//////////////////////////////////////////////////// SWEEP LINE BULLSHIT STARTS ////////////////////////////////////////////////////////////
//////////////////////////////////////////////////// SWEEP LINE BULLSHIT STARTS ////////////////////////////////////////////////////////////
//////////////////////////////////////////////////// SWEEP LINE BULLSHIT STARTS ////////////////////////////////////////////////////////////
//////////////////////////////////////////////////// SWEEP LINE BULLSHIT STARTS ////////////////////////////////////////////////////////////
//////////////////////////////////////////////////// SWEEP LINE BULLSHIT STARTS ////////////////////////////////////////////////////////////

type Point = [number, number, number];
type Polygon = Point[];

const getMinAndMaxCoords = (polygon: Polygon) => {
	const min = [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY];
	const max = [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY];
	
	for(let i=0; i<polygon.length; i++){		
		for(let j=0; j<polygon[i].length; j++){
			if(min[j] > polygon[i][j]){
				min[j] = polygon[i][j];
			}
			if(max[j] < polygon[i][j]){
				max[j] = polygon[i][j];
			}
		}
	}
	
	return {min, max}	
}

const getCenter = (polygon: Polygon): Point => {
	const {min, max} = getMinAndMaxCoords(polygon);
	
	return [
		max[0]/2 + min[0]/2,
		max[1]/2 + min[1]/2,
		max[2]/2 + min[2]/2
	]
}


const dist = (p1: Point, p2: Point) => {
    return Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2) + Math.pow(p1[2] - p2[2], 2);
}

const normalizePolygon = (poly: Polygon) => {
    const {min} = getMinAndMaxCoords(poly);
    return poly.map(p => [p[0] - min[0],p[1] - min[1],p[2] - min[2]])
}



const generateSweep = (line: [number, number, number][], polygon: [number, number, number][]) => {
    const center = getCenter(polygon);

    let minPoint = line[0];
    let minDist = Number.POSITIVE_INFINITY;

    for(let i=0; i<line.length; i++){
        const currDist = dist(center, line[i]);
        if(minDist > currDist){
            minDist = currDist;
            minPoint = line[i];
        }
    }

    const normalPoly = normalizePolygon(polygon);

    const difference = [polygon[0][0] - minPoint[0], polygon[0][1] - minPoint[1], polygon[0][2] - minPoint[2]];
    const allPolygons:Polygon[] = [];
    for(let i=0; i<line.length; i++){
        const newCenter = [line[i][0] + difference[0], line[i][1] + difference[1], line[i][2] + difference[2]];
        allPolygons.push(normalPoly.map(p => [p[0]+newCenter[0],p[1]+newCenter[1],p[2]+newCenter[2]])); 
    }

    return allPolygons;
}




const getAllMeshes = (allPolygons: Polygon[]) => {
    // genrate the face mesh

    const positions: Array<number> = [];
    const indices: Array<number> = [];

    for(const polygon of allPolygons){
        for(const point of polygon){
            for(const coord of point){
                positions.push(coord);
            }
        }
    }


    const polygonSize = allPolygons[0].length;
    for(let i=0; i<allPolygons.length - 1; i++){
        for(let j=0; j<polygonSize-1; j++){
            const currIndex = i*polygonSize + j;
            const rect = [
                currIndex,
                currIndex +1,
                currIndex +polygonSize,
                currIndex +polygonSize +1,
            ]
            indices.push(rect[0], rect[1], rect[2]);
            indices.push(rect[3], rect[2], rect[1]);
        }
        const rect = [
            i*polygonSize,
            (i+1)*polygonSize - 1,
            (i+1)*polygonSize,
            (i+2)*polygonSize-1,
        ]
        indices.push(rect[0], rect[1], rect[2]);
        indices.push(rect[3], rect[2], rect[1]);
    }


    const face = allPolygons[0];
    const flattenedFace = face.map(p => new THREE.Vector2(p[0], p[1]));
    const triangles = THREE.ShapeUtils.triangulateShape(flattenedFace, []);
    for (const triangle of triangles){
        for (const pointId of triangle){
            indices.push(pointId);
        } 
    }
    
    const lastFaceStartIndex = (allPolygons.length - 1)*face.length;
    for (const triangle of triangles){
        for (const pointId of triangle){
            indices.push(lastFaceStartIndex+pointId);
        } 
    }

    return {positions, indices};
}


//////////////////////////////////////////////////// SWEEP LINE BULLSHIT ENDS ////////////////////////////////////////////////////////////
//////////////////////////////////////////////////// SWEEP LINE BULLSHIT ENDS ////////////////////////////////////////////////////////////
//////////////////////////////////////////////////// SWEEP LINE BULLSHIT ENDS ////////////////////////////////////////////////////////////
//////////////////////////////////////////////////// SWEEP LINE BULLSHIT ENDS ////////////////////////////////////////////////////////////
//////////////////////////////////////////////////// SWEEP LINE BULLSHIT ENDS ////////////////////////////////////////////////////////////
//////////////////////////////////////////////////// SWEEP LINE BULLSHIT ENDS ////////////////////////////////////////////////////////////
//////////////////////////////////////////////////// SWEEP LINE BULLSHIT ENDS ////////////////////////////////////////////////////////////
//////////////////////////////////////////////////// SWEEP LINE BULLSHIT ENDS ////////////////////////////////////////////////////////////
//////////////////////////////////////////////////// SWEEP LINE BULLSHIT ENDS ////////////////////////////////////////////////////////////





class ThreeScene extends Component{
    private mount: HTMLDivElement | null;
    private scene: THREE.Scene;
    private renderer: THREE.Renderer;
    private camera: THREE.Camera;

    componentDidMount(){
        this.initThreeJS();
    }

    
    addPointLightToScene = (color = 0xffffff) => {
        const light = new THREE.PointLight(color, 3, 1000, 0.01);
        light.position.set(-5, 10, -5);
        this.scene.add(light);
    }

    addSweepObjectToScene = (allPolygons: Polygon[], color = 0xfa3058) => {
        const {positions, indices} = getAllMeshes(allPolygons);
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();
        const material = new THREE.MeshStandardMaterial( { 
            color,
            // wireframe: true,
            side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh( geometry, material);
        this.scene.add(mesh);
    }

    // each face needs to exist once in the polygon, so possibly a vertex can exist multiple times
    // for more info https://threejs.org/manual/?q=custom#en/custom-buffergeometry 
    addPolygonToScene = (polygon:[number, number][], posZ = 1, color = 0x0000ff) => {
        const positions = polygonToPositionCoordinates(polygon, posZ);
        console.log(positions);
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.computeVertexNormals();
        const material = new THREE.MeshBasicMaterial( { 
            color,
            // wireframe: true,
            side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh( geometry, material);
        this.scene.add(mesh);
    }

    addLineToScene = (points:[number, number, number][], color = 0xff0000, polygon=false) => {
        const vecPoints = points.map(p => new THREE.Vector3(p[0], p[1], p[2]));
        if(polygon) vecPoints.push(new THREE.Vector3(points[0][0], points[0][1], points[0][2]));
        const geometry = new THREE.BufferGeometry().setFromPoints(vecPoints);
        const material = new THREE.MeshBasicMaterial( { 
            color,
            // wireframe: true,
            side: THREE.DoubleSide
        });
        const line = new THREE.Line(geometry, material);
        // vertices stored here
        console.log(line.geometry.attributes.position.array);
        // order of vertices stored here (if null, order is as seen in vertices)
        console.log(line.geometry.index);
        this.scene.add(line);
    }

    addSkybox = () => {
        const imgs = [flameFT, flameBK, flameUP, flameDN, flameRT, flameLF];
        const textures = imgs.map(i => new THREE.TextureLoader().load(i));
        const materials = textures.map(t => new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide }));
        const skyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000);
        const skybox = new THREE.Mesh(skyboxGeo, materials);
        this.scene.add(skybox);
    }

    addSkysphere = () => {
        const texture = new THREE.TextureLoader().load(sky);
        const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
        const geo = new THREE.SphereBufferGeometry(1000);
        const skysphere = new THREE.Mesh(geo, material);
        this.scene.add(skysphere);
    }


    initThreeJS = () => {
        const width = window.innerWidth - 200;
        const height = window.innerHeight - 200;

        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        
        this.renderer.setSize(width, height);
        this.mount?.appendChild(this.renderer.domElement);
    
        this.camera = new THREE.PerspectiveCamera(90, width / height, 0.1, 10000);
        this.camera.position.set(-6, 3, 5);
        
        
        this.addSkysphere();
        // this.addSkybox();
        this.addGridToScene();
        this.addPointLightToScene();
        
        // this.addCubeToScene();
        // this.addPolygonToScene([[0,0], [1,1], [0,1]], 1);
        // this.addPolygonToScene([[0,0], [1,0], [1,1], [0,1]], 2, 0xdd22aa);
        // this.addPolygonToScene([[0,0], [0,1], [0.5, 0.5], [1,1], [1,0]], 3, 0xbbaa44);
        // this.addLineToScene([[1,1,4], [1,2,4], [1.5, 1.5,4], [2,2,4], [2,1,4]]);
        
        const crossSection: Polygon = [[1,1,3], [1,3,3], [2,2.5,3], [3,3,3], [3,1,3]];
        const line: Polygon = [[2,2,3], [5,5,10], [7, 7, 15]];
        const allPolys = generateSweep(line, crossSection);
        // sweep line
        this.addLineToScene(line, 0x0000ff);
        // all intermidiate polys
        for(const poly of allPolys){
            this.addLineToScene(poly, 0xff0000, true);
        }
        this.addSweepObjectToScene(allPolys);

        
        this.animate();
        new OrbitControls(this.camera, this.renderer.domElement);
    }


    addGridToScene = (size = 100, divisions = 100) => {
        this.scene.add(new THREE.GridHelper(size, divisions));
    }

    addCubeToScene = (color = 0x00ff00) => {
        let geometry = new THREE.BoxGeometry(1, 1, 1);
        let material = new THREE.MeshBasicMaterial({
            color,
            // wireframe: true
        })

        let cube = new THREE.Mesh(geometry, material);
        cube.position.y += 0.5;
        this.scene.add(cube);
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        this.renderer?.render(this.scene, this.camera);
    }

    render(): React.ReactNode {
        return (
            <div
                ref={mount => {
                    this.mount = mount;
                }}
            />
        );
    }
}

export default ThreeScene;
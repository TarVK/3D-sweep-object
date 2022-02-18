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
            positions.push(polygon[pointId][0])
            positions.push(polygon[pointId][1])
            positions.push(posZ)
        } 
    }
    return positions;
}

class ThreeScene extends Component{
    private mount: HTMLDivElement | null;
    private scene: THREE.Scene;
    private renderer: THREE.Renderer;
    private camera: THREE.Camera;

    componentDidMount(){
        this.initThreeJS();
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

    addLineToScene = (points:[number, number, number][], color = 0xff0000) => {
        const vecPoints = points.map(p => new THREE.Vector3(p[0], p[1], p[2]));
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
        this.camera.position.z = 5;
        
        
        this.addSkysphere();
        // this.addSkybox();
        this.addGridToScene();
        this.addCubeToScene();
        this.addPolygonToScene([[0,0], [1,1], [0,1]], 1);
        this.addPolygonToScene([[0,0], [1,0], [1,1], [0,1]], 2, 0xdd22aa);
        this.addPolygonToScene([[0,0], [0,1], [0.5, 0.5], [1,1], [1,0]], 3, 0xbbaa44);
        this.addLineToScene([[1,1,4], [1,2,4], [1.5, 1.5,4], [2,2,4], [2,1,4]]);
        
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
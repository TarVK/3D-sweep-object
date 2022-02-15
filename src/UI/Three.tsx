import React, {Component} from "react";
import * as THREE from "three";
//@ts-ignore
import OrbitControls from "three-orbitcontrols";


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

    initThreeJS = () => {
        const width = window.innerWidth - 200;
        const height = window.innerHeight - 200;

        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        
        this.renderer.setSize(width, height);
        this.mount?.appendChild(this.renderer.domElement);
    
        this.camera = new THREE.PerspectiveCamera(90, width / height, 0.1, 1000);
        this.camera.position.z = 5;
        
        this.addGridToScene();
        this.addCubeToScene();
        this.addPolygonToScene([[0,0], [1,1], [0,1]], 1);
        this.addPolygonToScene([[0,0], [1,0], [1,1], [0,1]], 2, 0xdd22aa);
        this.addPolygonToScene([[0,0], [0,1], [0.5, 0.5], [1,1], [1,0]], 3, 0xbbaa44);
        
        this.animate();
        new OrbitControls(this.camera, this.renderer.domElement);
    }


    addGridToScene = (size = 10, divisions = 100) => {
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
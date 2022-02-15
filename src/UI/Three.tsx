import React, {Component} from "react";
import * as THREE from "three";
//@ts-ignore
import OrbitControls from "three-orbitcontrols";


class ThreeScene extends Component{
    private mount: HTMLDivElement | null;
    private scene: THREE.Scene;
    private renderer: THREE.Renderer;
    private camera: THREE.Camera;

    componentDidMount(){
        this.initThreeJS();
    }

    initThreeJS = () => {
        const width = window.innerWidth - 200;
        const height = window.innerHeight - 200;

        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();

        this.addGridToScene();


        this.renderer.setSize(width, height);
        this.mount?.appendChild(this.renderer.domElement);
    
        this.camera = new THREE.PerspectiveCamera(90, width / height, 0.1, 1000);
        this.camera.position.z = 5;
        
        this.addCubeToScene();
        this.animate()
 
        this.renderer.render(this.scene, this.camera);
        new OrbitControls(this.camera, this.renderer.domElement);

    }


    addGridToScene = (size = 10, divisions = 100) => {
        this.scene.add(new THREE.GridHelper(size, divisions));
    }

    addCubeToScene = () => {
        let geometry = new THREE.BoxGeometry(1, 1, 1);
        let material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true
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
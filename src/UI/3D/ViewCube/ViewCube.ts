import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
import { MutableRefObject } from "react";
import { Renderer } from "../Renderer";

export class ViewCube{
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private scene: THREE.Scene;

    private cube: THREE.Mesh;
    readonly cubeFaces = ["Right", "Left", "Top", "Bottom", "Front", "Back"];
    private activeFaceIndex = 0;

    private raycaster: THREE.Raycaster;
    private controls: OrbitControls;
    private rend: MutableRefObject<Renderer | undefined>

    
    public initScene = (domElem: HTMLElement) => {
        const width = domElem.clientWidth;
        const height = domElem.clientHeight;

        this.camera = new THREE.PerspectiveCamera( 60, width / height, 1, 1000 );
        this.camera.position.set(0, 0, 35);
        this.camera.rotation.set(0, 0, 0);
        this.scene = new THREE.Scene();
        
        this.raycaster = new THREE.Raycaster();
        
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setPixelRatio( width / height );
        this.renderer.setSize( width, height );

        // remove bg
        this.scene.background = null;
        this.renderer.setClearColor( 0x000000, 0 );
        

        const geometry = new THREE.BoxGeometry( 20, 20, 20 );
        const materials = this.cubeFaces.map(t => new THREE.MeshBasicMaterial( {color: 0xeeeeee, side: THREE.DoubleSide, map: this.getTextTexture(t)} ));
        this.cube = new THREE.Mesh( geometry, materials );
        this.scene.add( this.cube );

        const geo = new THREE.EdgesGeometry( this.cube.geometry );
        const mat = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 4 } );
        const cubeEdges = new THREE.LineSegments( geo, mat );
        cubeEdges.renderOrder = 1;
        this.scene.add( cubeEdges );

        domElem.appendChild(this.renderer.domElement);

        this.createOrbitControls(this.camera, domElem);
        this.setEvents(domElem);
        this.animate();
    }

    public getRotation = () => {
        const rotMat = new THREE.Matrix4().makeRotationFromEuler(this.camera.rotation);
        return rotMat;
    }

    public setRotation = (matrix: THREE.Matrix4) => {
        const fwd = new THREE.Vector3(0,0,-1);
        fwd.applyMatrix4(matrix).normalize();
        const dist = this.camera.position.distanceTo( this.cube.position )
        const offset = fwd.multiplyScalar(dist);
        this.camera.position.copy(this.controls.target).sub(offset);
        this.controls.update();
    }

    public attachRenderer = (rendRef: MutableRefObject<Renderer | undefined>) => {
        this.rend = rendRef;
    }

    private animate = () => {
        requestAnimationFrame( this.animate );
        this.renderer?.render( this.scene, this.camera );
    }

    private getTextTexture = (text: string, flipH = false, flipV = false) => {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext("2d")!;

        ctx.fillStyle='white';
        ctx.fillRect(0, 0, 256, 256);

        ctx.fillStyle='black';
        ctx.textAlign = "center";
        ctx.font = "60px Arial";

        const hIndex = flipH? -1:1;
        const vIndex = flipV? -1:1;
        ctx.scale(hIndex, vIndex);

        ctx.fillText(
            text, 
            hIndex * (canvas.width  + hIndex*100) % canvas.width, 
            vIndex * (canvas.height + vIndex*115) % canvas.height
        );

        return new THREE.CanvasTexture( canvas );
    }
    
    private createOrbitControls = (camera: THREE.Camera, elem: HTMLElement) => {
        if(this.controls) this.controls.dispose();
        this.controls = new OrbitControls(camera, elem);
        this.controls.enablePan = false;
        this.controls.enableZoom = false;
        this.controls.maxPolarAngle = Math.PI*2;
    }

    private setEvents = (domElem: HTMLElement) => {
        const dragDelta = 12;
        domElem.addEventListener( 'mousemove', (e) => this.hoverCube(e, domElem) );
        domElem.addEventListener( 'mousedown', (downEvent) => {
            let drag = false;
            const copyMovement = (moveEvent: MouseEvent) => {
                const xMoved = Math.abs(moveEvent.clientX - downEvent.clientX) < dragDelta ;
                const yMoved =  Math.abs(moveEvent.clientY - downEvent.clientY) < dragDelta
                if(xMoved || yMoved) drag=true;
                // TODO: make this call to setRotation of rend in only 1 place!!!
                this.rend.current!.setRotation(this.getRotation());
            }
            window.addEventListener('mousemove', copyMovement, false);
            window.addEventListener('mouseup', (upEvent) => {
                if(!drag){
                    this.clickCube(upEvent, domElem);
                }
                window.removeEventListener('mousemove', copyMovement, false);
            }, {once: true});
        });
    }
    

    private getRayIntersection = (event: MouseEvent, domElem: HTMLElement ) => {
        const canvasBounds = domElem.getBoundingClientRect()!;
        const x = ( ( event.clientX - canvasBounds.left ) / ( canvasBounds.right - canvasBounds.left ) ) * 2 - 1;
        const y = - ( ( event.clientY - canvasBounds.top ) / ( canvasBounds.bottom - canvasBounds.top) ) * 2 + 1;
        this.raycaster.setFromCamera( new THREE.Vector2(x, y), this.camera );
        return this.raycaster.intersectObjects([this.cube], false);
    }

    private hoverCube = ( event: MouseEvent, domElem: HTMLElement ) => {
        // TODO: do something about the ts-ignore
        const intersects = this.getRayIntersection(event, domElem);
        if (intersects.length > 0) {
            if (intersects[0].face!.materialIndex !== this.activeFaceIndex && this.activeFaceIndex !== -1) {
                //@ts-ignore
                intersects[0].object.material[this.activeFaceIndex].color.setHex(0xeeeeee);
            }
            this.activeFaceIndex = intersects[0].face!.materialIndex;
            //@ts-ignore
            this.cube.material[this.activeFaceIndex].color.setHex(0xaaaaaa);
        } else {
            if (this.activeFaceIndex !== -1) {
                //@ts-ignore
                this.cube.material[this.activeFaceIndex].color.setHex(0xeeeeee);
            }
            this.activeFaceIndex = -1;
        }
    }

    private clickCube( event: MouseEvent, domElem: HTMLElement){
        const intersects = this.getRayIntersection(event, domElem);
        if(intersects.length > 0){
            const matrix = new THREE.Matrix4();
            matrix.identity();
            switch(this.cubeFaces[intersects[0].face!.materialIndex]){
                case "Front":
                    matrix.makeRotationX(0);
                    break;

                case "Back":
                    matrix.makeRotationX(Math.PI);
                    break;

                case "Left":
                    matrix.makeRotationY(-Math.PI/2);
                    break;
                    
                case "Right":
                    matrix.makeRotationY(Math.PI/2);
                    break;

                case "Top":
                    matrix.makeRotationX(-Math.PI/2);
                    break;
                    
                case "Bottom":
                    matrix.makeRotationX(Math.PI/2);
                    break;
            }
            this.activeFaceIndex = -1;
            this.setRotation(matrix);
            // TODO: make this call to setRotation of rend in only 1 place!!!
            this.rend.current!.setRotation(this.getRotation());
        }
    }
}
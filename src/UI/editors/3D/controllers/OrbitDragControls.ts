import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'

type Camera =  THREE.PerspectiveCamera | THREE.OrthographicCamera;

//Thanks https://sbcode.net/threejs/multi-controls-example/#video-lecture
export class OrbitDragControls{
    public dragControls: DragControls;
    public orbitControls:  OrbitControls;

    constructor(objects: THREE.Object3D[], camera: Camera, domElem: HTMLElement){
        this.dragControls = new DragControls(objects, camera, domElem);
        this.orbitControls = new OrbitControls(camera, domElem);


        this.dragControls.addEventListener('dragstart', (event) => {
            this.orbitControls.enabled = false
            event.object.material.opacity = 0.33
            console.log(event);
        })
        this.dragControls.addEventListener('dragend', (event) => {
            this.orbitControls.enabled = true
            event.object.material.opacity = 1
        })
    }

    public dispose(){
        this.dragControls.dispose();
        this.orbitControls.dispose();
    }

    public getTarget(){
        return this.orbitControls.target;
    }
    public update(){
        this.orbitControls.update();
        // this.dragControls.update();
    }
}


export class OrbitTransformControls{
    public transformControls: TransformControls;
    public orbitControls:  OrbitControls;
    public raycaster:  THREE.Raycaster;
    public objects: THREE.Object3D[];
    public scene: THREE.Scene;
    public camera: Camera;
    public domElem: HTMLElement;

    private transformEnabled = true;
    private transformEvents: Function[] = []
    
    public currObj: THREE.Object3D | undefined;

    constructor(scene: THREE.Scene, objects: THREE.Object3D[], camera: Camera, domElem: HTMLElement){
        this.orbitControls = new OrbitControls(camera, domElem);
        this.raycaster = new THREE.Raycaster();
        this.objects = objects;
        this.scene = scene;
        this.camera = camera;
        this.domElem = domElem;
        domElem.addEventListener( 'mousedown', this.useRayCaster );
        domElem.addEventListener( 'dblclick', this.deselectOnDoubleClick );
    }

    public onTransform(cb: Function){
        this.transformEvents.push(cb);
    }

    private deselectOnDoubleClick = (event: MouseEvent) => {
        console.log(event);
        const {x, y} = this.getMouseXandY(event);
        this.raycaster.setFromCamera( new THREE.Vector2(x, y), this.camera );
        const intersects = this.raycaster.intersectObjects(this.objects);
        if(intersects.length == 0){
            this.disposeTransform();
        }
    }

    private useRayCaster = ( event: MouseEvent ) => {
        if(!this.transformEnabled) {
            this.orbitControls.enabled = true;
            return;
        };
        
        const {x, y} = this.getMouseXandY(event);
        this.raycaster.setFromCamera( new THREE.Vector2(x, y), this.camera );
        
        const intersects = this.raycaster.intersectObjects(this.objects);
        if(intersects && intersects.length>0){
            if(this.currObj == intersects[0].object) return;
            if(!intersects[0].object.visible) return;
            this.disposeTransform();
            this.currObj = intersects[0].object;

            this.transformControls = new TransformControls(this.camera, this.domElem);
            this.transformControls.attach(this.currObj);
            this.transformControls.setMode('translate');
            this.scene.add(this.transformControls);
            this.transformControls.addEventListener('dragging-changed', (event) => {
                this.orbitControls.enabled = !event.value;
            });
            this.transformControls.addEventListener('objectChange', () => {
                this.transformEvents.forEach(cb => cb());
            })
        }
    }

    private getMouseXandY(event: MouseEvent){
        const canvasBounds = this.domElem.getBoundingClientRect()!;
        const x = ( ( event.clientX - canvasBounds.left ) / ( canvasBounds.right - canvasBounds.left ) ) * 2 - 1;
        const y = - ( ( event.clientY - canvasBounds.top ) / ( canvasBounds.bottom - canvasBounds.top) ) * 2 + 1;
        return {x, y};
    }

    public dispose(){
        this.disposeTransform();
        this.orbitControls.dispose();
    }

    private disposeTransform(){
        this.currObj = undefined;
        this.orbitControls.enabled = true;
        if(this.transformControls){
            this.transformControls.dispose();
            this.transformControls.removeFromParent();
        }
    }

    public getTarget(){
        return this.orbitControls.target;
    }

    public update(){
        this.orbitControls.update();
    }

    public enableTransform(){
        this.transformEnabled = true;
    }
    
    public disableTransform(){
        this.transformEnabled = false;
        this.disposeTransform();
    }

    public changeCamera(camera: Camera){
        this.camera = camera;
        this.orbitControls.object = camera;
        this.orbitControls.update();
        if(this.transformControls){
            this.transformControls.camera = camera;
            this.transformControls.updateMatrix();
        }
    }

    public changeObjects(objects: THREE.Object3D[]){
        if(objects == this.objects) return;
        this.disposeTransform();
        this.objects = objects;
    }

    // public createCopyAndDispose(){
    //     const copy = new OrbitTransformControls(this.scene, this.objects, this.camera, this.domElem);
    //     this.transformEvents.forEach(cb => {
    //         copy.onTransform(cb);
    //     })
    //     this.dispose();
    //     return copy;
    // }

}

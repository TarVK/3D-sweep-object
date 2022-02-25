import * as THREE from "three";
import {IMesh} from "../../sweepObject/_types/IMesh";
import {IMateriable} from "./_types/IMateriable";

export class SweepObject extends THREE.Object3D implements IMateriable {
    updateMesh(newMesh: IMesh) {}

    public updateMaterial(material: THREE.Material): void {}
}

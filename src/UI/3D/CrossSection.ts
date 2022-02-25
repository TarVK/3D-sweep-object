import * as THREE from "three";
import {IMateriable} from "./_types/IMateriable";

export class CrossSection extends THREE.Object3D implements IMateriable {
    public updateMaterial(material: THREE.Material): void {}
}

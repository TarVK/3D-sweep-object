import * as THREE from "three";
import {IMesh} from "../../../sweepOperation/_types/IMesh";
import {colors} from "./ColorSchema";
import {IMateriable} from "./_types/IMateriable";

export class SweepObject extends THREE.Object3D implements IMateriable {
    protected mesh: THREE.Mesh;
    protected wireframe = false;

    /**
     * Updates the mesh of the object
     * @param newMesh The new mesh to be set
     */
    public updateMesh(newMesh: IMesh, castShadow = true) {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(
                newMesh.points.flatMap(v => [v.x, v.y, v.z]), // Note we negate z because positive z comes towards the camera instead of away from it, which is counter intuitive
                3
            )
        );
        geometry.setIndex(newMesh.faces.flat());
        geometry.computeVertexNormals();
        const material = new THREE.MeshStandardMaterial({
            color: colors.SWEEP_OBJECT,
            roughness: 0.2,
            metalness: 0.8,
            wireframe: this.wireframe,
            // side: THREE.DoubleSide,
        });
        if (!this.mesh) {
            this.mesh = new THREE.Mesh(geometry, material);
            this.add(this.mesh);
        } else {
            this.mesh.geometry = geometry;
        }
        this.mesh.castShadow = castShadow;
    }

    public updateMaterial(material: THREE.Material): void {}

    public toggleWireframe() {
        this.wireframe = !this.wireframe;
        //@ts-ignore
        this.mesh.material.wireframe = this.wireframe;
    }

    public getMesh(): THREE.Mesh {
        return this.mesh;
    }
}

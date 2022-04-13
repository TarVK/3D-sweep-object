import * as THREE from "three";
import {IMesh} from "../../../sweepOperation/_types/IMesh";
import {colors} from "./ColorSchema";
import {IMateriable} from "./_types/IMateriable";

export class SweepObject extends THREE.Object3D implements IMateriable {
    protected mesh: THREE.Mesh;
    protected wireframe = false;
    protected smoothLighting = true;

    /**
     * Updates the mesh of the object
     * @param newMesh The new mesh to be set
     */
    public updateMesh(newMesh: IMesh, castShadow = true) {
        const geometry = new THREE.BufferGeometry();

        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(
                newMesh.points.flatMap(v => [v.x, v.y, v.z]),
                3
            )
        );
        geometry.setIndex(newMesh.faces.flat());

        geometry.computeVertexNormals();
        const material = new THREE.MeshStandardMaterial({
            color: colors.SWEEP_OBJECT,
            roughness: 0.8,
            metalness: 0.1,
            flatShading: !this.smoothLighting,
            wireframe: this.wireframe,
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

    public setWireframe(enabled: boolean): void {
        this.wireframe = enabled;
        //@ts-ignore
        this.mesh?.material.wireframe = enabled;
    }

    public setSmoothLighting(enabled: boolean): void {
        this.smoothLighting = enabled;
        //@ts-ignore
        this.mesh?.material.flatShading = !this.smoothLighting;
    }

    public getMesh(): THREE.Mesh {
        return this.mesh;
    }
}

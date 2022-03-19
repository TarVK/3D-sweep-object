import * as THREE from "three";
import {IMesh} from "../../sweepObject/_types/IMesh";
import {IMateriable} from "./_types/IMateriable";

export class SweepObject extends THREE.Object3D implements IMateriable {
    protected mesh: THREE.Mesh;


    /**
     * Updates the mesh of the object
     * @param newMesh The new mesh to be set
     */
    public updateMesh(newMesh: IMesh, castShadow = true) {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(
                newMesh.points.flatMap(v => [v.x, v.y, -v.z]), // Note we negate z because positive z comes towards the camera instead of away from it, which is counter intuitive
                3
            )
        );
        geometry.setIndex(
            newMesh.faces
                .map(
                    ([i1, i2, i3]) => [i2, i1, i3] // To correct for the inversion of the z-axis
                )
                .flat()
        );
        geometry.computeVertexNormals();
        const material = new THREE.MeshPhongMaterial({
            color: 0xff0000,
            // wireframe: true,
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

    public getMesh(): THREE.Mesh {
        return this.mesh;
    }
}

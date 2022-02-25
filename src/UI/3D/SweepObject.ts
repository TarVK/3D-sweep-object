import * as THREE from "three";
import {IMesh} from "../../sweepObject/_types/IMesh";
import {IMateriable} from "./_types/IMateriable";

export class SweepObject extends THREE.Object3D implements IMateriable {
    protected mesh: THREE.Mesh;

    /**
     * Updates the mesh of the object
     * @param newMesh The new mesh to be set
     */
    public updateMesh(newMesh: IMesh) {
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
    }

    public updateMaterial(material: THREE.Material): void {}
}

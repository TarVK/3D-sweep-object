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
        // TODO: turn into a proper variable with controls
        const smoothLighting = false;
        const geometry = new THREE.BufferGeometry();

        if (smoothLighting) {
            geometry.setAttribute(
                "position",
                new THREE.Float32BufferAttribute(
                    newMesh.points.flatMap(v => [v.x, v.y, v.z]),
                    3
                )
            );
            geometry.setIndex(newMesh.faces.flat());
        } else {
            // Duplicate vertices for each face, ensuring normals are computed for each face separately
            const meshVertices = newMesh.points.map(v => [v.x, v.y, v.z]);
            let count = 0;
            const vertices: number[] = [];
            const faces: number[] = [];
            for (let [i1, i2, i3] of newMesh.faces) {
                const p1 = meshVertices[i1];
                const p2 = meshVertices[i2];
                const p3 = meshVertices[i3];
                vertices.push(...p1, ...p2, ...p3);
                faces.push(count++, count++, count++);
            }

            geometry.setAttribute(
                "position",
                new THREE.Float32BufferAttribute(vertices, 3)
            );
            geometry.setIndex(faces);
            console.log(vertices, faces);
        }

        geometry.computeVertexNormals();
        const material = new THREE.MeshStandardMaterial({
            color: colors.SWEEP_OBJECT,
            roughness: 0.5,
            metalness: 0.8,
            flatShading: true,
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

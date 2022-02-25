import THREE from "three";

export type IMateriable = {
    /**
     * Changes the material
     * @param material The material to be used
     */
    updateMaterial(material: THREE.Material): void;
};

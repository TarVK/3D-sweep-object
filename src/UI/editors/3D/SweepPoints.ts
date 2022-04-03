import * as THREE from "three";
import {BezierSegmentState} from "../../../state/segments/BezierSegmentState";
import {Vec3} from "../../../util/linearAlgebra/Vec3";
import {colors} from "./ColorSchema";
import {IMateriable} from "./_types/IMateriable";

export class SweepPoints extends THREE.Object3D implements IMateriable {
    public updateMaterial(material: THREE.Material): void {}

    public points: THREE.Mesh[] = [];
    readonly pointRadius = 1;

    public constructor(visible = true) {
        super();
        this.visible = visible;
        this.layers.set(1);
    }

    public updatePoints(segments: BezierSegmentState<Vec3>[], force = false) {
        if (!force && this.points.length != 0) return;

        if (this.points && this.points.length > 0) {
            this.points.forEach(point => this.remove(point));
            this.points = [];
        }
        segments.forEach(segment => {
            const startPoint = this.createSphere(
                this.pointRadius,
                segment.getStart(),
                colors.SWEEP_POINT
            );
            const startControlPoint = this.createSphere(
                this.pointRadius,
                segment.getStartControl(),
                colors.SWEEP_POINT
            );
            const endControlPoint = this.createSphere(
                this.pointRadius,
                segment.getEndControl(),
                colors.SWEEP_POINT
            );
            this.add(startPoint, startControlPoint, endControlPoint);
            this.points.push(startPoint, startControlPoint, endControlPoint);
        });
        if (segments.length > 0) {
            const lastSegment = segments[segments.length - 1];
            const endPoint = this.createSphere(
                this.pointRadius,
                lastSegment.getEnd(),
                colors.SWEEP_POINT
            );
            this.add(endPoint);
            this.points.push(endPoint);
        }
    }

    private createSphere(radius: number, position: Vec3, color: number) {
        const geometry = new THREE.SphereGeometry(radius, 32, 32);
        const material = new THREE.MeshBasicMaterial({color: color});
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.copy(position.toThreeJsVector());
        sphere.layers.set(1);
        return sphere;
    }
}

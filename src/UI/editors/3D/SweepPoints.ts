import * as THREE from "three";
import {BezierSegmentState} from "../../../state/BezierSegmentState";
import {Vec3} from "../../../util/Vec3";
import {IMateriable} from "./_types/IMateriable";

export class SweepPoints extends THREE.Object3D implements IMateriable {
    public updateMaterial(material: THREE.Material): void {}

    public points: THREE.Mesh[] = [];
    readonly pointRadius = 0.5;

    public updatePoints(segments: BezierSegmentState<Vec3>[], initialize = true) {
        if (initialize && this.points.length != 0) return;

        if (this.points && this.points.length > 0) {
            this.points.forEach(point => this.remove(point));
            this.points = [];
        }
        this.visible = true;
        segments.forEach(segment => {
            const startPoint = this.createSphere(
                this.pointRadius,
                segment.getStart(),
                0x00ff00
            );
            const startControlPoint = this.createSphere(
                this.pointRadius,
                segment.getStartControl(),
                0x00ff00
            );
            const endControlPoint = this.createSphere(
                this.pointRadius,
                segment.getEndControl(),
                0x00ff00
            );
            this.add(startPoint, startControlPoint, endControlPoint);
            this.points.push(startPoint, startControlPoint, endControlPoint);
        });
        if (segments.length > 0) {
            const lastSegment = segments[segments.length - 1];
            const endPoint = this.createSphere(
                this.pointRadius,
                lastSegment.getEnd(),
                0x00ff00
            );
            this.add(endPoint);
            this.points.push(endPoint);
        }
    }

    private createSphere(radius: number, position: Vec3, color = 0x000000) {
        const geometry = new THREE.SphereGeometry(radius, 32, 32);
        const material = new THREE.MeshBasicMaterial({color: color});
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.copy(position.toThreeJsVector());
        sphere.layers.set(1);
        return sphere;
    }

    public getPointsAsBezierSegments() {
        const segments: BezierSegmentState<Vec3>[] = [];
        for (let i = 0; i < this.points.length - 1; i += 3) {
            segments.push(
                new BezierSegmentState<Vec3>(
                    this.threeVectorToVec3(this.points[i].position),
                    this.threeVectorToVec3(this.points[i + 1].position),
                    this.threeVectorToVec3(this.points[i + 2].position),
                    this.threeVectorToVec3(this.points[i + 3].position)
                )
            );
        }

        return segments;
    }

    private threeVectorToVec3(vec: THREE.Vector3) {
        return new Vec3(vec.x, vec.y, vec.z);
    }
}

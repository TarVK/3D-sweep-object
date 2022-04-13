import * as THREE from "three";
import {BezierSegmentState} from "../../../state/segments/BezierSegmentState";
import {Vec3} from "../../../util/linearAlgebra/Vec3";
import {colors} from "./ColorSchema";
import {IMateriable} from "./_types/IMateriable";

export class SweepLine extends THREE.Object3D implements IMateriable {
    readonly nrOfDivisions = 50;

    protected lines: THREE.Line[] = [];

    public constructor(visible = true) {
        super();
        this.visible = visible;
        this.layers.set(1);
    }

    public updateMaterial(material: THREE.Material): void {}

    public updateLine(segments: BezierSegmentState<Vec3>[], skipControlLines: boolean) {
        if (this.lines && this.lines.length > 0) {
            this.lines.forEach(line => this.remove(line));
            this.lines = [];
        }

        segments.forEach(segment => {
            const start = segment.getStart();
            const startControl = segment.getStartControl();
            const endControl = segment.getEndControl();
            const end = segment.getEnd();

            const curve = new THREE.CubicBezierCurve3(
                start.toThreeJsVector(),
                startControl.toThreeJsVector(),
                endControl.toThreeJsVector(),
                end.toThreeJsVector()
            );
            const points = curve.getPoints(this.nrOfDivisions);
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({color: colors.SWEEP_LINE});
            const curveLine = new THREE.Line(geometry, material);

            curveLine.layers.set(1);

            this.add(curveLine);
            this.lines.push(curveLine);
            if (skipControlLines) return;

            const helperLine1 = this.createStraightLine(
                start,
                startControl,
                colors.SWEEP_LINE_HELPER
            );
            const helperLine2 = this.createStraightLine(
                end,
                endControl,
                colors.SWEEP_LINE_HELPER
            );

            this.add(helperLine1);
            this.lines.push(helperLine1);

            this.add(helperLine2);
            this.lines.push(helperLine2);
        });
    }

    private createStraightLine(start: Vec3, end: Vec3, color: number) {
        const geometry = new THREE.BufferGeometry();
        const points = [start.x, start.y, start.z, end.x, end.y, end.z];
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
        geometry.setDrawRange(0, 2);
        const material = new THREE.LineBasicMaterial({color: color});
        const line = new THREE.Line(geometry, material);
        line.layers.set(1);
        return line;
    }
}

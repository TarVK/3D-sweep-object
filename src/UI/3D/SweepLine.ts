import * as THREE from "three";
import { BezierSegmentState } from "../../state/BezierSegmentState";
import { Vec3 } from "../../util/Vec3";
import {IMateriable} from "./_types/IMateriable";

export class SweepLine extends THREE.Object3D implements IMateriable {
    readonly nrOfDivisions = 50;
    protected lines: THREE.Line[] = [];

    public updateMaterial(material: THREE.Material): void {}

    public updateLine(segments: BezierSegmentState<Vec3>[], updatePoints = true){
        if(this.lines && this.lines.length>0){
            this.lines.forEach(line => this.remove(line));
            this.lines = [];
        }

        segments.forEach(segment => {
            const curve = new THREE.CubicBezierCurve3(
                segment.getStart().toThreeJsVector(),
                segment.getStartControl().toThreeJsVector(),
                segment.getEndControl().toThreeJsVector(),
                segment.getEnd().toThreeJsVector()
            );
            const points = curve.getPoints( this.nrOfDivisions );
            const geometry = new THREE.BufferGeometry().setFromPoints( points );
            const material = new THREE.LineBasicMaterial( { color: 0x000000 } );
            const curveLine = new THREE.Line( geometry, material );

            this.add(curveLine);
            this.lines.push(curveLine)
        });
    }
}

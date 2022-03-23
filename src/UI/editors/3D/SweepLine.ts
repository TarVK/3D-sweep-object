import * as THREE from "three";
import { BezierSegmentState } from "../../../state/BezierSegmentState";
import { Vec3 } from "../../../util/Vec3";
import {IMateriable} from "./_types/IMateriable";

export class SweepLine extends THREE.Object3D implements IMateriable {
    readonly nrOfDivisions = 50;
    readonly lineColor = 0x000000;
    readonly helperLineColor = 0x00cccc;
    protected lines: THREE.Line[] = [];

    public updateMaterial(material: THREE.Material): void {}

    public constructor(visible = true){
        super();
        this.visible = visible;
    }

    public updateLine(segments: BezierSegmentState<Vec3>[]){
        if(this.lines && this.lines.length>0){
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
            const points = curve.getPoints( this.nrOfDivisions );
            const geometry = new THREE.BufferGeometry().setFromPoints( points );
            const material = new THREE.LineBasicMaterial({ color: this.lineColor, depthTest: true });
            const curveLine = new THREE.Line( geometry, material );

            this.add(curveLine);
            this.lines.push(curveLine)


            const helperLine1 = this.createHelperLine(start, startControl, this.helperLineColor);
            const helperLine2 = this.createHelperLine(end, endControl, this.helperLineColor);
            
            this.add(helperLine1);
            this.lines.push(helperLine1);
            
            this.add(helperLine2);
            this.lines.push(helperLine2);
        });
    }

    private createHelperLine(start: Vec3, end: Vec3, color: number, depthTest=true){
        var geometry = new THREE.BufferGeometry();
        const points = [start.x, start.y, start.z, end.x, end.y, end.z];
        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( points, 3 ) );
        geometry.setDrawRange(0, 2);
        var material = new THREE.LineBasicMaterial({ color: color, depthTest: depthTest });
        return new THREE.Line( geometry,  material );
    }
}

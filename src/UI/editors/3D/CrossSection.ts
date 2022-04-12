import * as THREE from "three";
import {BezierSegmentState} from "../../../state/segments/BezierSegmentState";
import {StraightSegmentState} from "../../../state/segments/StraightSegmentState";
import {ArcSegmentState} from "../../../state/segments/ArcSegmentState";
import {ISegment} from "../../../state/_types/ISegment";
import {Vec2} from "../../../util/linearAlgebra/Vec2";
import {colors} from "./ColorSchema";
import {IMateriable} from "./_types/IMateriable";

export class CrossSection extends THREE.Object3D implements IMateriable {
    public updateMaterial(material: THREE.Material): void {}

    public updateCrossSection(segments: ISegment<Vec2>[]) {
        const material = new THREE.LineBasicMaterial({color: colors.SWEEP_LINE});

        this.remove(...this.children);
        // const crossSectionShape = new THREE.Shape();
        // const material = new THREE.LineBasicMaterial({color: colors.SWEEP_LINE});

        segments.forEach(segment => {
            const addStraightLine = () => {
                const start = segment.getStart();
                const end = segment.getEnd();

                const points = [
                    new THREE.Vector3(start.x, start.y, 0),
                    new THREE.Vector3(end.x, end.y, 0),
                ];
                const geometry = new THREE.BufferGeometry().setFromPoints(points);

                const straightObject = new THREE.Line(geometry, material);
                this.add(straightObject);
            };

            if (segment instanceof BezierSegmentState) {
                const start = segment.getStart();
                const end = segment.getEnd();
                const startControl = segment.getStartControl();
                const endControl = segment.getEndControl();

                const curve = new THREE.CubicBezierCurve3(
                    new THREE.Vector3(start.x, start.y, 0),
                    new THREE.Vector3(startControl.x, startControl.y, 0),
                    new THREE.Vector3(endControl.x, endControl.y, 0),
                    new THREE.Vector3(end.x, end.y, 0)
                );

                const points = curve.getPoints(50);
                const geometry = new THREE.BufferGeometry().setFromPoints(points);

                // Create the final object to add to the scene
                const curveObject = new THREE.Line(geometry, material);
                this.add(curveObject);
            } else if (segment instanceof StraightSegmentState) {
                addStraightLine();
            } else if (segment instanceof ArcSegmentState) {
                const spec = segment.getSpec();

                if (!spec.origin) {
                    addStraightLine();
                    return;
                }

                const {delta, origin, start, radius} = spec;

                const curve = new THREE.EllipseCurve(
                    origin.x,
                    origin.y,
                    radius,
                    radius,
                    start,
                    start + delta,
                    delta < 0,
                    0
                );

                const points = curve.getPoints(50);
                const geometry = new THREE.BufferGeometry().setFromPoints(points);

                // Create the final object to add to the scene
                const ellipse = new THREE.Line(geometry, material);
                this.add(ellipse);
            }
        });
    }
}

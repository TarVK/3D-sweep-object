import * as THREE from "three";
import {BezierSegmentState} from "../../../state/segments/BezierSegmentState";
import {StraightSegmentState} from "../../../state/segments/StraightSegmentState";
import {ArcSegmentState} from "../../../state/segments/ArcSegmentState";
import {ISegment} from "../../../state/_types/ISegment";
import {Vec2} from "../../../util/linearAlgebra/Vec2";
import {colors} from "./ColorSchema";
import {IMateriable} from "./_types/IMateriable";
import {Mat4} from "../../../util/linearAlgebra/Mat4";
import {CrossSectionState} from "../../../state/CrossSectionState";
import {IDataHook, Observer} from "model-react";

export class CrossSection extends THREE.Object3D implements IMateriable {
    protected crossSectionObserver: Observer<void>;
    protected material = new THREE.LineBasicMaterial({color: colors.SWEEP_LINE});
    protected state: CrossSectionState;

    public constructor(state: CrossSectionState) {
        super();
        this.state = state;
        this.crossSectionObserver = new Observer(h => this.updateCrossSection(h)).listen(
            () => {}
        );
    }

    public updateMaterial(material: THREE.Material): void {}

    public setSelected(selected: boolean): void {
        this.material = selected
            ? // TODO: add proper color
              new THREE.LineBasicMaterial({color: 0x00ff00})
            : new THREE.LineBasicMaterial({color: colors.SWEEP_LINE});

        this.updateCrossSection();
    }

    protected updateCrossSection(hook?: IDataHook): void {
        const segments = this.state.getSegments(hook);

        this.remove(...this.children);

        const addLine = (geometry: THREE.BufferGeometry) => {
            const line = new THREE.Line(geometry, this.material);
            line.layers.set(1);
            this.add(line);
        };

        segments.forEach(segment => {
            const addStraightLine = () => {
                const start = segment.getStart(hook);
                const end = segment.getEnd(hook);

                const points = [
                    new THREE.Vector3(start.x, start.y, 0),
                    new THREE.Vector3(end.x, end.y, 0),
                ];
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                addLine(geometry);
            };

            if (segment instanceof BezierSegmentState) {
                const start = segment.getStart(hook);
                const end = segment.getEnd(hook);
                const startControl = segment.getStartControl(hook);
                const endControl = segment.getEndControl(hook);

                const curve = new THREE.CubicBezierCurve3(
                    new THREE.Vector3(start.x, start.y, 0),
                    new THREE.Vector3(startControl.x, startControl.y, 0),
                    new THREE.Vector3(endControl.x, endControl.y, 0),
                    new THREE.Vector3(end.x, end.y, 0)
                );

                const points = curve.getPoints(50);
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                addLine(geometry);
            } else if (segment instanceof StraightSegmentState) {
                addStraightLine();
            } else if (segment instanceof ArcSegmentState) {
                const spec = segment.getSpec(hook);

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
                addLine(geometry);
            }
        });
    }

    public setTransformation(t: Mat4): void {
        // ThreeJS uses column major order
        const vals = [
            t.a11,
            t.a21,
            t.a31,
            t.a41,
            t.a12,
            t.a22,
            t.a32,
            t.a42,
            t.a13,
            t.a23,
            t.a33,
            t.a43,
            t.a14,
            t.a24,
            t.a34,
            t.a44,
        ];
        this.matrix.fromArray(vals);
        this.matrixAutoUpdate = false;
    }

    public destroy(): void {
        this.crossSectionObserver.destroy();
    }
}

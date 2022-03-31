import * as THREE from "three";
import {BezierSegmentState} from "../../../state/segments/BezierSegmentState";
import {Vec3} from "../../../util/Vec3";

export default (sweepPointsContainer: {points: THREE.Object3D[]}) => {
    const getSweepPoints = () => sweepPointsContainer.points;

    const threeVectorToVec3 = (vec: THREE.Vector3) => {
        return new Vec3(vec.x, vec.y, vec.z);
    };
    const distanceFromPointToLineSegment = (
        point: THREE.Vector3,
        A: THREE.Vector3,
        B: THREE.Vector3
    ) => {
        const line = new THREE.Line3();
        const closestPoint = new THREE.Vector3();
        line.set(A, B).closestPointToPoint(point, true, closestPoint);
        return point.distanceTo(closestPoint);
    };
    const createBezierSegment = (
        start: THREE.Vector3,
        end: THREE.Vector3,
        startControl: false | THREE.Vector3 = false,
        endControl: false | THREE.Vector3 = false
    ) => {
        // const fourth = start.clone().add(end).multiplyScalar(0.25);
        let fourth = new THREE.Vector3(0, 5, 0);
        const scale = 0.5;
        if (startControl) {
            fourth = startControl.clone().sub(start).multiplyScalar(scale);
        } else if (endControl) {
            fourth = endControl.clone().sub(end).multiplyScalar(-scale);
        }
        return new BezierSegmentState(
            threeVectorToVec3(start),
            threeVectorToVec3(startControl ? startControl : start.clone().add(fourth)),
            threeVectorToVec3(endControl ? endControl : end.clone().sub(fourth)),
            threeVectorToVec3(end)
        );
    };

    const getSweeplineAsBezierSegments = (points: THREE.Object3D[] | null = null) => {
        if (!points) {
            points = getSweepPoints();
        }
        const segments: BezierSegmentState<Vec3>[] = [];
        for (let i = 0; i < points.length - 1; i += 3) {
            segments.push(
                new BezierSegmentState<Vec3>(
                    threeVectorToVec3(points[i].position),
                    threeVectorToVec3(points[i + 1].position),
                    threeVectorToVec3(points[i + 2].position),
                    threeVectorToVec3(points[i + 3].position)
                )
            );
        }

        return segments;
    };

    const addPointToSweepline = (pointVec: THREE.Vector3) => {
        const segments = getSweeplineAsBezierSegments();

        let min = Infinity;
        let index = 0;
        for (var i = 0; i < segments.length; i++) {
            const curr = segments[i].getStart().toThreeJsVector();
            const next = segments[i].getEnd().toThreeJsVector();
            const dist = distanceFromPointToLineSegment(pointVec, curr, next);

            if (dist < min) {
                min = dist;
                index = i;
            }
        }
        const distToFirstPoint = pointVec.distanceTo(
            segments[0].getStart().toThreeJsVector()
        );
        const distToLastPoint = pointVec.distanceTo(
            segments.at(-1)!.getEnd().toThreeJsVector()
        );
        if (distToFirstPoint <= min && distToFirstPoint < distToLastPoint) {
            // we are before the first point

            const start = pointVec;
            const end = segments[0].getStart().toThreeJsVector();
            segments.splice(0, 0, createBezierSegment(start, end));
        } else if (distToLastPoint <= min) {
            // we are after the last point

            const start = segments.at(-1)!.getEnd().toThreeJsVector();
            const end = pointVec;
            segments.push(createBezierSegment(start, end));
        } else {
            // we are between points

            const start = segments[index].getStart().toThreeJsVector();
            const startControl = segments[index].getStartControl().toThreeJsVector();
            const mid = pointVec;
            const endControl = segments[index].getEndControl().toThreeJsVector();
            const end = segments[index].getEnd().toThreeJsVector();
            segments.splice(
                index,
                1,
                createBezierSegment(start, mid, startControl, false),
                createBezierSegment(mid, end, false, endControl)
            );
        }

        return segments;
    };

    const deletePointFromSweepline = (pointObj: THREE.Object3D) => {
        const points = getSweepPoints().map(p => p.clone());
        for (let i = 0; i < points.length; i++) {
            if (points[i].position.equals(pointObj.position)) {
                if (i == 0 && points.length > 4) {
                    points.splice(0, 3);
                } else if (i == points.length - 1 && points.length > 4) {
                    points.splice(i - 2, 3);
                } else if (i % 3 == 0 && points.length > 4) {
                    points.splice(i - 1, 3);
                } else if (i % 3 == 1) {
                    points[i].position.copy(points[i - 1].position);
                } else if (i % 3 == 2) {
                    points[i].position.copy(points[i + 1].position);
                }

                break;
            }
        }
        const segments = getSweeplineAsBezierSegments(points);
        return segments;
    };

    return {addPointToSweepline, deletePointFromSweepline, getSweeplineAsBezierSegments};
};

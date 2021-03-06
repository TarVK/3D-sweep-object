import * as THREE from "three";
import {BezierSegmentState} from "../../../state/segments/BezierSegmentState";
import {Vec3} from "../../../util/linearAlgebra/Vec3";

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

    const addPointToSweepline = (
        segments: BezierSegmentState<Vec3>[],
        pointVec: THREE.Vector3
    ) => {
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
            const newSegments = segments[index].split(threeVectorToVec3(pointVec));
            segments.splice(
                index,
                1,
                ...(newSegments as unknown as BezierSegmentState<Vec3>[])
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
                    break;
                } else if (i == points.length - 1 && points.length > 4) {
                    points.splice(i - 2, 3);
                    break;
                } else if (i % 3 == 0 && points.length > 4) {
                    points.splice(i - 1, 3);
                    break;
                } else if (i % 3 == 1) {
                    points[i].position.copy(points[i - 1].position);
                } else if (i % 3 == 2) {
                    points[i].position.copy(points[i + 1].position);
                }
            }
        }
        const segments = getSweeplineAsBezierSegments(points);
        return segments;
    };

    const movePointFromSweepline = (
        segments: BezierSegmentState<Vec3>[],
        pointObj: THREE.Object3D,
        sync = true,
        move = true
    ) => {
        const points = getSweepPoints();
        const pointIndex = points.indexOf(pointObj);

        let segmentIndex: number;
        if (pointIndex == points.length - 1) {
            const segment = segments.at(-1)!;
            segmentIndex = segments.length - 1;
            segment.setEnd(threeVectorToVec3(pointObj.position));
            points.at(-2)!.position.copy(segment.getEndControl().toThreeJsVector());
            points.at(-3)!.position.copy(segment.getStartControl().toThreeJsVector());
        } else {
            segmentIndex = Math.floor(pointIndex / 3);
            const segment = segments[segmentIndex];
            const prevSegment = segments[segmentIndex - 1];
            const nextSegment = segments[segmentIndex + 1];

            switch (pointIndex % 3) {
                case 0:
                    segment.setStart(threeVectorToVec3(pointObj.position), sync, move);
                    points
                        .at(pointIndex + 1)
                        ?.position.copy(segment.getStartControl().toThreeJsVector());
                    if (prevSegment) {
                        points
                            .at(pointIndex - 1)
                            ?.position.copy(
                                prevSegment.getEndControl().toThreeJsVector()
                            );
                    }
                    break;
                case 1:
                    segment.setStartControl(threeVectorToVec3(pointObj.position), sync);
                    if (prevSegment) {
                        points
                            .at(pointIndex - 2)
                            ?.position.copy(
                                prevSegment.getEndControl().toThreeJsVector()
                            );
                    }
                    break;
                case 2:
                    segment.setEndControl(threeVectorToVec3(pointObj.position), sync);
                    if (nextSegment) {
                        points
                            .at(pointIndex + 2)
                            ?.position.copy(
                                nextSegment.getStartControl().toThreeJsVector()
                            );
                    }
                    break;
            }
        }

        return segments;
    };

    return {
        addPointToSweepline,
        deletePointFromSweepline,
        getSweeplineAsBezierSegments,
        movePointFromSweepline,
    };
};

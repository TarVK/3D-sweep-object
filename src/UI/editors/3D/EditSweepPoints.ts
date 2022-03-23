import * as THREE from "three";
import { BezierSegmentState } from "../../../state/BezierSegmentState";
import { Vec3 } from "../../../util/Vec3";
import { SweepPoints } from "./SweepPoints";

export class EditSweepPoints{
    private sweepPoints: SweepPoints;

    constructor(sp: SweepPoints){
        this.sweepPoints = sp;
    }
    
    private distanceFromPointToLineSegment = (point: THREE.Vector3, A: THREE.Vector3, B: THREE.Vector3) => {
        const line = new THREE.Line3();
        const closestPoint = new THREE.Vector3();
        line.set(A, B).closestPointToPoint( point, true, closestPoint);
        return point.distanceTo(closestPoint);
    }
    private createBezierSegment = (start: THREE.Vector3, end: THREE.Vector3) => {
        // const fourth = start.clone().add(end).multiplyScalar(0.25);
        const fourth = new THREE.Vector3(0, 0, 5);
        return new BezierSegmentState(
            this.threeVectorToVec3(start),
            this.threeVectorToVec3(start.clone().add(fourth)),
            this.threeVectorToVec3(end.clone().sub(fourth)),
            this.threeVectorToVec3(end)
        )
    }


    public addPoint(point: THREE.Vector3){
        const segments = this.sweepPoints.getPointsAsBezierSegments();

        let min = Infinity;
        let index = 0;
        for (var i= 0; i< segments.length; i++) {
            const curr = segments[i].getStart().toThreeJsVector();
            const next = segments[i].getEnd().toThreeJsVector();
            const dist = this.distanceFromPointToLineSegment(point, curr, next);

            if(dist < min){
                min = dist;
                index = i;
            }
        }
        const distToFirstPoint = point.distanceTo(segments[0].getStart().toThreeJsVector());
        const distToLastPoint = point.distanceTo(segments.at(-1)!.getStart().toThreeJsVector());

        if(distToFirstPoint <= min && distToFirstPoint < distToLastPoint){
            // we are before the first point
            
            const start = point;
            const end = segments[0].getStart().toThreeJsVector();
            segments.splice(0, 0, this.createBezierSegment(start, end));
        }else if(distToLastPoint <= min){
            // we are after the last point

            const start = segments.at(-1)!.getEnd().toThreeJsVector();
            const end = point;
            segments.push(this.createBezierSegment(start, end));
        }else{
            // we are between points with
            // index and index + 3
            
            const start = segments[index].getStart().toThreeJsVector();
            const mid = point;
            const end = segments[index].getEnd().toThreeJsVector();
            segments.splice(index, 1, this.createBezierSegment(start, mid), this.createBezierSegment(mid, end));
        }
        this.sweepPoints.updatePoints(segments, true);
        
        return segments;
    }

    
    public deletePoint(point: THREE.Object3D){
        const points = this.sweepPoints.points;
        for(let i=0; i<points.length; i++){
            if(points[i] == point){
                if(i%3 == 0 || i == points.length-1){
                    // a start/end point
                    if(points.length > 4) points.splice(i-1, 3);
                    break;
                }
                // a control point
                if(i%3==1) point.position.copy(points[i-1].position)
                else if(i%3==2) point.position.copy(points[i+1].position)
                break;
            }
        }
        const segments = this.sweepPoints.getPointsAsBezierSegments();
        this.sweepPoints.updatePoints(segments, true);
        return segments;
    }
    
    private threeVectorToVec3(vec: THREE.Vector3){
        return new Vec3(vec.x, vec.y, vec.z);
    }
} 
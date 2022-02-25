import {Point3D, Translate} from "../util/Point3D";
import {Vec3} from "../util/Vec3";
import {createRotationMatrix} from "./createRotationMatrix";
import {ICrossSection} from "./_types/ICrossSection";

/**
 * Transforms the cross section to be oriented in the given direction
 * @param crossSection The cross-section to be transformed into 3d points
 * @param dir The orientation direction
 * @param origin The origin to place the cross section at
 * @returns The cross section's points in 3d space
 */
export function transformCrossSection(
    crossSection: ICrossSection,
    dir: Vec3,
    origin: Vec3
): Vec3[] {
    const rotation = createRotationMatrix(dir);
    const transform = Translate(origin).mul(rotation);
    return crossSection.map(point =>
        transform.mul(new Point3D(point.x, point.y, 0)).toCartesian()
    );
}

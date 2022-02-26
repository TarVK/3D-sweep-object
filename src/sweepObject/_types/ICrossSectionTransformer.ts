import {Point3D} from "../../util/Point3D";
import {Vec3} from "../../util/Vec3";
import {ICrossSection} from "./ICrossSection";

/**
 * A function that can transform a given cross section into a point list with the correct rotation and position
 * @param crossSection The cross section to be transformed
 * @param dir The direction to point the cross section in
 * @param origin The position to place the cross section at
 * @returns The points of the cross section with the transformation applied
 */
export type ICrossSectionTransformer = (
    crossSection: Point3D[],
    dir: Vec3,
    origin: Vec3
) => Vec3[];

import {Vec3} from "../../../util/linearAlgebra/Vec3";
import {ICrossSectionNode} from "./ICrossSectionNode";

/**
 * A function that can transform a given cross section into a point list with the correct rotation and position
 * @param node The node with the new node's data
 * @param skipUpdate Whether to skip updating the internal state which is used to obtain the transformation for the next matrix
 * @returns The points of the cross section with the transformation applied
 */
export type ICrossSectionTransformer = (
    node: ICrossSectionNode,
    skipUpdate?: boolean
) => Vec3[];

import {Mat4} from "../../../util/linearAlgebra/Mat4";
import {ICrossSectionNode} from "./ICrossSectionNode";

/**
 * A function that can obtain a sequence of rotationally consistent transformation matrices that point the z-axis in a given direction, and position the origin at a given point
 * @param node The node with the new node's data
 * @param skipUpdate Whether to skip updating the internal state which is used to obtain the transformation for the next matrix
 * @returns The derived transformation matrix
 */
export type IMatrixTransformer = (
    spec: Omit<ICrossSectionNode, "crossSection">,
    skipUpdate?: boolean
) => Mat4;

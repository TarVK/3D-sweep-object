import {Mat4} from "../../../util/linearAlgebra/Mat4";
import {createMatrixTransformer} from "../../../sweepOperation/core/createMatrixTransformer";
import {ICrossSectionPositionNode} from "../../../sweepOperation/core/_types/ICrossSectionPositionNode";
import {SweepLineState} from "../../../state/SweepLineState";
import {IDataHook} from "model-react";

/**
 * Retrieves the transformation matrices for positioning something at the given positions along the sweep line
 * @param sweepLine The sweep line specification
 * @param positions The positions for which to retrieve the transformation matrices, in ascending sorted order
 * @param sweepLineSampleCount: The number of points that are used to approximate the sweep line
 * @param hook The hook to subscribe to changes
 * @returns The transformation matrices
 */
export function getSweepLineTransformationMatrices(
    sweepLine: SweepLineState,
    positions: ICrossSectionPositionNode[],
    sweepLineSampleCount: number,
    hook?: IDataHook
): Mat4[] {
    const output: Mat4[] = [];

    const remainingPositions = [...positions];
    const sweepNodes = sweepLine.sample(sweepLineSampleCount, hook);

    const getTransform = createMatrixTransformer();

    for (let i = 0; i < sweepLineSampleCount; i++) {
        const sweepNode = sweepNodes[i];
        const per = i / (sweepLineSampleCount - 1);

        // Update the internal state
        getTransform({...sweepNode, angle: 0, scale: 1});

        const nextPosition = remainingPositions[0];
        if (nextPosition && per >= nextPosition.position) {
            const node = sweepLine.getNode(nextPosition.position);
            const transform = getTransform({...nextPosition, ...node}, true);
            output.push(transform);

            remainingPositions.shift();
        }
    }

    return output;
}

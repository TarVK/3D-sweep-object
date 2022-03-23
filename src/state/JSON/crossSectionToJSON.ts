import {IDataHook} from "model-react";
import {CrossSectionState} from "../CrossSectionState";
import {segmentToJSON} from "./segmentToJSON";
import {ICrossSectionJSON} from "./_types/ICrossSectionJSON";

/**
 * Transforms a given cross section state into a plain JSON representation
 * @param crossSection The cross section to be transformed to JSON
 * @param hook The hook to subscribe to changes
 * @returns The pure JSON representation of the cross section
 */
export function crossSectionToJSON(
    crossSection: CrossSectionState,
    hook?: IDataHook
): ICrossSectionJSON {
    const segments = crossSection
        .getSegments(hook)
        .map(segment => segmentToJSON(segment, hook));
    return {
        angle: crossSection.getRotation(hook),
        position: crossSection.getPosition(hook),
        scale: crossSection.getScale(hook),
        segments,
    };
}

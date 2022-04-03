import {Vec3} from "../../../util/linearAlgebra/Vec3";
import {ICrossSection} from "./ICrossSection";

export type ICrossSectionNode = {
    /** The 2d cross section to be placed */
    crossSection: ICrossSection;
    /** The position of the origin of the cross section in 3d space */
    position: Vec3;
    /** The direction to face the normal of the cross section towards */
    direction: Vec3;
    /** The amount to scale this cross section by */
    scale: number;
    /** The rotation of this cross section along the remaining axis */
    angle: number;
};

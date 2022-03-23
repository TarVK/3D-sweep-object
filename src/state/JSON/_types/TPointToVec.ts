import {Vec2} from "../../../util/Vec2";
import {Vec3} from "../../../util/Vec3";
import {I2DPointJSON} from "./I2DPointJSON";
import {I3DPointJSON} from "./I3DPointJSON";

/** Transforms the given JSON point type to a vector type */
export type TPointToVec<P extends I2DPointJSON | I3DPointJSON> = P extends I3DPointJSON
    ? Vec3
    : Vec2;

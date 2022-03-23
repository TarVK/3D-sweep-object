import {Vec2} from "../../../util/Vec2";
import {Vec3} from "../../../util/Vec3";
import {I2DPointJSON} from "./I2DPointJSON";
import {I3DPointJSON} from "./I3DPointJSON";

/** Transforms the given vector type to a JSON point type */
export type TVecToPoint<P extends Vec2 | Vec3> = P extends Vec3
    ? I3DPointJSON
    : I2DPointJSON;

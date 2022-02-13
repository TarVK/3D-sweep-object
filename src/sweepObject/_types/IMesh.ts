import {Vec3} from "../../util/Vec3";

/** The data specifying a 3d mesh */
export type IMesh = {
    /** The points of the mesh */
    points: Vec3[];
    /** The faces of the mesh, using the specified points */
    faces: IFace[];
};

export type IFace = [
    /** The index of the first point of the triangle */
    number,
    /** The index of the second point of the triangle */
    number,
    /** The index of the third point of the triangle */
    number
];

// import {Point3D} from "../../util/linearAlgebra/Point3D";
// import {Vec3} from "../../util/linearAlgebra/Vec3";
// import {createRotationMatrix} from "../createRotationMatrix";

// describe("createRotationMatrix", () => {
//     it("Properly maps the (0, 0, 1) point", () => {
//         const direction = new Vec3(2.3, 3.5, 2.4).normalize();

//         const matrix = createRotationMatrix(direction);

//         const point = new Point3D(0, 0, 1);
//         const mapped = matrix.mul(point).toCartesian();

//         const r = (val: number) => val.toFixed(7);
//         expect({x: r(mapped.x), y: r(mapped.y), z: r(mapped.z)}).toEqual({
//             x: r(direction.x),
//             y: r(direction.y),
//             z: r(direction.z),
//         });
//     });
// });

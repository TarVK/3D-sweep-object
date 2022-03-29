import {Vec2} from "../../util/Vec2";
import {Vec3} from "../../util/Vec3";
import {ArcSegmentState} from "../segments/ArcSegmentState";
import {BezierSegmentState} from "../segments/BezierSegmentState";
import {StraightSegmentState} from "../segments/StraightSegmentState";
import {ISegment} from "../_types/ISegment";
import {Or, VLiteral, VNumber, VObject} from "./verifier/verifiers";
import {IVerifier} from "./verifier/_types/IVerifier";
import {I2DPointJSON} from "./_types/I2DPointJSON";
import {I3DPointJSON} from "./_types/I3DPointJSON";
import {IArcJSON} from "./_types/IArcJSON";
import {IBezierJSON} from "./_types/IBezierJSON";
import {IImportResult} from "./_types/IImportResult";
import {IJSON} from "./_types/IJSON";
import {ISegmentJSON} from "./_types/ISegmentJSON";
import {TPointToVec} from "./_types/TPointToVec";

/**
 * Tries to import the given JSON segment
 * @param json The json data to be converted
 * @param dimensionality Whether the segment is supposed to be 2 or 3 dimensional
 * @returns Either the segment state or an error
 */
export function JSONToSegment(
    json: IJSON,
    dimensionality: 2 | 3
): IImportResult<ISegment<typeof dimensionality extends 2 ? Vec2 : Vec3>> {
    const verification = VSegment(dimensionality)(json);
    if ("errors" in verification) return verification;

    return {result: segmentJSONToSegment(verification.result) as ISegment<Vec2 & Vec3>};
}

/**
 * Converts JSON segments to a segment state
 * @param json The JSON representing the segment
 * @returns The created segment state
 */
export function segmentJSONToSegment<P extends I2DPointJSON | I3DPointJSON>(
    json: ISegmentJSON<P>
): ISegment<TPointToVec<P>> {
    if (json.type == "bezier") return bezierJSONToBezier(json);
    /** Only supported for 2d lines currently */
    if (json.type == "arc" && !("z" in json.start)) {
        const gp = (v: I2DPointJSON) => getPoint(v) as Vec2;
        return new ArcSegmentState(
            gp(json.start),
            gp(json.control),
            gp(json.end)
        ) as any as ISegment<TPointToVec<P>>;
    }
    return new StraightSegmentState(getPoint(json.start), getPoint(json.end)) as any;
}

/**
 * Converts JSON beziers to a bezier state
 * @param json The JSON representing the bezier curve
 * @returns The created bezier state
 */
export function bezierJSONToBezier<P extends I2DPointJSON | I3DPointJSON>(
    json: IBezierJSON<P>
): BezierSegmentState<TPointToVec<P>> {
    return new BezierSegmentState(
        getPoint(json.start),
        getPoint(json.startControl),
        getPoint(json.endControl),
        getPoint(json.end)
    ) as any;
}

/**
 * Converts a JSON point to a vector
 * @param point The point to get the vector of
 * @returns The created vector
 */
const getPoint = (point: I2DPointJSON | I3DPointJSON): Vec2 | Vec3 => {
    if ("z" in point) return new Vec3(point.x, point.y, point.z);
    return new Vec2(point.x, point.y);
};

/**
 * Creates a segment JSON verifier
 * @param dimensionality The dimensionality of the segment
 * @returns The segment verifier
 */
export const VSegment = (
    dimensionality: 2 | 3
): IVerifier<
    ISegmentJSON<typeof dimensionality extends 2 ? I2DPointJSON : I3DPointJSON>
> => {
    const pointVerifier = VPoint(dimensionality);
    const straightLineVerifier = VObject({
        type: VLiteral("straight" as const),
        start: pointVerifier,
        end: pointVerifier,
    });
    const verifier = Or(
        VBezier(dimensionality),
        straightLineVerifier,
        VArc(dimensionality)
    );
    return verifier as any;
};

/**
 * Creates a point JSON verifier
 * @param dimensionality The dimensionality of the point
 * @returns The point verifier
 */
export const VPoint = (
    dimensionality: 2 | 3
): IVerifier<typeof dimensionality extends 2 ? I2DPointJSON : I3DPointJSON> =>
    (dimensionality == 2
        ? VObject({
              x: VNumber(),
              y: VNumber(),
          })
        : VObject({
              x: VNumber(),
              y: VNumber(),
              z: VNumber(),
          })) as IVerifier<typeof dimensionality extends 2 ? I2DPointJSON : I3DPointJSON>;

/**
 * Creates a bezier curve JSON verifier
 * @param dimensionality The dimensionality of the points of the curve
 * @returns The bezier verifier
 */
export const VBezier = (
    dimensionality: 2 | 3
): IVerifier<
    IBezierJSON<typeof dimensionality extends 2 ? I2DPointJSON : I3DPointJSON>
> => {
    const pointVerifier = VPoint(dimensionality);
    return VObject({
        type: VLiteral("bezier" as const),
        start: pointVerifier,
        startControl: pointVerifier,
        endControl: pointVerifier,
        end: pointVerifier,
    });
};

/**
 * Creates an arc JSON verifier
 * @param dimensionality The dimensionality of the points of the curve
 * @returns The arc verifier
 */
export const VArc = (
    dimensionality: 2 | 3
): IVerifier<IArcJSON<typeof dimensionality extends 2 ? I2DPointJSON : I3DPointJSON>> => {
    const pointVerifier = VPoint(dimensionality);
    return VObject({
        type: VLiteral("arc" as const),
        start: pointVerifier,
        control: pointVerifier,
        end: pointVerifier,
    });
};

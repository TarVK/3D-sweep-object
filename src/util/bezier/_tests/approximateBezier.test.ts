import {Vec2} from "../../Vec2";
import {approximateBezier} from "../approximateBezier";

describe("approximateBezier", () => {
    it("evenly spaces points", () => {
        const targetPrecision = 0.01; // 1% off or less
        const targetSpacing = 0.1;
        const nodes = approximateBezier(
            {
                start: new Vec2(0, 0),
                startControl: new Vec2(0.5, 0.5),
                endControl: new Vec2(0.5, 0),
                end: new Vec2(1, 0),
            },
            {
                spacing: targetSpacing,
            }
        );

        const distances = nodes
            .slice(0, -2)
            .map(({point}, i) => nodes[i + 1].point.sub(point).length());
        const outOfRangeDistances = distances.filter(
            distance =>
                Math.abs((distance - targetSpacing) / targetSpacing) > targetPrecision
        );

        expect(nodes.length).toBeGreaterThan(5);
        expect(outOfRangeDistances.length).toBe(0);
    });
});

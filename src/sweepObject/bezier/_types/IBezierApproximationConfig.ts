export type IBezierApproximationConfig = {
    /** The distance between consecutive points */
    spacing: number;
    /** How many times to try to get an exacter approximation, higher is better, runtime scales about linearly */
    approximationAttempts?: number;
};

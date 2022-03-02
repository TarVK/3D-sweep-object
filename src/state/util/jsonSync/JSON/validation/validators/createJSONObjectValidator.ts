import {IJSONValidator} from "../_types/IJSONValidator";

/**
 * Creates a new JSON object validator
 * @param fields The fields that the object should have
 * @returns The JSON object validator
 */
export function createJSONObjectValidator<F extends {[key: string]: IJSONValidator}>(
    fields: F
): IJSONValidator<{[K in keyof F]: F[K] extends IJSONValidator<infer V> ? V : never}> {
    const init = Object.fromEntries(
        Object.entries(fields)
            .map(([key, validator]) => [key, validator.default])
            .filter(([key, val]) => val !== undefined)
    );

    // TODO:
    return null as any;
}

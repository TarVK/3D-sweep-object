import {useRef} from "react";

/**
 * Returns the value that was passed in the previous render call
 * @param value The value to be stored
 * @param initial The value to be returned for the initial render call
 * @returns The previous value
 */
export const usePrevious = <T, R = undefined>(value: T, initial?: R): T | R => {
    const ref = useRef<T | R>(initial as R);
    const prev = ref.current;
    ref.current = value;
    return prev;
};

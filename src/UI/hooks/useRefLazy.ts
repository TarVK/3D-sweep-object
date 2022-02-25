import {MutableRefObject, useRef} from "react";

/**
 * A react reference with a lazy initializer function
 * @param init The initializer for the value to store
 * @returns The react ref object
 */
export const useRefLazy = <T>(init: () => T): MutableRefObject<T> => {
    const ref = useRef<T>(null as any as T);
    if (ref.current == null) ref.current = init();
    return ref;
};

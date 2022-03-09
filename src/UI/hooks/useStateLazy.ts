import {useState} from "react";
import {useRefLazy} from "./useRefLazy";

/**
 * A react state hook that lazy initializes the value on first render
 * @param init The initializer for the value to store initially
 * @returns The getter and setters
 */
export const useStateLazy = <T>(init: () => T) => {
    const initVal = useRefLazy(init);
    const data = useState<T>(initVal.current);
    return data;
};

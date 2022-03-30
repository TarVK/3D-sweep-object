import {useEffect, useMemo, useRef} from "react";
import {IInteractionController} from "./_types/IInteractionController";
import {IInteractionModeController} from "./_types/IInteractionModeController";
import {IInteractionModeControllerConstructor} from "./_types/IInteractionModeControllerConstructor";

/**
 * Creates the combined handlers for a given set of mode controllers
 * @param state The state that the handlers are for
 * @param mode The mode that the editor is currently in
 * @param handlerConstructors The constructors of the handlers
 * @return The combined handlers
 */
export function useCombinedHandlers<S, M>(
    state: S,
    mode: M,
    handlerConstructors: IInteractionModeControllerConstructor<S, M>[]
): IInteractionController {
    const prevHandlers = useRef(handlerConstructors);
    const changed =
        prevHandlers.current.length != handlerConstructors.length ||
        prevHandlers.current.find((handler, i) => handler != handlerConstructors[i]);
    if (changed) prevHandlers.current == handlerConstructors;

    const combined = useMemo(() => {
        // Index all mode controllers
        const modes = new Map<M, IInteractionModeController<M>[]>();
        for (let getModeController of handlerConstructors) {
            const modeController = getModeController(state);
            for (let mode of modeController.mode) {
                if (!modes.has(mode)) modes.set(mode, []);
                modes.get(mode)!.push(modeController);
            }
        }

        // Create the combined controller
        let currentMode = undefined as any as M; // Get initialized properly with setMode
        let currentControllers: IInteractionModeController<M>[] = [];
        const setMode = (mode: M) => {
            if (currentMode != mode) {
                currentControllers.forEach(controller => controller.onDeselect?.());
                currentMode = mode;
                currentControllers = modes.get(mode) ?? [];
                currentControllers.forEach(controller => controller.onSelect?.());
            }
        };
        setMode(mode);

        const createCaller =
            <A extends any[]>(
                getCaller: (
                    handler: IInteractionModeController<M>
                ) => undefined | ((...args: A) => void)
            ): ((...args: A) => void) =>
            (...args) => {
                const preventDefault = currentControllers.find(controller =>
                    getCaller(controller)?.(...args)
                );
                return preventDefault;
            };

        return {
            setMode,
            onMouseDown: createCaller(handler => handler.onMouseDown),
            onMouseMove: createCaller(handler => handler.onMouseMove),
            onMouseUp: createCaller(handler => handler.onMouseUp),
            onKeyDown: createCaller(handler => handler.onKeyDown),
            onKeyUp: createCaller(handler => handler.onKeyUp),
            onMouseEnter: createCaller(handler => handler.onMouseEnter),
            onMouseLeave: createCaller(handler => handler.onMouseLeave),
        };
    }, [prevHandlers.current, state]);

    useEffect(() => {
        combined.setMode(mode);
    }, [mode]);

    return combined;
}

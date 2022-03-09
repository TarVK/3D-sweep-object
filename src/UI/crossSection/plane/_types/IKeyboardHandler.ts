import {Vec2} from "../../../../util/Vec2";

/**
 * An event handler to handle keyboard interactions while the mouse is on the plane
 * @param evt The original keyboard event
 * @param worldPoint The mouse location in world coordinates
 */
export type IKeyboardHandler = (evt: KeyboardEvent, worldPoint: Vec2) => void;

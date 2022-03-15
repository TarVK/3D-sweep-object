import {IInteractionHandler} from "../../plane/_types/IInteractionHandler";
import {IKeyboardHandler} from "../../plane/_types/IKeyboardHandler";

export type IInteractionController = {
    /** The function to execute when a mouse button is pressed down */
    onMouseDown?: IInteractionHandler;
    /** The function to execute when the mouse is moved */
    onMouseMove?: IInteractionHandler;
    /** The function to execute when a mouse button is released */
    onMouseUp?: IInteractionHandler;
    /** The function to execute when a keyboard key is pressed */
    onKeyDown?: IKeyboardHandler;
    /** The function to execute when a keyboard key is released */
    onKeyUp?: IKeyboardHandler;
    /** The function to execute when the mouse enters the 2d plane */
    onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
    /** The function to execute when the mouse leaves the 2d plane */
    onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
};

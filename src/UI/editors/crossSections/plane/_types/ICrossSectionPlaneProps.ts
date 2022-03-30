import {IInteractionHandler} from "./IInteractionHandler";
import {IKeyboardHandler} from "./IKeyboardHandler";

export type ICrossSectionPlaneProps = {
    onMouseDown?: IInteractionHandler;
    onMouseUp?: IInteractionHandler;
    onMouseMove?: IInteractionHandler<boolean | void>;

    onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
    onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;

    onKeyDown?: IKeyboardHandler;
    onKeyUp?: IKeyboardHandler;

    height?: string | number;
    width?: string | number;
};

/**
 * A synchronizer for the text and data
 */
export type ISyncer<F, D> = {
    /**
     * Changes the text at the given range
     * @param range The range of the input that was replaced by the given text
     * @param text The new text that was replaced by this range
     */
    changeText: (range: IInputRange, text: string) => void;
    /**
     * Updates the contents of this node
     * @param path The path to the value to be updated
     * @value The new value to be set
     */
    setData: (path: F, value: D) => void;
};

export type ISyncFactory = <F, D>(dispatcher: ISyncDispatcher<F, D>) => ISyncer<F, D>;

/**
 * The dispatcher that takes care of making changes to both the editor state as well as the data model state
 */
export type ISyncDispatcher<F, D> = {
    /**
     * Changes the text at the given range in the editor
     * @param range The text range to be replaced
     * @param text The new text that was replaced by this range
     */
    changeText: (range: IRange, text: string) => void;
    /**
     * Displays an error message over the given range in the editor
     * @param range The range that the error message applies to
     * @param message The message to be shown
     * @returns A function that can be invoked to remove the error message
     */
    displayError: (range: IRange, message: string) => IErrorRemover;
    /**
     * Updates the contents of the data model
     * @param path The path to the value to be updated
     * @param value The value to be changed to
     * @value The new value to be set
     */
    changeData: (path: F, value: D) => void;
    /**
     * Adds a new property at the given path in the data model
     * @param path The path to the value to be added
     * @param value The new value to be stored at this path
     */
    insertData: (path: F, value: D) => void;
    /**
     * Deletes a property at the given path in the data model
     * @param path The path to the value to be deleted
     */
    deleteData: (path: F) => void;

    /**
     * Checks wether a given update is valid
     * @param path The path to the value to be updated
     * @param value The new value that is going to be set
     * @returns An object that indicates validity data
     */
    checkValidity: (path: F, value: D) => IValidityResponse<F, D>;
};
export type IRange = {start: number; end: number};

export type IValidityResponse<F, D> = {
    /** The error message in case the value wasn't valid */
    error?: string;
    /** The paths of the dependencies that the validity of this value depends on */
    dependencies: F[];
    /** Updates to apply in order for this value to be valid */
    updates: IUpdate<F, D>[];
};
export type IUpdate<F, D> = {
    /** The path to set the value at */
    path: F;
    /** The value to be set */
    value: D;
};
export type IErrorRemover = () => void;

export type IInputRange = {
    /** The start index when text is considered 1d */
    start: number;
    /** The end index when text is considered 1d */
    end: number;
    /** A 2d position, which can slightly increase performance if this data is already available, will be recalculated otherwise */
    twoDimensional?: ITwoDimensionalInputRange;
};
export type ITwoDimensionalInputRange = {
    /** The start row (0 indexed) */
    startRow: number;
    /** The start column (0 indexed) */
    startColumn: number;
    /** The end row (0 indexed) */
    endRow: number;
    /** The end column (0 indexed) */
    endColumn: number;
};

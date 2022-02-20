import {IJSON} from "./IJSON";

export type IJSONDispatcher = {
    /**
     * Updates the contents of the data model
     * @param path The path to the value to be updated
     * @param value The value to be changed to
     * @value The new value to be set
     */
    changeData: (path: string[], value: IJSON) => void;
    /**
     * Adds a new property at the given path in the data model
     * @param path The path to the value to be added
     * @param value The new value to be stored at this path
     */
    insertData: (path: string[], value: IJSON) => void;
    /**
     * Deletes a property at the given path in the data model
     * @param path The path to the value to be deleted
     */
    deleteData: (path: string[]) => void;
};

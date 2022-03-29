import {KeyboardEvent} from "react";

interface IClonable {
    copy(): IClonable;
}

/**
 * A history manager class.
 *  @template T The type of object to be cloned. Must implement IClonable (aka have a copy method), or be an array of IClonable objects.
 */
export class HistoryManager<T> {
    private history: T[];
    private historyIndex: number;
    private listeners: ((change: T) => void)[] = [];

    constructor(initialValue: T) {
        this.history = [];
        this.historyIndex = -1;
        this.push(initialValue);
    }

    public onKeyDown = (e: KeyboardEvent) => {
        console.log(e);
        if (e.ctrlKey && (e.key === "z" || e.key === "Z")) {
            const value = this.undo();
            this.listeners.forEach(listener => listener(value));
        } else if (e.ctrlKey && (e.key === "y" || e.key === "Y")) {
            const value = this.redo();
            if (value !== false) this.listeners.forEach(listener => listener(value));
        }
    };

    public push(value: T) {
        if (
            Array.isArray(value) &&
            (value.length == 0 || (value[0] as unknown as IClonable).copy)
        ) {
            this.history.push(
                value.map(v => (v as unknown as IClonable).copy()) as unknown as T
            );
        } else if ((value as unknown as IClonable).copy) {
            this.history.push((value as unknown as IClonable).copy() as unknown as T);
        } else {
            this.history.push(value);
            this.notCloneable();
        }
        this.historyIndex++;
        this.history.splice(
            this.historyIndex,
            this.history.length - this.historyIndex,
            value
        );
    }
    public undo() {
        if (!this.canUndo) return this.history[0];
        this.historyIndex--;
        return this.history[this.historyIndex];
    }
    public redo() {
        if (!this.canRedo) return false;
        this.historyIndex++;
        return this.history[this.historyIndex];
    }

    public notCloneable() {
        throw new Error("The passed type T must be cloneable");
    }

    public onChange(listener: (change: T) => void) {
        this.listeners.push(listener);
    }

    get current() {
        return this.history[this.historyIndex];
    }
    get canUndo() {
        return this.historyIndex > 0;
    }
    get canRedo() {
        return this.historyIndex < this.history.length - 1;
    }
}

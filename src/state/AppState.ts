import {Field, IDataHook} from "model-react";

/**
 * The state of the application
 */
export class AppState {
    protected text = new Field("shit");

    /**
     * Retrieves some random test text
     * @param hook The hook to subscribe to changes
     * @returns The test text
     */
    public getText(hook?: IDataHook): string {
        return this.text.get(hook);
    }

    /**
     * Sets some random test text
     * @param text The new text
     */
    public setText(text: string): void {
        this.text.set(text);
    }
}

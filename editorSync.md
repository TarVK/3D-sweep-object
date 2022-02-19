Goal: sync local state with JSON (or other data language) editor

- Objects (/arrays) are annotated with metadata:
    - The text + range representing this data in editor
    - Data on every field/entry:
        - Whether the data is synchronized (if the text has typos or is invalid it may not be)
        - Syntax/data error messages
    - All descendent errors

```ts
type IObjectMetaData = {
    /** The exact text used to represent this object **/
    text: {
        /** The prefix text used */
        prefix: string;
        /** The suffix text used */
        suffix: string;
    }
    

    /** The total number of characters used in the source code to represent this object */
    length: number;
}
```
import {IJSON} from "../_types/IJSON";
import {IJSONDispatcher} from "../_types/IJSONDispatcher";

/**
 * Creates a JSON dispatcher that can be used to directly synchronize a json object
 * @param target The target object for which to update the value
 * @param listeners Some additional listeners, E.g. to log events
 * @param
 */
export function createValueSyncDispatcher(
    target: {value: IJSON},
    listeners?: Partial<IJSONDispatcher>
): IJSONDispatcher {
    const update = (
        path: string[],
        call: (key: string, parent: Record<string, IJSON>) => void
    ) => {
        path = ["value", ...path];
        const key = path.pop()!;
        let obj = target;
        for (let key of path) {
            if (!(key in obj))
                throw Error(
                    `Path ${[...path, key].join(".")} not contained in ${JSON.stringify(
                        target,
                        null,
                        4
                    )}`
                );
            obj = (obj as any)[key];
        }
        if (!(obj instanceof Object)) {
            throw Error(
                `Path ${path.join(".")} did not lead to object but to ${JSON.stringify(
                    obj
                )}`
            );
        }

        call(key, obj);
    };

    return {
        changeData: (path, value) => {
            update(path, (key, parent) => {
                parent[key] = value;
            });
            listeners?.changeData?.(path, value);
        },
        insertData: (path, value) => {
            update(path, (key, parent) => {
                parent[key] = value;
            });
            listeners?.insertData?.(path, value);
        },
        deleteData: path => {
            update(path, (key, parent) => {
                delete parent[key];
            });
            listeners?.deleteData?.(path);
        },
    };
}

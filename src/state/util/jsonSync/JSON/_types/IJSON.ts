export type IJSON =
    | null
    | string
    | boolean
    | number
    | Array<IJSON>
    | {[key: string]: IJSON};

export type IParser<D> = {
    parse: (start: number, end: number, text: string) => IParseError | IParseResult<D>;
};

type IParseError = {};
type IParseResult<D> = {
    next: IParser<D> | null;
    end: number;
    result: D;
};

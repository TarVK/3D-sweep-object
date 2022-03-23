import {IErrorData} from "../verifier/_types/IVerifier";

export type IImportResult<T> = {result: T} | {errors: IErrorData[]};

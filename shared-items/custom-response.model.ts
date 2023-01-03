import { ErrorStatusCode, SuccessStatusCode } from "./status-codes";

export interface CustomResponse<T>{
    message?: string,
    payload?: T,
    code: SuccessStatusCode | ErrorStatusCode,
    status: number 
}
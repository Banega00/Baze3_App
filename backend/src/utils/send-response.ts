import {Response, Request} from 'express';
import { SuccessStatusCode, ErrorStatusCode } from '../../../shared-items/status-codes';

export function sendResponse(responseObject:{response: Response, status: number, code: SuccessStatusCode | ErrorStatusCode, message?: string, payload?: any}): void {
    const {response, status, code, message, payload} = responseObject; 
    
    response.status(status).json({status, code, message, payload})
}



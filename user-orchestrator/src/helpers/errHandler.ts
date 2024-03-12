import { Response } from 'express';
import { LoggerTypes } from '../services/logger.service';
import { HttpException, HttpStatus } from '@nestjs/common';

export function errorHandler (res: Response, error: any, logger: LoggerTypes) {
    logger.print(error)
    let errMessage = error?.message ?? "Internal Server Error"
    if(Array.isArray(errMessage)){
        errMessage = errMessage.join(', ')
    }

    const errData = {
        status : error?.status ?? error?.error?.status ?? 500,
        message: errMessage,
        data: error?.data,
        error: error?.error
    }

    logger.print(errData)
    res.status(errData.status).json(errData)
}

//punya guard ini
export function throwException(err: { status: HttpStatus, message: any, error?: any }) {
    throw new HttpException({
        status: err.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
        message: err.message ?? 'Internal Server Error'
    }, err.status, { cause: err.error })
}
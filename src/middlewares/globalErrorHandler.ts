//global error handler

import { Request, Response, NextFunction } from "express";
import { HttpError } from "http-errors";
import { config } from "../Config/config";

const globleErrorHandler = (
    err: HttpError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        message: err.message,
        errorstack: config.env === 'development' ? err.stack : "",
    });
};

export default globleErrorHandler;


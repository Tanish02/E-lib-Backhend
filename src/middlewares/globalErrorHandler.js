"use strict";
//global error handler
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../Config/config");
const globleErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        message: err.message,
        errorstack: config_1.config.env === 'development' ? err.stack : "",
    });
};
exports.default = globleErrorHandler;

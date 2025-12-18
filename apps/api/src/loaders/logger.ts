/** @format */

import winston from 'winston';
import config from '../config';

const transports = [];
// const exceptionHandlers = [];

if (process.env.NODE_ENV !== 'development') {
    // transports.push(new winston.transports.Console());

    // changing format on production
    transports.push(
        new winston.transports.Console({
            format: winston.format.combine(winston.format.cli(), winston.format.splat()),
        }),
    );
    transports.push(new winston.transports.File({ filename: 'info.log', level: 'info', format: winston.format.json() }));

    transports.push(new winston.transports.File({ filename: 'error.log', level: 'error', format: winston.format.json() }));
} else {
    transports.push(
        new winston.transports.Console({
            format: winston.format.combine(winston.format.cli(), winston.format.splat()),
        }),
    );

    transports.push(new winston.transports.File({ filename: 'error.log', level: 'error', format: winston.format.json() }));
}

const LoggerInstance = winston.createLogger({
    level: config.logs.level,
    levels: winston.config.npm.levels,
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json(),
    ),
    transports,

    // exceptionHandlers,
});

export default LoggerInstance;

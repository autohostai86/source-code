/** @format */

import { DEVELOPMENT } from '@app/constants';
import jwt from 'express-jwt';
import { nextTick } from 'process';
import config from '../../config';
import logger from '../../loaders/logger';

const getTokenFromHeader = (req) => {
    if (
        (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
        (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
    ) {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
};

const isAuth = jwt({
    secret: config.jwtSecret, // The _secret_ to sign the JWTs
    algorithms: [config.jwtAlgorithm], // JWT Algorithm
    userProperty: 'token', // Use req.token to store the JWT
    getToken: getTokenFromHeader, // How to extract the JWT from the request
});

const authHandler = function (req, res, next: any): any {
    try {
        const authSkipPaths = [
            '/api/superAdmin/getConfigs',
            '/api/users/login',
            '/api/upload/v2/generate-auth-url/oauth',
            '/api/bot/get-bot-by-id',
            '/api/auth/login',
            '/api/auth/is-user-exists',
            '/api/auth/forgot-password',
            '/api/auth/resetpassword',
            '/api/auth/create',
            '/api/settings/get-by-user',
            '/api/bot/chat',
            '/api/bot/add-conversations',
            '/api/bot/webhook',
            '/api/bot/stayflexi-webhook',
            '/api//customer/get',
            '/api/customer/save-messages',
            '/api/customer/change-online-status',
            '/api/customer/create',
            '/api/bot/get-all-bots-by-user',
            '/api/customer/get',
            '/api/uploads/botDocuments'
        ];
        // skipping on public route as well as on development
        if (authSkipPaths.includes(req.path)) {
            // if (authSkipPaths.includes(req.originalUrl)) {
            next();
        } else if (req.query.code !== undefined) {
            next();
        } else {
            const checkAuth = isAuth(req, res, next);
        }
    } catch (error) {
        logger.error(error);
    }
};

export default authHandler;

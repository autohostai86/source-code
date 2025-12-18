/** @format */

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { isCelebrateError, errors } from 'celebrate';
import session from "express-session";
import mongoStore from "connect-mongo";
import routes from '../api';
import config from '../config';
import isAuth from '@app/api/middlewares/isAuth';
import isSubscribed from '@app/api/middlewares/isSubscribed';
export default ({ app }: { app: express.Application }) => {
    /**
     * Health Check endpoints
     * @TODO Explain why they are here
     */

    // Enable Cross Origin Resource Sharing to all origins by default
    app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3001", "https://autohostai.com"], credentials: true}));
    app.use((req, res, next) => {
        res.header("Access-Control-Expose-Headers", "X-Plan-Category, X-Expired, X-Balance");
        next();
    });

    app.get('/status', (req, res) => {
        res.status(200).json('status ok').end();
    });

    app.head('/status', (req, res) => {
        res.status(200).end();
    });

    app.use('/api/uploads', express.static('uploads'));
    // app.use('/', express.static(config.WEB_BUILD_PATH));

    // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
    // It shows the real origin IP in the heroku or Cloudwatch logs
    app.enable('trust proxy');

    // The magic package that prevents frontend developers going nuts
    // Alternate description:

    // Some sauce that always add since 2014
    // "Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it."
    // Maybe not needed anymore ?
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    app.use(require('method-override')());

    // Middleware that transforms the raw string of req.body into json
    app.use(bodyParser.json());

    // app.use((req, res, next) => {
    //     next();
    // });

    // Load API routes
    // app.use(config.api.prefix, routes());
    // adding global level auth check
    app.use(isAuth);
    app.use(isSubscribed);
    app.use(session({
        secret: "yC11O3_fb3a0doYl7GCh5cGiOY7f63CaLD4o0znozEQ",
        resave: false, // Prevents resaving unchanged sessions
        saveUninitialized: false, // Prevents saving empty sessions
        store: mongoStore.create({
            mongoUrl: config.databaseURL,
            collectionName: "sessions",
            ttl: 5 * 60 * 60, // 5 hours
            autoRemove: "native" // Automatically remove expired sessions
        }),
        cookie: {
            maxAge: 5 * 60 * 60 * 1000, // 5 hours expiry
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production' ? true : false, // Use `true` if on HTTPS
            sameSite: "lax" // Allow cross-site requests
        }
    }));
    
    app.use(config.api.prefix, routes());

    /// catch 404 and forward to error handler
    // app.use((req, res, next) => {
    //     const err = new Error('Not Found');
    //     err['status'] = 404;
    //     next(err);
    // });

    /// error handlers
    app.use((err, req, res, next) => {
        /**
         * Handle 401 thrown by express-jwt library
         */
        if (err.name === 'UnauthorizedError') {
            return res.status(err.status).send({ message: err.message }).end();
        }
        return next(err);
    });

    // CELEBRATE ERROR CATCH FOR REQ PARAMETERS
    app.use(errors());

    app.use((err, req, res, next) => {
        //
        res.status(err.status || 500);

        res.json({
            errors: {
                message: err.message,
            },
        });
    });
    return app;
};

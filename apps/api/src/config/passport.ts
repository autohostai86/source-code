/**
 * /* eslint-disable @typescript-eslint/no-var-requires
 *
 * @format
 */
/* eslint-disable no-console */

// import { Container } from 'typedi';
// import adminModel from '../models/adminModel';
// import userModel from '../models/userModel';
// import UserService from '../services/userService';
import key from './keys';
// import dbService from '../services/db-service';

import passport_jwt = require('passport-jwt');

const JwtStrategy = passport_jwt.Strategy;
const ExtractJwt = passport_jwt.ExtractJwt;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const opts: any = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = key.secretOrKey;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const userService = Container.get(UserService);

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (passport) => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            // if (jwt_payload.userType === 'admin') {
            //     adminModel
            //         .find({ _id: jwt_payload.id })
            //         .then((admin) => {
            //             if (admin) {
            //                 return done(null, admin[0]);
            //             }
            //             return done(null, false);
            //         })
            //         .catch((err) => console.log(err));
            // } else if (jwt_payload.userType === 'user') {
            //     userModel
            //         .find({ _id: jwt_payload.id })
            //         .then((user) => {
            //             if (user) {
            //                 return done(null, user[0]);
            //             }
            //             return done(null, false);
            //         })
            //         .catch((err) => console.log(err));
            // }
        }),
    );
};

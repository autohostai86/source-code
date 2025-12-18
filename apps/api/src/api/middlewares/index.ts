/** @format */

import attachCurrentUser from './attachCurrentUser';
import isAuth from './isAuth';
import bodyValidator from './bodyValidator';
import { singleUpload, batchUpload } from './uploadMiddleware';

export default {
    attachCurrentUser,
    isAuth,
    bodyValidator,
    singleUpload,
    batchUpload,
};

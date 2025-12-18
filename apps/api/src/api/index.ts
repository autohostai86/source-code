/** @format */

import { Router } from 'express';
import auth from './routes/auth';
import bot from './routes/bot';
import user from './routes/user';
import billing from './routes/billing';
import notification from './routes/notification';
import subscribedPlans from './routes/subscribedPlans';
import settings from './routes/settings';
import email from './routes/email';
import tag from './routes/tag';
import automatedResponse from './routes/automatedResponse';
import nearBySpots from './routes/nearBySpots';
import listing from './routes/listing';
import plan from './routes/plan';
import customer from './routes/customer';
import stayflexi from './routes/stayflexi';

export default () => {
    const app = Router();
    auth(app);
    bot(app);
    user(app)
    billing(app)
    notification(app)
    subscribedPlans(app);
    settings(app);
    email(app);
    tag(app);
    automatedResponse(app);
    nearBySpots(app);
    listing(app);
    plan(app);
    customer(app);
    stayflexi(app);
    return app;
};
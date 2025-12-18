/** @format */
import moment from 'moment';

import expressLoader from './express';
// import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
// import jobsLoader from './jobs';
import Logger from './logger';
import socketIOLoader from './socketIO';

import SeederService from '@app/services/SeederService';
import CronService from '../services/CronService';

//We have to import at least all the events once so they can be triggered
// import './events';

export default async ({ expressApp }) => {
    const mongoConnection = await mongooseLoader();

    const app = await expressLoader({ app: expressApp });

    await SeederService.createDefaultAdmin();
    await SeederService.createDefaultBilling();

    await SeederService.copyVideo();

    // running crop job
    CronService.deactivateCron();
    CronService.expiryReminderCron();

    Logger.info(`✌️ Express loaded env => ${global.process.env.NODE_ENV}`);

    return socketIOLoader({ app });
};

/** @format */

import mongoose from 'mongoose';
// import { Db } from 'mongodb';
import config from '../config';

export default async (): Promise<any> => {
    // mongoose.connect('mongodb://mongo/N',{auth:{authdb:"admin",user:"root",password:"1004"}});
    const connection = await mongoose.connect(config.databaseURL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    });

    const db = mongoose.connection;
    // db.on('error', console.error.bind(console, 'connection error:'));
    // db.once('open', function () {
    //     console.log('connection open');
    // });

    return connection.connection.db;
};

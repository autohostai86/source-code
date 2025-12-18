/**
 * /* eslint-disable no-console
 *
 * @format
 */

/** @format */

import express from 'express';
import os from 'os';


import 'reflect-metadata'; // We need this in order to use @Decorators
import config from './config';

//

async function startServer() {
    let app = express();

    // eslint-disable-next-line @typescript-eslint/no-var-requires

    app.use(express.static('uploads'));

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    app = await require('./loaders').default({ expressApp: app });

    app.listen(config.port, () => {
        // @ts-ignore
        console.log('listening on *:', config.port);
    });

}

startServer();

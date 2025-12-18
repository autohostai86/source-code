/** @format */

/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */

class LogService {
    info(msg: string, data?: any) {
        console.log('--------');
        console.info(msg, data);
        console.log('--------');
    }

    warnging(msg: string, data?: any) {
        console.log('--------');
        console.info(msg, data);
        console.log('--------');
    }

    error(msg: any, data?: any) {
        console.log('--------');
        console.error(msg, data);
        console.log('--------');
    }
}

export default new LogService();

/** @format */

import logger from '@app/loaders/logger';
import automatedResponseModel from '@app/models/automatedResponseModel';

class AutomatedResponseService {
    async getResponse(): Promise<any> {
        try {
            const getAutomatedResponse = await automatedResponseModel.find()
            if (getAutomatedResponse) {
                return { error: false, msg: 'success', data: getAutomatedResponse }
            } else {
                return { error: false, msg: 'No Messages' }
            }
        } catch (error) {
            logger.error(`AutomatedResponseService -> getResponse -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }

    async update(reqData): Promise<any> {
        try {
            const getAutomatedResponse = await automatedResponseModel.find()
            if (getAutomatedResponse.length > 0) {
                const response = await automatedResponseModel.updateOne(reqData);
                return { error: false, msg: 'success', data: response };
            } else {
                const response = await automatedResponseModel.create(reqData);
                return { error: false, msg: 'success', data: response };
            }
        } catch (error) {
            logger.error(
                `AutomatedResponseService -> create -> error: ${error.message}`
            );
            return { error: true, msg: 'Internal server error' };
        }
    }
}

export default new AutomatedResponseService();
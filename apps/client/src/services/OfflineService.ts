import API from '../utils/API';
import LogService from './LogService';

class OfflineService {

    async getConversationsByBotId(reqData) {
        const response = await API.post('/customer/get-conversations', reqData)
            .then((res) => {
                return res.data
            })
            .catch((error) => {
                LogService.error(`OfflineService -> getConversationsByBotId -> error: ${JSON.stringify(error)}`);
                return { error: true, msg: 'Internal server error' }
            })
        return response;
    }

    async updateMessageAsRead(reqData) {
        const response = await API.post('/customer/mark-as-read', reqData)
            .then((res) => {
                return res.data
            })
            .catch((error) => {
                LogService.error(`OfflineService -> updateMessageAsRead -> error: ${JSON.stringify(error)}`);
                return { error: true, msg: 'Internal server error' }
            })
        return response;
    }

    async getCustomerData(reqData) {
        const response = await API.get(`/customer/get-only?${reqData}`)
            .then((res) => {
                return res.data
            })
            .catch((error) => {
                LogService.error(`OfflineService -> getCustomerData -> error: ${JSON.stringify(error)}`);
                return { error: true, msg: 'Internal server error' }
            })
        return response;
    }
}

export default new OfflineService();
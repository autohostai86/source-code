import API from '../utils/API';
import LogService from './LogService';

class AutomatedResponseService {
    async updateResponse(reqData) {
        const response = await API.post('/automated-response/create', reqData)
            .then((res) => {
                return res.data
            })
            .catch((error) => {
                LogService.error(`AutomatedResponseService -> create -> error: ${JSON.stringify(error)}`);
                return { error: true, msg: 'Internal server error' }
            })
        return response;
    }

    async getResponse() {
        const response = await API.get('/automated-response/get-response')
            .then((res) => {
                return res.data
            })
            .catch((error) => {
                LogService.error(`AutomatedResponseService -> create -> error: ${JSON.stringify(error)}`);
                return { error: true, msg: 'Internal server error' }
            })
        return response;
    }
}
export default new AutomatedResponseService()
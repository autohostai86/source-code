import API from '../utils/API';
import LogService from './LogService';

class PlanService {

    async fetchPlan(payload) {
        const response = await API.get('/plan/get-by-id', {
            params: payload

        })
            .then((res) => {
                return res.data
            })
            .catch((error) => {
                LogService.error(`PlanService -> fetchPlan -> error: ${JSON.stringify(error)}`);
                return { error: true, msg: 'Internal server error' }
            })
        return response;
    }
    async makePayment(payload) {
        const response = await API.post('/plan/make-payment', payload)
            .then((res) => {

                return res.data
            })
            .catch((error) => {
                LogService.error(`PlanService -> makePayment -> error: ${JSON.stringify(error)}`);
                return { error: true, msg: 'Internal server error' }
            })
        return response;
    }
    async createOrder(payload) {
        const response = await API.post('/plan/create-order', payload)
            .then((res) => {

                return res.data
            })
            .catch((error) => {
                LogService.error(`PlanService -> createOrder -> error: ${JSON.stringify(error)}`);
                return { error: true, msg: 'Internal server error' }
            })
        return response;
    }




}

export default new PlanService()
import API from '../utils/API';
import LogService from './LogService';

class SubscriptionService {
    async checkSubscription() {
        try {
            let url = "/auth/ping-health";
            const response = await API.get(url);
    
            return response.data; // Return the response data directly
        } catch (error: any) {
            // Log the error details
            LogService.error(`SubscriptionService -> checkSubscription -> error: ${JSON.stringify(error)}`);
    
            // Handle different types of errors
            if (error.response) {
                if (error.response.status === 403) {
                    if (error.response.data?.errorType === "FREE_PLAN_EXPIRED") {
                        return { error: true, errorType: "FREE_PLAN_EXPIRED", msg: "Your quota is exceeded. Please upgrade your plan.", planCategory: error.response.data?.planCategory, isExpired: error.response.data?.isExpired, availableBalance: error.response.data?.availableBalance };
                    }
                    if (error.response.data?.errorType === "USAGE_EXCEEDED") {
                        return { error: true, errorType: "USAGE_EXCEEDED", msg: "Your quota is exceeded. Please upgrade your plan.", planCategory: error.response.data?.planCategory, isExpired: error.response.data?.isExpired, availableBalance: error.response.data?.availableBalance };
                    }
                }
                return { error: true, msg: error.response.data?.message || "An error occurred" };
            }
    
            return { error: true, msg: "Internal server error" };
        }
    }

    async getSubscriptionData(reqData) {
        const response = await API.post('/subscribedplans/get-current-subscription', reqData)
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                LogService.error(`SubscriptionService -> getSubscriptionData -> error: ${JSON.stringify(err)}`);
                return { error: true, msg: 'Internal server error' }

            });
        return response;
    }

    async updateTrasaction(reqData) {
        const response = await API.post('/subscribedplans/add-credits', reqData)
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                LogService.error(`SubscriptionService -> updateTrasaction -> error: ${JSON.stringify(err)}`);
                return { error: true, msg: 'Internal server error' }

            });
        return response;
    }

    async changeSubscription(reqData) {
        const response = await API.post('/subscribedplans/change', reqData)
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                LogService.error(`SubscriptionService -> changeSubscription -> error: ${JSON.stringify(err)}`);
                return { error: true, msg: 'Internal server error' }

            });
        return response;
    }

    async getTrasactionsFromRazorPay(reqData) {
        const response = await API.post('/subscribedplans/get-transcations', reqData)
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                LogService.error(`SubscriptionService -> getTrasactionsFromRazorPay -> error: ${JSON.stringify(err)}`);
                return { error: true, msg: 'Internal server error' }

            });
        return response;
    }
}

export default new SubscriptionService();
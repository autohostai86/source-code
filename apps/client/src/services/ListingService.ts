import API from '../utils/API';
import LogService from './LogService';

class ListingService {

    async getAllListing(reqData) {
        const response = await API.post('/listing/get-all', reqData)
            .then((res) => {
                return res.data
            })
            .catch((error) => {
                LogService.error(`ListingService -> getAllListing -> error: ${JSON.stringify(error)}`);
                return { error: true, msg: 'Internal server error' }
            })
        return response;
    }

    async addListing(reqData) {
        const response = await API.post('/listing/add', reqData)
            .then((res) => {
                return res.data;
            })
            .catch((error) => {
                LogService.error(
                    `ListingService -> addListing -> error: ${JSON.stringify(error)}`
                );
                return { error: true, msg: 'Internal server error' };
            });
        return response;
    }
    async addPMSListing(reqData) {
        const response = await API.post('/listing/add-pms-data', reqData)
            .then((res) => {
                return res.data;
            })
            .catch((error) => {
                LogService.error(
                    `ListingService -> addPMSListing -> error: ${JSON.stringify(error)}`
                );
                return { error: true, msg: 'Internal server error' };
            });
        return response;
    }
    
    async updateListing(reqData) {
        const response = await API.post('/listing/updateListing', reqData)
            .then((res) => {
                return res.data;
            })
            .catch((error) => {
                LogService.error(
                    `ListingService -> updateListing -> error: ${JSON.stringify(error)}`
                );
                return { error: true, msg: 'Internal server error' };
            });
        return response;
    }
    async deleteListing(reqData) {
        const response = await API.post('/listing/deleteListing', reqData)
            .then((res) => {
                return res.data;
            })
            .catch((error) => {
                LogService.error(
                    `ListingService -> deleteListing -> error: ${JSON.stringify(error)}`
                );
                return { error: true, msg: 'Internal server error' };
            });
        return response;
    }

    async responderStatus(reqData) {
        const response = await API.post('/listing/ai-respond-status', reqData)
            .then((res) => {
                return res.data;
            })
            .catch((error) => {
                LogService.error(
                    `ListingService -> addListing -> error: ${JSON.stringify(error)}`
                );
                return { error: true, msg: 'Internal server error' };
            });
        return response;
    }

    async getLatAndLongOfAddress(reqData) {
        const response = await API.get(`/listing/get-lat-long?${reqData}`)
            .then((res) => {
                return res.data
            })
            .catch((error) => {
                LogService.error(`ListingService -> getLatAndLongOfAddress -> error: ${JSON.stringify(error)}`);
                return { error: true, msg: 'Internal server error' }
            })
        return response;
    }
}

export default new ListingService();
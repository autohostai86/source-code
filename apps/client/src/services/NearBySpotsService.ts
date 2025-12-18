import API from '../utils/API';
import LogService from './LogService';

class NearBySpotsServices {

    async fetchSpots(reqData) {
        const response = await API.post('/near-by-spots/get-all', reqData)
            .then((res) => {
                return res.data
            })
            .catch((error) => {
                LogService.error(
                    `NearBySpotsServices -> fetchSpots -> error: ${JSON.stringify(error)}`
                );
                return { error: true, msg: 'Internal server error' }
            })
        return response;
    }

    async addSpots(reqData) {
        const response = await API.post('/near-by-spots/add', reqData)
            .then((res) => {
                return res.data
            })
            .catch((error) => {
                LogService.error(
                    `NearBySpotsServices -> addSpots -> error: ${JSON.stringify(error)}`
                );
                return { error: true, msg: 'Internal server error' }
            })
        return response;
    }

    async deleteSpots(reqData) {
        const response = await API.post('/near-by-spots/delete', reqData)
            .then((res) => {
                return res.data
            })
            .catch((error) => {
                LogService.error(
                    `NearBySpotsServices -> deleteSpots -> error: ${JSON.stringify(error)}`
                );
                return { error: true, msg: 'Internal server error' }
            })
        return response;
    }

    async editSpots(reqData) {
        // console.log(reqData)
        const response = await API.post('/near-by-spots/edit', reqData)
            .then((res) => {
                return res.data
            })
            .catch((error) => {
                LogService.error(
                    `NearBySpotsServices -> editSpots -> error: ${JSON.stringify(error)}`
                );
                return { error: true, msg: 'Internal server error' }
            })
        return response;
    }

    async nearByPlaces(destination, originLat, originlng) {
        const response = await API.get(
            `/near-by-spots/map?destination=${destination}&originLat=${originLat}&originLng=${originlng}`,
        )
            .then((res) => {
                return res.data;
            })
            .catch((error) => {
                LogService.error(
                    `NearBySpotsServices -> nearByPlaces -> error: ${JSON.stringify(error)}`
                );
                return { error: true, msg: 'Internal server error' };
            });
        return response;
    }
}

export default new NearBySpotsServices();
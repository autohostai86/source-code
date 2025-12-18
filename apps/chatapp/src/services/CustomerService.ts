/** @format */
/* eslint-disable class-methods-use-this */
// import API from "../utils/API";
// import axios from "axios";



import API from '../utils/API';


// const baseURL = "http://localhost:5000"

class CustomerService {

    async addCustomer(reqData: any) {
        const response = await API.post('/customer/create', reqData)
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                console.error(`CustomerService -> addCustomer -> error: ${JSON.stringify(err)}`);
                return { error: true, msg: 'Internal server error' }

            });
        return response;
    }

    async getCustomer(reqData: any) {
        const response = await API.post('/customer/get', reqData)
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                console.error(`CustomerService -> getCustomer -> error: ${JSON.stringify(err)}`);
                return { error: true, msg: 'Internal server error' }

            });
        return response;
    }

    async saveMessages(reqData: any) {
        const response = await API.post('/customer/save-messages', reqData)
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                console.error(`CustomerService -> saveMessages -> error: ${JSON.stringify(err)}`);
                return { error: true, msg: 'Internal server error' }

            });
        return response;
    }

    async changeOnlineStatus(reqData: any) {
        const response = await API.post('/customer/change-online-status', reqData)
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                console.error(`changeOnlineStatus -> saveMessages -> error: ${JSON.stringify(err)}`);
                return { error: true, msg: 'Internal server error' }

            });
        return response;
    }
}

export default new CustomerService();

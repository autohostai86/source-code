/** @format */
/* eslint-disable class-methods-use-this */
// import API from "../utils/API";
// import axios from "axios";

import API from '../utils/API';
import LogService from './LogService';


// const baseURL = "http://localhost:5000"

class DashboardService {
    // create bot service
    async contact(reqData) {
        // const response = await API.post('/dashboard/contact', { ...reqData })
        //     .then(async (res) => {
        
            try {
                let formData = {
                    email: reqData.email,
                    name: reqData.name,
                    mobileNo: reqData.number,
                    message: reqData.message
                };
                // formData = JSON.stringify(formData);
                const response = await API.post('/notification/mail', formData);
    
                if (response.status === 200) {
                    // return res.data;
                    return { error: false, msg: 'Your message has been received successfully. We will connect with you shortly.' };
                } else {
                    return { error: true, msg: 'Email Internal server error' }
                }
                return response;
            } catch (error) {
                LogService.error(`DashboardService -> contact -> error: ${error}`);
                return { error: true, msg: 'Internal server error' };
            }


        // })
        // .catch((err) => {
        //     LogService.error(`DashboardService -> create -> error: ${JSON.stringify(err)}`);
        //     return { error: true, msg: 'Internal server error' }

        // });
        
    }

    async getCountsSummary(reqData): Promise<any> {
        const respose = await API.post("/dashboard/get-counts", reqData)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            LogService.error(`DashboardService -> getCountsSummary -> error: ${JSON.stringify(err)}`);
            return { error: true, msg: 'Internal server error' }
        })
        return respose;
    }


}

export default new DashboardService();

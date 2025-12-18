/** @format */
/* eslint-disable class-methods-use-this */
// import API from "../utils/API";
// import axios from "axios";



import API from '../utils/API';


// const baseURL = "http://localhost:5000"

class BotService {

    async getBotsById(reqData: any) {
        const response = await API.post('/bot/get-bot-by-id', { ...reqData })
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                console.error(`BotService -> getBotsById -> error: ${JSON.stringify(err)}`);
                return { error: true, msg: 'Internal server error' }

            });
        return response;
    }

    async chat(reqData: any) {
        const response = await API.post('/bot/chat', { ...reqData })
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                console.error(`BotService -> chat -> error: ${JSON.stringify(err)}`);
                return { error: true, msg: 'Internal server error' }

            });
        return response;
    }


    async conversationallog(reqData: any) {
        const response = await API.post('/bot/add-conversations', { ...reqData })
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                console.error(`BotService -> conversationallog -> error: ${JSON.stringify(err)}`);
                return { error: true, msg: 'Internal server error' }

            });
        return response;
    }

    async getSetting(reqData) {
        const response = await API.get(`/settings/get-by-user${reqData}`)
          .then((res) => {
            return res.data;
          })
          .catch((error) => {
            console.error(
              `BotService -> getSetting -> error: ${JSON.stringify(error)}`
            );
            return { error: true, msg: 'Internal server error' };
          });
        return response;
      }
}

export default new BotService();

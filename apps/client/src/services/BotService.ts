/** @format */
/* eslint-disable class-methods-use-this */
// import API from "../utils/API";
// import axios from "axios";

import API from '../utils/API';
import LogService from './LogService';


// const baseURL = "http://localhost:5000"

class BotService {
    // create bot service
    async create(reqData) {
        const response = await API.post('/bot/create', { ...reqData })
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                LogService.error(`BotService -> create -> error: ${JSON.stringify(err)}`);
                return { error: true, msg: 'Internal server error' }

            });
        return response;
    }
    async updatingBot(reqData) {
        const response = await API.post('/bot/updateBot', { ...reqData })
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                LogService.error(`BotService -> updatingBot -> error: ${JSON.stringify(err)}`);
                return { error: true, msg: 'Internal server error' }

            });
        return response;
    }

    async addDataSource(reqData, apartment = false) {
        const response = await API.post(`/bot/upload-data-sources?apartment=${apartment}`, reqData)
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                LogService.error(`BotService -> addDataSource -> error: ${JSON.stringify(err)}`);
                return { error: true, msg: 'Internal server error' }

            });
        return response;
    }


    async trainBot(reqData) {
        const response = await API.post('/bot/train', { ...reqData })
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                LogService.error(`BotService -> trainBot -> error: ${JSON.stringify(err)}`);
                return { error: true, msg: 'Internal server error' }

            });
        return response;
    }

    async getBotsByUserId(reqData) {
        const response = await API.post('/bot/get-all-bots-by-user', { ...reqData })
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                LogService.error(`BotService -> getBotsByUserId -> error: ${JSON.stringify(err)}`);
                return { error: true, msg: 'Internal server error' }

            });
        return response;
    }

    async getBotsById(reqData) {
        const response = await API.post('/bot/get-bot-by-id', { ...reqData })
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                LogService.error(`BotService -> getBotsById -> error: ${JSON.stringify(err)}`);
                return { error: true, msg: 'Internal server error' }

            });
        return response;
    }

    async chat(reqData) {
        const response = await API.post('/bot/chat', { ...reqData })
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                LogService.error(`BotService -> chat -> error: ${JSON.stringify(err)}`);
                return { error: true, msg: 'Internal server error' }

            });
        return response;
    }
    // getTokenCounts

    async addQA(reqData) {
        const response = await API.post('/bot/add-qa', { ...reqData })
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                LogService.error(`BotService -> addQA -> error: ${JSON.stringify(err)}`);
                return { error: true, msg: 'Internal server error' }

            });
        return response;
    }

    async createScript(reqData) {
        const response = await API.post('/bot/get-script', { ...reqData })
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                LogService.error(`BotService -> createScript -> error: ${JSON.stringify(err)}`);
                return { error: true, msg: 'Internal server error' }

            });
        return response;
    }

    async deleteChatbot(reqData) {
        const response = await API.post('/bot/delete', { ...reqData })
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                LogService.error(`BotService -> deleteChatbot -> error: ${JSON.stringify(err)}`);
                return { error: true, msg: 'Internal server error' }

            });
        return response;
    }

    async generateAIResponse(reqData) {
        const response = await API.post('/bot/ai-reply', reqData)
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                LogService.error(`BotService -> generateAIResponse -> error: ${JSON.stringify(err)}`);
                return { error: true, msg: 'Internal server error' }

            });
        return response;
    }

    async getAllNotification() {
        const response = await API.get('/bot/notifications')
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                LogService.error(`BotService -> getAllNotification -> error: ${JSON.stringify(err)}`);
                return { error: true, msg: 'Internal server error' }

            });
        return response;
    }

    async markNotificationAsRead() {
        const response = await API.get('/bot/update-notification')
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                LogService.error(`BotService -> markNotificationAsRead -> error: ${JSON.stringify(err)}`);
                return { error: true, msg: 'Internal server error' }

            });
        return response;
    }

    async getCounts(reqData) {
        const response = await API.get(`/bot/get-count?userType=${reqData['userType']}&userId=${reqData['userId']}`)
            .then((res) => {
                return res.data
            })
            .catch((err) => {
                LogService.error(`BotService -> getBotCount -> error: ${JSON.stringify(err)}`);
                return { error: true, msg: 'Internal server error' }
            })
        return response;
    }

    async getConversations(reqData) {
        const response = await API.post('/bot/conversational-log', reqData)
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                console.error(`BotService -> conversationallog -> error: ${JSON.stringify(err)}`);
                return { error: true, msg: 'Internal server error' }

            });
        return response;
    }

    async getConversationsByDate(reqData) {
        const response = await API.post('/bot/search-conversations', reqData)
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                console.error(`BotService -> getConversationsByDate -> error: ${JSON.stringify(err)}`);
                return { error: true, msg: 'Internal server error' }

            });
        return response;
    }
    async generateQR(reqData) {
        const response = await API.post('/bot/generate-qr',reqData)
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                console.error(`BotService -> generateQR -> error: ${JSON.stringify(err)}`);
                return { error: true, msg: 'Internal server error' }

            });
        return response;
    }

    async deleteDataSources(reqData) {
        const response = await API.post('/bot/delete-file',reqData)
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                console.error(`BotService -> deleteDataSources -> error: ${JSON.stringify(err)}`);
                return { error: true, msg: 'Internal server error' }

            });
        return response;
    }

    async updateMessageCount(reqData) {
        const response = await API.post('/bot/update-msg-count',reqData)
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                console.error(`BotService -> updateMessageCount -> error: ${JSON.stringify(err)}`);
                return { error: true, msg: 'Internal server error' }

            });
        return response;
    }

}

export default new BotService();

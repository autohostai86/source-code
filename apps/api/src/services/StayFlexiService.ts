import logger from "@app/loaders/logger";
import axios from "axios";

class StayFlexiService {
    async sendMessage(reqData): Promise<any> {
        try {
            const response = await axios.post(
                `https://api.stayflexi.com/core/api/v1/beservice/airbnb/post-message?hotelId=${reqData['hotelId']}`,
                {threadId: reqData['threadId'], message: reqData['message']},
                {
                    headers: {
                        'X-SF-API-KEY': reqData['authToken']
                    },
                }
            ).then((res) => {
                const { code } = res.data
                if (code == 200) {
                    return { error: false, msg: 'Message is sent successfully' }
                } else {
                    return { error: true, msg: 'Failed to send message' }    
                }
            })
            .catch((error) => {
                logger.error(`StayFlexiService -> sendMessage -> error: ${JSON.stringify(error)}`);
                return { error: true, msg: 'Internal server error' }
            })

            return response;
            
        } catch (error) {
            logger.error(`StayFlexiService -> sendMessage -> error: ${error.message}`);
            return { error: true, message: 'Internal server error' }
        }
    }
}

export default new StayFlexiService();
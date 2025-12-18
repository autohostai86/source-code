import React, { useState, useEffect } from 'react'
import BotService from '../services/BotService';
import ChatBot from "react-chatbotify";
import "react-chatbotify/dist/react-chatbotify.css";

const Bot = ({ botId }) => {
    const [botData, setBotData] = useState({});
    const getBotData = async () => {
        const { error, data } = await BotService.getBotsById({ botId: botId });
        if (!error) {
            setBotData(data);
        }
    }

    const getAnswer = async (query) => {
        const { error, data, msg } = await BotService.chat({ sourcePath: botData?.['vectorPath'], question: query });
        if (!error) {
            if (data) {
                return data['text'];
            } else {
                return msg;
            }
        } else {
            return msg;
        }
    }

    const flow = {
        start: {
            message: `${botData?.['initialMessage'] ? botData?.['initialMessage'] : "Hi, How may I help you 😊!"}`,
            path: "ask_query",
            transition: { duration: 2000 },
        },
        ask_query: {
            message: "Please ask your question",
            path: 'get_answer'
        },
        get_answer: {
            message: async (params) => {
                const answer = await getAnswer(params.userInput);
                return answer;
            },
            path: 'get_answer'
        },
    }

    useEffect(() => {
        getBotData();
    }, [])

    return (
        <div>
            <h1>Bot is here</h1>
            {
                botData['_id'] && (

                    <ChatBot
                        options={{
                            // @ts-ignore
                            header: { title: botData?.['title'] ? botData?.['title'] : "Chatbot" },
                            footer: { text: 'Powered By Vinnovate Technologies' }
                        }}
                        flow={flow}
                    />
                )
            }
        </div>
    )
}

export default Bot;

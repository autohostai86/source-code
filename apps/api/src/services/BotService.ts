/** @format */
import logger from '@app/loaders/logger';
import botModel from '@app/models/botModel';
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { RetrievalQAChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { OpenAI as openai } from "openai";
import { encoding_for_model } from "@dqbd/tiktoken";
import { PromptTemplate } from "langchain/prompts";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { TextLoader } from "langchain/document_loaders/fs/text";
import fs from 'fs';
import path from 'path';
import { DEVELOPMENT, PRODUCTION } from '@app/constants';
import { io } from '@app/loaders/socketIO';
import notificationModel from '@app/models/notificationModel';
import UrgentTagModel from '@app/models/UrgentTagModel';
import conversationalLogModel from '@app/models/conversationalLogModel';
import mongoose from 'mongoose';
import QRCode from 'qrcode';
import axios from 'axios';
import { getDistance } from 'geolib';
import nodemailer from 'nodemailer';
import UserService from './UserService';
import settingsModel from '@app/models/settingsModel';
import NotificationService from './NotificationService';
import subscribedPlansModel from '@app/models/subscribedPlansModel';


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: "no-reply@autohostai.com",
        pass: "nufn evzn xrnj iviy",
    },
});

class BotService {
    // create bot
    async createBot(reqData): Promise<any> {
        try {
            const create = await botModel.create(reqData);
            return { error: false, msg: 'Bot created successfully', data: create }

        } catch (error) {
            logger.error(`BotService -> createBot -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }
    //update bot Status 
    async updateBot(reqData): Promise<any> {
        try {
            const updatedUser = await botModel.findOneAndUpdate(
                { userId: reqData.userId },
                { $set: { isOffline: true } },
                { new: true }
            );
            return { error: false, msg: 'Bot isOffline Status Updated Successfully', data: "Bot isOffline Status Updated Successfully" }

        } catch (error) {
            logger.error(`BotService -> updateBot -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }


    // add data sources
    async addDataSources(reqData): Promise<any> {
        try {
            // get the current bot data
            const bot = await botModel.findById(reqData['botId']);
            if (bot) {
                const sources = bot['dataSourceFiles'] && bot['dataSourceFiles'].length > 0 ? bot['dataSourceFiles'].concat(reqData['sources']) : reqData['sources'];
                const updateBot = await botModel.findByIdAndUpdate(reqData['botId'], { dataSourceFiles: sources }, {new: true});
                return { error: false, msg: 'Data sources added successfully, please retrain your bot to update trained data', updatedBot: updateBot };
            } else {
                logger.warn(`BotService -> addDataSources -> Could not find bot details`)
                return { error: true, msg: 'Could not find bot details'}
            }

        } catch (error) {
            logger.error(`BotService -> addDataSources -> error: ${error.message}`);
            return { error: true, message: 'Internal server error' }
        }
    }


    // train chatbot
    async trainChatbot(reqData): Promise<any> {
        try {
            // Get the current bot data
            const bot = await botModel.findById(reqData['botId']);
            if (!bot) {
                logger.warn(`BotService -> trainChatbot -> Could not find bot details`);
                return { error: true, msg: 'Could not find bot details' };
            }
    
            if (bot['dataSourceFiles'].length === 0 && bot['qa'].length === 0 && bot['listing'].length === 0) {
                return { error: false, msg: 'No data source found' };
            }
    
            // Define the source file path based on environment
            const folderPath = global.process.env.NODE_ENV === PRODUCTION
                ? `/usr/src/app/uploads/botDocuments/${reqData['botId']}`
                : `/usr/src/app/apps/api/uploads/botDocuments/${reqData['botId']}`;
    
            const splitter = new RecursiveCharacterTextSplitter({
                chunkSize: 1000,
                chunkOverlap: 20,
            });
    
            if (!fs.existsSync(folderPath)) {
                logger.error(`BotService -> trainChatbot -> No source file folder found`);
                return { error: true, msg: 'No source file found' };
            }
    
            const files = fs.readdirSync(folderPath);
            if (files.length === 0) {
                logger.error(`BotService -> trainChatbot -> No source file found`);
                return { error: true, msg: 'No source file found' };
            }
    
            const vectorPaths = [];
            for (const file of files) {
                const subDirs = path.join(folderPath, file);
                const sourceFiles = fs.readdirSync(subDirs);
                if (sourceFiles.length === 0) continue;
                // console.log(sourceFiles);
                let splittedDocs = [];
                await Promise.all(sourceFiles.map(async (sourceFile) => {
                    const filePath = `${subDirs}/${sourceFile}`;
                    let loader;
    
                    if (path.extname(filePath) === '.pdf') {
                        loader = new PDFLoader(filePath);
                    } else if (path.extname(filePath) === '.json') {
                        const jsonContent = fs.readFileSync(filePath, 'utf8');
                        const jsonObject = JSON.parse(jsonContent);
                        if (Object.keys(jsonObject).length > 0) {
                            const keyValuePairs = [];
        
                            function traverse(obj, prefix = '') {
                                for (const key in obj) {
                                    const fullKey = prefix ? `${prefix} ${key}` : key;
                                    const value = obj[key];
        
                                    if (typeof value === 'object' && value !== null) {
                                        traverse(value, fullKey);
                                    } else {
                                        keyValuePairs.push(`${fullKey}: ${value}`);
                                    }
                                }
                            }
        
                            traverse(jsonObject);
                            const documentString = keyValuePairs.join(', ');
        
                            splittedDocs.push({
                                pageContent: documentString,
                                metadata: { source: sourceFile }
                            });
                        }
                        return;
                    } else if (path.extname(filePath) === '.txt') {
                        loader = new TextLoader(filePath);
                    }
    
                    if (loader) {
                        const doc = await loader.load();
                        const splittedDoc = await splitter.splitDocuments(doc);
                        splittedDocs = splittedDocs.concat(splittedDoc);
                    }
                }));
    
                // Create embeddings
                const embeddings = new OpenAIEmbeddings({ openAIApiKey: global.process.env.OPEN_AI_KEY });
                const vectorStore = await HNSWLib.fromDocuments(splittedDocs, embeddings);
    
                // Define vector store path based on environment
                const vectorStorePath = global.process.env.NODE_ENV === PRODUCTION
                    ? `/usr/src/app/uploads/vectors/${reqData['botId']}/${file}`
                    : `/usr/src/app/apps/api/uploads/vectors/${reqData['botId']}/${file}`;
    
                if (!fs.existsSync(vectorStorePath)) {
                    fs.mkdirSync(vectorStorePath, { recursive: true });
                }
    
                await vectorStore.save(vectorStorePath)
                    .then(async () => {
                        vectorPaths.push({ path: vectorStorePath, apartment: file });
                    })
                    .catch(() => {
                        logger.error(`BotService -> trainChatbot -> vector db could not be saved for ${file}`);
                    });
            }
    
            if (vectorPaths.length > 0) {
                const update = await botModel.findByIdAndUpdate(reqData['botId'], { vectorPath: vectorPaths }, { new: true });
                return { error: false, msg: 'Bot has been trained successfully', data: update };
            } else {
                logger.error(`BotService -> trainChatbot -> vectorPaths array is empty`);
                return { error: true, msg: 'Bot could not be trained' };
            }
        } catch (error) {
            logger.error(`BotService -> trainChatbot -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' };
        }
    }


    // get bots by user id
    async getBotsByUserId(reqData): Promise<any> {
        try {
            let bots: any;
            if (reqData['userType'] === 'admin') {
                bots = await botModel.find().populate('userId');
            } else {
                bots = await botModel.find({ userId: reqData['userId'] });
            }
            return { error: false, data: bots };

        } catch (error) {
            logger.error(`BotService -> getBotsByUserId -> error: ${error.message}`);
            return { error: true, message: 'Internal server error' }
        }
    }

    // get bot by id
    async getBotById(reqData): Promise<any> {
        try {
            // get the current bot data
            const bot = await botModel.findById(reqData['botId']);
            return { error: false, data: bot };

        } catch (error) {
            logger.error(`BotService -> getBotById -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }

    // Count token usage
    async numTokensFromString(message): Promise<any> {
        try {
            const encoder = encoding_for_model("gpt-4o");
            const tokens = encoder.encode(message);
            encoder.free();
            return tokens.length;
        } catch (error) {
            logger.error(`BotService -> numTokensFromString -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }

    async handleCost(usage, reqData): Promise<any> {
        try {
            const promptTokens = usage?.["prompt_tokens"] || 0;
            const completionTokens = usage?.["completion_tokens"] || 0;
            const totalTokens = promptTokens + completionTokens;

            const inputCost = (promptTokens / 1000) * 0.0025;
            const outputCost = (completionTokens / 1000) * 0.01;
            const totalCost = Number(((inputCost + outputCost) * 86).toFixed(6));
            await subscribedPlansModel.findOneAndUpdate(
                {
                  userId: reqData.userId,
                  botId: reqData.botId,
                },
                {
                  $inc: { availableBalance: -totalCost },
                },
                { new: true }
            );
        } catch (error) {
            logger.error(`BotService -> numTokensFromString -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }


    async getNearbyPlaces(lat: number, lng: number, question: string): Promise<any> {
        // const googleMapsApiKey = "AIzaSyDb1RxdDKcMh7e2RpTpwwk_qzaKfry9fQA";
        // const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&keyword=${question}&key=${googleMapsApiKey}`;
        // console.log(url);
        // try {
        //     const response = await axios.get(url);
        //     return response.data;
        // } catch (error) {
        //     logger.error(`BotService -> getNearbyPlaces -> Error fetching from Google Maps API: ${error.message}`);
        //     throw new Error('Error fetching nearby places from Google Maps');
        // }
        const googleMapsApiKey = "AIzaSyDb1RxdDKcMh7e2RpTpwwk_qzaKfry9fQA";
        const url = `https://places.googleapis.com/v1/places:searchText`;
        logger.info(`Calling google maps api`);
        try {
            const response = await axios.post(url, {
                textQuery: question,
                locationBias: {
                    circle: {
                        center: {
                            latitude: lat,
                            longitude: lng
                        },
                        radius: 5000.0
                    }
                },
                maxResultCount: 5
            }, {
                headers: {
                    "X-Goog-Api-Key": googleMapsApiKey,
                    "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.location"
                }
                
            });
            return response.data;
        } catch (error) {
            logger.error(`BotService -> getNearbyPlaces -> Error fetching from Google Maps API: ${error.message}`);
            throw new Error('Error fetching nearby places from Google Maps');
        }
    }

    async sendEmergencyMessage(reqData): Promise<any> {
        try {
            const user = await botModel.findById(reqData['botId']).populate('userId');
            
            if (user) {
                // user is not available
                const htmlData = `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Notification</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                
                                margin: 0;
                                padding: 0;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                height: 100vh;
                            }
                            .container {
                                border: 1px solid #444;
                                padding: 20px;
                                border-radius: 10px;
                                max-width: 600px;
                                text-align: left;
                            }
                            . {
                                text-align: center;
                                margin-bottom: 20px;
                            }
                            . img {
                                max-width: 150px;
                            }
                            .highlight {
                                background-color: #ffd700;
                                color: #000;
                                padding: 2px 5px;
                                border-radius: 3px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div style="text-align:center">
                                <img src="https://autohostai.com/assets/img/whitelogo.png" alt="bot.com " style="background-color: #10275B; padding: 5%">
                            </div>
                            <p style="font-size: 18px">You have recieved a new message from a guest<br/></p>
                            <p style="font-style: italic;font-size: 18px">"${reqData['message']}"</p>
                            <p style="font-size: 18px">Thanks!<br>
                            - <span style="font-weight: bold">AutoHost AI</span></p>
                        </div>
                    </body>
                </html>`;

                const info = await transporter.sendMail({
                    from: '"AutoHost AI" <no-reply@autohostai.com>', // sender address
                    to: user?.['userId']?.['email'], // list of receivers
                    subject: "Emergency message notification", // Subject line
                    html: htmlData, // html body
                });

                logger.info(`Email is sent successfully: ${info.messageId}`);
                
            }
        } catch (error) {
            logger.error(`BotService ->  sendEmergencyMessage-> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }

    async isValidJson(jsonData: any) {
        try {
            const jsonObject = JSON.parse(jsonData);
            logger.info(jsonObject);
            return true;
        } catch (error) {
            logger.error("Invalid JSON:", error.message);
            return false;
        }
        
    }

    // service to chat
    async chatWithData(reqData): Promise<any> {
        try {

            const subscriptionFilter = {
                userId: new mongoose.Types.ObjectId(reqData["userId"]),
                botId: new mongoose.Types.ObjectId(reqData["botId"])
            }
            const subscriptionData = await subscribedPlansModel.findOne(subscriptionFilter).populate('billingId');
            if (subscriptionData) {
                logger.info(`found subscription plan`);
                if (subscriptionData["billingId"]["category"] === "free") {
                    logger.info(`Subscription plan is free`);
                    if (subscriptionData["isExpired"] === true) {
                        logger.info(`Subscription plan is free and expired`);
                        return { error: true, msg: "We’re unable to process your request due to insufficient balance." }
                    }
                }

                if (subscriptionData["billingId"]["category"] === "payAsYouGo") {
                    logger.info(`Subscription plan payAsYouGo`);
                    const currentBalance = Number(subscriptionData["availableBalance"] || 0);
                    const minimumBalanceRequired = 1;
                    logger.info(`Subscription plan payAsYouGo and currentBalance ${currentBalance}`);
                    if (currentBalance <= minimumBalanceRequired ) {
                        return {
                            error: true,
                            msg: 'We’re unable to process your request due to insufficient balance.',
                        };
                    }
                }
            }
            // check whether the data source is available
            if (!fs.existsSync(`${reqData['sourcePath']}/hnswlib.index`)) {
                logger.error(`BotService -> chatWithData -> vector source not found`);
                
                const openAIClient = new openai({
                    apiKey: global.process.env.OPEN_AI_KEY
                });
                const response = await openAIClient.chat.completions.create({
                    model: "gpt-4o",
                    messages: [
                        {
                            "role": "system",
                            "content": `You will be provided with a question. If you don't have specific information about the query, respond politely by informing the user that the host has been notified to provide the necessary details. Avoid adding follow-up assistance offers or unrelated remarks.`
                        },
                        {
                            "role": "user",
                            "content": reqData['question'],
                            // content: `Question: "${question}"\n\nClassification:\nPlace:`
                        }
                    ],
                    temperature: 0.5,
    
                });
                this.handleCost(response.usage || {}, reqData);
                await UserService.sendNotificationOfMessage({userId: reqData['userId'], message: reqData['question']});
                return { error: true, msg: response?.choices?.[0]?.message?.content }
            } else {
                
                // Load the vector store and retrieve the retriever
                const embeddings = new OpenAIEmbeddings({ openAIApiKey: process.env.OPEN_AI_KEY });
                const vectorStore = await HNSWLib.load(reqData['sourcePath'], embeddings);
                const vectorStoreRetriever = vectorStore.asRetriever();

                // User query
                const question = reqData['question'].trim();
                
                // Retrieve relevant context
                const topResults = await vectorStoreRetriever.getRelevantDocuments(question);

                // Generate context from retrieved results
                const context = topResults
                .map(result => result.pageContent) // Use `pageContent` if that's where text is stored
                .join('\n') || "No relevant information available in the context.";

                
                // const systemMessage = `
                // You are an AI assistant specialized in answering accommodation-related queries.
                // - Provide clear, accurate, and concise responses based on the given context.
                // - Do NOT add phrases like "According to the context provided" unless explicitly requested.
                // - Ensure responses strictly answer only what is asked, without adding extra details.
                // - If the query can be answered with a simple "Yes" or "No", provide only that response.
                // - If a slightly expanded response is necessary for clarity, keep it brief and avoid adding information not explicitly requested by the user.
                // - If the query is unrelated to accommodations, politely indicate that you can only assist with accommodation-related queries.
                // - If no relevant information is found in the context, strictly return the following JSON structure:
                // {"answer": false, "msg": "Extremely sorry, please contact the property manager. If a contact number is available in the context, provide it."}
                // - If relevant information is found in the context, strictly return the following JSON structure:
                // {"answer": true, "msg": "<your response here. Make sure you are giving the answer to what is asked by user only and do not include extra details>"}
                // - If partial information is available but does not fully answer the query, return the most relevant details instead of saying "no information found." Also, avoid saying "The context does not provide specific information." Instead, use something like "As per the information I have."
                // - If the user's query is unclear or ambiguous, ask for clarification before generating a response.
                // - Do not deviate from the required JSON format under any circumstances.
                // `;
                const systemMessage = `
                You are an AI assistant specialized in answering accommodation-related queries.
                - Provide clear, accurate, and concise responses based on the given context.
                - Do NOT add phrases like "According to the context provided" unless explicitly requested.
                - Instead, **always respond naturally**, as if you are knowledgeable about the topic.
                - Ensure responses strictly answer only what is asked, without adding extra details.
                - If the query can be answered with a simple "Yes" or "No", provide only that response.
                - If a slightly expanded response is necessary for clarity, keep it brief and avoid adding information not explicitly requested by the user.
                - If the query is unrelated to accommodations, politely indicate that you can only assist with accommodation-related queries.
                - If no relevant information is found in the context, return the following JSON structure:
                  {"answer": false, "msg": "Extremely sorry, as I do not have correct information about it please contact the property manager. If a contact number is available in the context, provide it."}
                - If relevant information is found in the context, return the following JSON structure:
                  {"answer": true, "msg": "<your response here. Make sure you are giving the answer to what is asked by user only and do not include extra details>"}
                - If **partial** information is available:
                  - **DO NOT say** "There is no mention of..."
                  - **Instead, respond in this format**:
                    - ✅ "The accommodation has a 4-burner gas stove. However, I couldn't find details about an oven. Please contact the property owner for confirmation."
                  - This ensures responses are **clear, helpful, and user-friendly.**
                - If the user's query is unclear or ambiguous, ask for clarification before generating a response.
                - **Always return responses in the following JSON format:**
                  {"answer": true, "msg": "<your response here>"}
                - Even if the response is a simple greeting, confirmation, or farewell (e.g., "You're welcome!", "Thank you!", "Let me know if you need anything else."), it must still follow the JSON format:
                  {"answer": true, "msg": "You're welcome! If you have any other questions, feel free to ask."}
                - Do not deviate from the required JSON format under any circumstances.
                `;


                console.log(reqData['session']);


                // Build the chat messages
                const messages = [
                    { role: "system", content: systemMessage },
                    ...reqData['session'],
                    { role: "assistant", content: `Context: ${context}` },
                    { role: "user", content: question },
                ];

                const openAIClient = new openai({
                    apiKey: global.process.env.OPEN_AI_KEY
                });
                
                const response = await openAIClient.chat.completions.create({
                    model: "gpt-4",
                    // @ts-ignore
                    messages: messages,
                    temperature: 0.7,
                });

                // console.log(response);

                // Extract the answer
                // @ts-ignore
                const answer = response.choices[0].message.content.trim();
                this.handleCost(response.usage || {}, reqData);
                
                console.log(answer);
                console.log(typeof answer);
                const isValid = await this.isValidJson(answer);
                console.log(isValid);
                if (isValid) {
                    const jsonObject = JSON.parse(answer);
                    console.log(jsonObject);
                    let finalAnswer = '';
                    if (jsonObject["answer"]) {
                        finalAnswer =jsonObject?.["msg"]?.replace(/\s*\[.*?\]\s*/g, ' ').trim()
                    } else {
                        // classify the question
                        const classify = await this.classifyQuestion(reqData['question'], reqData);
                        if (classify.isEmergency === true) {
                            // send emergency message
                            const pathArr = reqData['sourcePath'].split('/');
                            let botId = '';
                            if (global.process.env.NODE_ENV === PRODUCTION) {
                                botId = pathArr?.[6];
                            }
            
                            if (global.process.env.NODE_ENV === DEVELOPMENT) {
                                botId = pathArr?.[8];
                            }                   
                            
                            await this.sendEmergencyMessage({ message: reqData['question'], botId: botId });
                            return { error: false, data: { text: `We have notified the host, he will contact you shortly. Thanks` } }
                        }
    
                        if (classify.isLocation) {
                            // answer is not found and question is related to location
                            // get bot data
                            const pathArr = reqData['sourcePath'].split('/');
                            let botId = '';
                            let aptNo = '';
                            if (global.process.env.NODE_ENV === PRODUCTION) {
                                botId = pathArr?.[6];
                                aptNo = pathArr?.[7];
                            }
            
                            if (global.process.env.NODE_ENV === DEVELOPMENT) {
                                botId = pathArr?.[8];
                                aptNo = pathArr?.[9];
                            }
                            console.log(botId, aptNo);
                            const { data } = await this.getBotById({botId: botId});
                            
                            const result = data?.['listing']?.find(item => item.internalListingName === aptNo);
                            
                            const lat = result?.['lat'] ? result?.['lat'] : 0;
                            const lng = result?.['lng'] ? result?.['lng'] : 0;
    
                            
                            // search via google map
                            const response = await this.getNearbyPlaces(lat, lng, reqData?.['question']);
                            
                            // console.log(response);
                            let dynamicResponse = '';
                            
                            if (response?.['places'] && response?.['places']?.length > 0) {
                                const places = response?.['places']?.map(place => {
                                    
                                    const distance = getDistance(
                                        { latitude: lat, longitude: lng },
                                        { latitude: place.location.latitude, longitude: place.location.longitude }
                                    );
                                    return {
                                        name: place.displayName.text,
                                        distance: (distance / 1000).toFixed(2) // Distance in kilometers
                                    };
                                });
                                dynamicResponse =  await this.rewriteResponse({question: reqData?.['question'], answer: `${places.map(place => `${place.name} - ${place.distance}KM,`).join('\n')}`, userId: reqData["userId"], botId: reqData["botId"]});
                            } else {
                                dynamicResponse =  await this.rewriteResponse({question: reqData?.['question'], answer: `no data found`, userId: reqData["userId"], botId: reqData["botId"]});
                            }
                            reqData['session'].push({role: "user", content: question});
                            reqData['session'].push({role: "assistant", content: finalAnswer});
                            reqData['sessionMethod'].save();
                            return { error: false, data: { text: dynamicResponse } }
    
                        }
    
                        finalAnswer =jsonObject?.["msg"]?.replace(/\s*\[.*?\]\s*/g, ' ').trim();
                    }
                    reqData['session'].push({role: "user", content: question});
                    reqData['session'].push({role: "assistant", content: finalAnswer});
                    reqData['sessionMethod'].save();
                    return { error: false, data: { text: finalAnswer } }
                } else {
                    reqData['session'].push({role: "user", content: question});
                    reqData['session'].push({role: "assistant", content: answer.replace(/\s*\[.*?\]\s*/g, ' ').trim()});
                    reqData['sessionMethod'].save();
                    return { error: false, data: { text: answer.replace(/\s*\[.*?\]\s*/g, ' ').trim() } }
                }
            }


        } catch (error) {
            logger.error(`BotService -> chatWithData -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }


    // create qa
    async createQA(reqData): Promise<any> {
        try {
            if (reqData['qa'].length > 0 && reqData['qa'][0]['question']) {
                const currentData = await botModel.findById(reqData['botId']);
                let olderData: any = {};
                if (currentData['qa'] && Object.keys(currentData['qa']).length > 0) {
                    olderData = currentData['qa'];
                }

                const newArray = reqData['qa'].map(({ tableData, ...rest }) => rest);
                // console.log(newArray);
                if (Object.keys(olderData).length > 0) {
                    olderData = { ...olderData, [reqData['apartmentNo']]: newArray }

                } else {
                    olderData[reqData['apartmentNo']] = newArray;
                }

                // const apartObj = { [reqData['apartmentNo']]: newArray };
                // update the db
                const update = await botModel.findByIdAndUpdate(reqData['botId'], { qa: olderData }, { new: true });
                if (update) {

                    // create or overwrite json
                    let dirPath = '';
                    const fileName = 'qa.json';

                    if (global.process.env.NODE_ENV === PRODUCTION) {
                        dirPath = `/usr/src/app/uploads/botDocuments/${reqData['botId']}/${reqData['apartmentNo']}`;
                    }

                    if (global.process.env.NODE_ENV === DEVELOPMENT) {
                        dirPath = `/usr/src/app/apps/api/uploads/botDocuments/${reqData['botId']}/${reqData['apartmentNo']}`;
                    }

                    if (!fs.existsSync(dirPath)) {
                        // file exists so remove it
                        // fs.rmSync(dirPath, {recursive: true});
                        fs.mkdirSync(dirPath, { recursive: true });
                    }
                    // write data to file
                    const file = fs.writeFileSync(`${dirPath}/${fileName}`, JSON.stringify(newArray));
                    return { error: false, msg: 'Data is added successfully', data: update }
                } else {
                    return { error: true, msg: 'Could not update the record' }
                }
            } else {
                logger.error(`BotService -> createQA -> data format is wrong`);
                return { error: true, msg: 'Could not update the record' }
            }

        } catch (error) {
            logger.error(`BotService -> createQA -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }


    // generating html codes with scripts for publishing
    async generateScript(reqData): Promise<any> {
        try {
            // get the current bot data
            const bot = await botModel.findById(reqData['botId']);
            if (bot) {
                let folderPath = '';

                if (global.process.env.NODE_ENV === PRODUCTION) {
                    folderPath = `/usr/src/app/web-build/chatapp`;
                }

                if (global.process.env.NODE_ENV === DEVELOPMENT) {
                    folderPath = `/usr/src/app/dist/apps/chatapp`;
                }

                if (fs.existsSync(folderPath)) {
                    const files = fs.readdirSync(folderPath);
                    if (files.length > 0) {
                        const scriptArr = [];
                        scriptArr.push(`<div id="root"></div>`);
                        files.forEach((file) => {
                            if (file.endsWith('esm.js')) {
                                scriptArr.push(`<script src="${process.env.SERVER_URL}/chatapp/${file}" type="module"></script>`);
                            }
                        });
                        scriptArr.push(`<script>window.botId="${reqData['botId']}"</script>`);
                        return { error: false, data: scriptArr, msg: "Scripts are generated successfully" }
                    } else {
                        logger.error(`BotService -> generateScript -> no files found on the directory`);
                        return { error: true, msg: 'Could not find source' };
                    }
                } else {
                    logger.error(`BotService -> generateScript -> source folder is not found`);
                    return { error: true, msg: 'Could not find source' };
                }
            } else {
                return { error: true, msg: 'Invalid bot key' };
            }

        } catch (error) {
            logger.error(`BotService -> generateScript -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }

    // deleting bot
    async deleteBot(reqData): Promise<any> {
        try {
            // get the current bot data
            const bot = await botModel.findById(reqData['botId']);
            if (bot) {
                let dataSourcePath = '';
                let vectorPath = '';

                if (global.process.env.NODE_ENV === PRODUCTION) {
                    dataSourcePath = `/usr/src/app/uploads/botDocuments/${reqData['botId']}`;
                    vectorPath = `/usr/src/app/uploads/vectors/${reqData['botId']}`;
                }

                if (global.process.env.NODE_ENV === DEVELOPMENT) {
                    dataSourcePath = `/usr/src/app/apps/api/uploads/botDocuments/${reqData['botId']}`;
                    vectorPath = `/usr/src/app/apps/api/uploads/vectors/${reqData['botId']}`;
                }

                if (fs.existsSync(dataSourcePath)) {
                    // folder exists
                    fs.rmdirSync(dataSourcePath, { recursive: true });
                }

                if (fs.existsSync(vectorPath)) {
                    // folder exists
                    fs.rmdirSync(vectorPath, { recursive: true });
                }

                // delete from other connected collections
                await Promise.all([
                    conversationalLogModel.deleteMany({ botId: reqData['botId'] }),
                ]);

                // delete bot data
                await botModel.findByIdAndDelete(reqData['botId']);
                return { error: false, msg: 'Bot has been deleted successfully' };
            } else {
                return { error: true, msg: 'Invalid bot key' };
            }

        } catch (error) {
            logger.error(`BotService -> generateScript -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }


    // service to generate response for message
    async generateResponse(reqData): Promise<any> {
        try {
            const chatBots = await botModel.findOne({ userId: mongoose.Types.ObjectId(reqData['userId']) });

            if (chatBots && chatBots['vectorPath'].length > 0) {
                const filtered = chatBots['vectorPath'].filter((x) => x.apartment == reqData['apartmentNo']);
                if (filtered.length > 0) {

                    // Load the vector store and retrieve the retriever
                    const embeddings = new OpenAIEmbeddings({ openAIApiKey: process.env.OPEN_AI_KEY });
                    const vectorStore = await HNSWLib.load(filtered[0]['path'], embeddings);
                    const vectorStoreRetriever = vectorStore.asRetriever();

                    // User query
                    const question = reqData['question'].trim();

                    // Retrieve relevant context
                    const topResults = await vectorStoreRetriever.getRelevantDocuments(question);


                    // Generate context from retrieved results
                    const context = topResults
                    .map(result => result.pageContent) // Use `pageContent` if that's where text is stored
                    .join('\n') || "No relevant information available in the context.";

                    
                    const systemMessage = `
                    You are an AI assistant specialized in answering accommodation-related queries.
                    - Provide clear, accurate, and concise responses based on the given context.
                    - Do NOT add phrases like "According to the context provided" unless explicitly requested.
                    - Instead, **always respond naturally**, as if you are knowledgeable about the topic.
                    - Ensure responses strictly answer only what is asked, without adding extra details.
                    - If the query can be answered with a simple "Yes" or "No", provide only that response.
                    - If a slightly expanded response is necessary for clarity, keep it brief and avoid adding information not explicitly requested by the user.
                    - If the query is unrelated to accommodations, politely indicate that you can only assist with accommodation-related queries.
                    - If no relevant information is found in the context, return the following JSON structure:
                    {"answer": false, "msg": "Extremely sorry, as I do not have correct information about it please contact the property manager. If a contact number is available in the context, provide it."}
                    - If relevant information is found in the context, return the following JSON structure:
                    {"answer": true, "msg": "<your response here. Make sure you are giving the answer to what is asked by user only and do not include extra details>"}
                    - If **partial** information is available:
                    - **DO NOT say** "There is no mention of..."
                    - **Instead, respond in this format**:
                        - ✅ "The accommodation has a 4-burner gas stove. However, I couldn't find details about an oven. Please contact the property owner for confirmation."
                    - This ensures responses are **clear, helpful, and user-friendly.**
                    - If the user's query is unclear or ambiguous, ask for clarification before generating a response.
                    - **Always return responses in the following JSON format:**
                    {"answer": true, "msg": "<your response here>"}
                    - Even if the response is a simple greeting, confirmation, or farewell (e.g., "You're welcome!", "Thank you!", "Let me know if you need anything else."), it must still follow the JSON format:
                    {"answer": true, "msg": "You're welcome! If you have any other questions, feel free to ask."}
                    - Do not deviate from the required JSON format under any circumstances.
                    `;


                    // Build the chat messages
                    const messages = [
                        { role: "system", content: systemMessage },
                        { role: "assistant", content: `Context: ${context}` },
                        { role: "user", content: question },
                    ];

                    const openAIClient = new openai({
                        apiKey: global.process.env.OPEN_AI_KEY
                    });
                    
                    const response = await openAIClient.chat.completions.create({
                        model: "gpt-4", // or "gpt-3.5-turbo"
                        // @ts-ignore
                        messages: messages,
                        temperature: 0.7,
                    });

                    // console.log(response);

                    // Extract the answer
                    // @ts-ignore
                    const answer = response.choices[0].message.content.trim();
                    
                    const pathArr = filtered[0]['path'].split('/');
                    let botId = '';
                    if (global.process.env.NODE_ENV === PRODUCTION) {
                        botId = pathArr?.[6];
                    }
    
                    if (global.process.env.NODE_ENV === DEVELOPMENT) {
                        botId = pathArr?.[8];
                    }
                    reqData["botId"] = botId;
                    this.handleCost(response.usage || {}, reqData);


                    //let finalAnswer = answer.replace(/\s*\[.*?\]\s*/g, ' ').trim();
                    // console.log(finalAnswer);
                    // return { error: false, data: { text: finalAnswer } }
                    console.log(answer);
                    console.log(typeof answer);
                    const isValid = await this.isValidJson(answer);
                    console.log(isValid);
                    if (isValid) {
                        const jsonObject = JSON.parse(answer);
                        console.log(jsonObject);
                        let finalAnswer = '';
                        if (jsonObject["answer"]) {
                            finalAnswer =jsonObject?.["msg"]?.replace(/\s*\[.*?\]\s*/g, ' ').trim()
                        } else {
                            // classify the question
                            const classify = await this.classifyQuestion(reqData['question'], reqData);
                            if (classify.isEmergency === true) {
                                // send emergency message                
                                await this.sendEmergencyMessage({ message: reqData['question'], botId: botId });
                                return { error: false, data: { text: `We have notified the host, he will contact you shortly. Thanks` } }
                            }
        
                            if (classify.isLocation) {
                                // answer is not found and question is related to location
                                // get bot data
                                const pathArr = filtered[0]['path'].split('/');
                                let aptNo = '';
                                if (global.process.env.NODE_ENV === PRODUCTION) {
                                    aptNo = pathArr?.[7];
                                }
                
                                if (global.process.env.NODE_ENV === DEVELOPMENT) {
                                    aptNo = pathArr?.[9];
                                }
                                console.log(botId, aptNo);
                                const { data } = await this.getBotById({botId: botId});
                                
                                const result = data?.['listing']?.find(item => item.internalListingName === aptNo);
                                
                                const lat = result?.['lat'] ? result?.['lat'] : 0;
                                const lng = result?.['lng'] ? result?.['lng'] : 0;
        
                                
                                // search via google map
                                const response = await this.getNearbyPlaces(lat, lng, reqData?.['question']);
                                
                                // console.log(response);
                                let dynamicResponse = '';
                                
                                if (response?.['places'] && response?.['places']?.length > 0) {
                                    const places = response?.['places']?.map(place => {
                                        
                                        const distance = getDistance(
                                            { latitude: lat, longitude: lng },
                                            { latitude: place.location.latitude, longitude: place.location.longitude }
                                        );
                                        return {
                                            name: place.displayName.text,
                                            distance: (distance / 1000).toFixed(2) // Distance in kilometers
                                        };
                                    });
                                    dynamicResponse =  await this.rewriteResponse({question: reqData?.['question'], answer: `${places.map(place => `${place.name} - ${place.distance}KM,`).join('\n')}`});
                                } else {
                                    dynamicResponse =  await this.rewriteResponse({question: reqData?.['question'], answer: `no data found`});
                                }
                                return { error: false, data: { text: dynamicResponse } }
        
                            }
        
                            finalAnswer =jsonObject?.["msg"]?.replace(/\s*\[.*?\]\s*/g, ' ').trim();
                        }
                        // reqData['session'].push({role: "user", content: question});
                        // reqData['session'].push({role: "assistant", content: finalAnswer});
                        return { error: false, data: { text: finalAnswer } }
                    } else {
                        // reqData['session'].push({role: "user", content: question});
                        // reqData['session'].push({role: "assistant", content: answer.replace(/\s*\[.*?\]\s*/g, ' ').trim()});
                        return { error: false, data: { text: answer.replace(/\s*\[.*?\]\s*/g, ' ').trim() } }
                    }
                } else {
                    logger.error(`BotService -> generateResponse -> Data source not found`);
                    reqData["botId"] = chatBots?._id;
                    const classify = await this.classifyQuestion(reqData['question'], reqData);
                    if (classify.isLocation) {
                        // console.log(chatBots);
                        
                        
                        const result = chatBots?.['listing']?.find((x: any) => x.internalListingName === reqData['apartmentNo']);
                        
                        const lat = result?.['lat'] ? result?.['lat'] : 0;
                        const lng = result?.['lng'] ? result?.['lng'] : 0;

                        
                        // search via google map
                        const response = await this.getNearbyPlaces(lat, lng, reqData?.['question']);
                        
                        console.log(response);
                        let dynamicResponse = '';
                        if (response?.['places'] && response?.['places']?.length > 0) {
                            const places = response?.['places']?.map(place => {
                                
                                const distance = getDistance(
                                    { latitude: lat, longitude: lng },
                                    { latitude: place.location.latitude, longitude: place.location.longitude }
                                );
                                return {
                                    name: place.displayName.text,
                                    distance: (distance / 1000).toFixed(2) // Distance in kilometers
                                };
                            });
                            dynamicResponse =  await this.rewriteResponse({question: reqData?.['question'], answer: `${places.map(place => `${place.name} - ${place.distance}KM,`).join('\n')}`});
                        } else {
                            dynamicResponse =  await this.rewriteResponse({question: reqData?.['question'], answer: `no data found`});
                        }
                        return { error: false, data: { text: dynamicResponse } }

                    }

                    const openAIClient = new openai({
                        apiKey: global.process.env.OPEN_AI_KEY
                    });
                    const response = await openAIClient.chat.completions.create({
                        model: "gpt-4o",
                        messages: [
                            {
                                "role": "system",
                                "content": `You will be provided with a question. If you don't have specific information about the query, respond politely by informing the user that the host has been notified to provide the necessary details. Avoid adding follow-up assistance offers or unrelated remarks.`
                            },
                            {
                                "role": "user",
                                "content": reqData['question'],
                                // content: `Question: "${question}"\n\nClassification:\nPlace:`
                            }
                        ],
                        temperature: 0.5,
        
                    });

                    // await UserService.sendNotificationOfMessage({userId: reqData['userId'], message: reqData['question']});
                    return { error: false, data: { text: response?.choices?.[0]?.message?.content } }
                }
            } else {
                if (chatBots) {
                    reqData["botId"] = chatBots?._id;
                }
                const classify = await this.classifyQuestion(reqData['question'], reqData);
                if (classify.isLocation) {
                    // console.log(chatBots);
                    
                    
                    const result = chatBots?.['listing']?.find((x: any) => x.internalListingName === reqData['apartmentNo']);
                    
                    const lat = result?.['lat'] ? result?.['lat'] : 0;
                    const lng = result?.['lng'] ? result?.['lng'] : 0;

                    
                    // search via google map
                    const response = await this.getNearbyPlaces(lat, lng, reqData?.['question']);
                    
                    console.log(response);
                    let dynamicResponse = '';
                    if (response?.['places'] && response?.['places']?.length > 0) {
                        const places = response?.['places']?.map(place => {
                            
                            const distance = getDistance(
                                { latitude: lat, longitude: lng },
                                { latitude: place.location.latitude, longitude: place.location.longitude }
                            );
                            return {
                                name: place.displayName.text,
                                distance: (distance / 1000).toFixed(2) // Distance in kilometers
                            };
                        });
                        dynamicResponse =  await this.rewriteResponse({question: reqData?.['question'], answer: `${places.map(place => `${place.name} - ${place.distance}KM,`).join('\n')}`});
                    } else {
                        dynamicResponse =  await this.rewriteResponse({question: reqData?.['question'], answer: `no data found`});
                    }
                    return { error: false, data: { text: dynamicResponse } }

                }

                const openAIClient = new openai({
                    apiKey: global.process.env.OPEN_AI_KEY
                });
                const response = await openAIClient.chat.completions.create({
                    model: "gpt-4o",
                    messages: [
                        {
                            "role": "system",
                            "content": `You will be provided with a question. If you don't have specific information about the query, respond politely by informing the user that the host has been notified to provide the necessary details. Avoid adding follow-up assistance offers or unrelated remarks.`
                        },
                        {
                            "role": "user",
                            "content": reqData['question'],
                            // content: `Question: "${question}"\n\nClassification:\nPlace:`
                        }
                    ],
                    temperature: 0.5,
    
                });

                await UserService.sendNotificationOfMessage({userId: reqData['userId'], message: reqData['question']});
                return { error: false, data: { text: response?.choices?.[0]?.message?.content } }
                // return { error: true, msg: 'Sorry your request could not be processed at the moment' }
            }


        } catch (error) {
            logger.error(`BotService -> generateResponse -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }


    // send notification
    async webhookNotification(reqData): Promise<any> {
        try {
            if (reqData['event'] && reqData['event'] === 'message.received') {
                const emitData = { accountId: reqData['accountId'], isSeen: false, data: reqData['data'] };
                const createOrUpdate = await notificationModel.findOneAndUpdate({ accountId: reqData['accountId'] }, emitData, { upsert: true });
                const emitEvent = io.emit('newMessage', emitData);
                logger.info(`New message notification is send: ${emitEvent}`);
            } else {
                logger.error(`Notification is failed due to incorrect format`);
            }
            return { error: false, msg: 'success' }

        } catch (error) {
            logger.error(`BotService -> webhookNotification -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }

    // get all unread notification
    async getAllNotification(): Promise<any> {
        try {
            const notifications = await notificationModel.find({ isSeen: false });
            return { error: false, data: notifications }

        } catch (error) {
            logger.error(`BotService -> getAllNotification -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }


    // update all notifications as read
    async updateAllNotification(): Promise<any> {
        try {
            const notifications = await notificationModel.updateMany({ isSeen: false }, { isSeen: true });
            return { error: false, msg: 'success' }

        } catch (error) {
            logger.error(`BotService -> updateAllNotification -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }

    async getCounts(reqData): Promise<any> {
        try {
            let tokenCount = 0
            let botCount = 0
            let i = 0
            // Bot count
            if (reqData['userType'] === 'admin') {
                botCount = await botModel.find().countDocuments()
                const documents = await botModel.find({});
                documents.forEach(document => {
                    // @ts-ignore
                    if (document.botToken && document.botToken.totalTokens !== undefined) {
                        i = i + 1
                        // @ts-ignore
                        const calculateToken = document.botToken['totalTokens'];
                        if (calculateToken) {
                            tokenCount = Math.ceil((tokenCount + calculateToken) / i)
                            return;
                        }
                    }
                });
            } else {
                botCount = await botModel.find({ userId: reqData['userId'] }).countDocuments();
            }
            // console.log(tokenCount)
            return { error: false, tokenCount, botCount }; // Return only the count
        } catch (error) {
            logger.error(`BotService -> getTokenCounts -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' };
        }
    }

    async rewriteResponse(data): Promise<any> {
        const openAIClient = new openai({
            apiKey: global.process.env.OPEN_AI_KEY
        });
        const completion = await openAIClient.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are an assistant tasked with rephrasing user questions and answers in a concise and to-the-point manner. 
- Acknowledge the user's question if applicable.
- List the provided information briefly without unnecessary details or embellishments.
- If no information is provided in the answer, apologize and suggest alternatives.`
                },
                {
                    role: "user",
                    content: `Question: "${data['question']}"\nAnswer: "${data['answer']}"`
                }
            ],
            temperature: 0.5,

        });

        const response = completion?.choices?.[0]?.message?.content || '';
        this.handleCost(completion.usage || {}, data);
        return `${response}\n\nWould you like me to help you with anything else?`;
    }

    async rewriteResponseFromAvailability(data): Promise<string> {
        const openAIClient = new openai({
            apiKey: global.process.env.OPEN_AI_KEY
        });

        const completion = await openAIClient.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are a helpful assistant that answers availability questions based on structured data.
                    Instructions:
                    - Always acknowledge the user's question.
                    - Clearly state whether the requested date range is fully available or not.
                    - If available, mention total days and price per night if consistent.
                    - If some dates are unavailable, politely state that.
                    - Avoid extra fluff. Be concise and natural.
                    - Don’t return JSON. Just return the response as you would say it to a user.`
                },
                {
                    role: "user",
                    content: `User's question: "${data['question']}"\n\nAvailability:\n${data['availability']
                    .map(d => `${d.date}: ${d.status}, ₹${d.price}`)
                    .join('\n')}`
                }
            ],
            temperature: 0.5
        });

        const response = completion?.choices?.[0]?.message?.content || '';
        this.handleCost(completion.usage || {}, data);
        return `${response}\n\nWould you like me to help you with anything else?`;
    }


    async classifyQuestion(question, reqData): Promise<any> {
        try {
            const tags = await UrgentTagModel.find({isActive: true, userId: reqData["userId"]}).select('title');
            let tagTitles: any = '';
            let tagListString: any = '';
            if (tags.length > 0) {
                tagTitles = tags.map(tag => tag.title.toLowerCase());
                tagListString = tagTitles.join(', ');
            }



            const openAIClient = new openai({
                apiKey: global.process.env.OPEN_AI_KEY
            });
            const classification = await openAIClient.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        "role": "system",
                        "content": `You will be provided with a question. Your task is to classify it as either "location-related" or "non-location-related". A question is "location-related" if it asks about a place, address, or geographical location. A question is "non-location-related" if it asks about policies, rules, or anything not specifically tied to a geographical location but if the question is telling about any emergency situation classify it as "emergeny" (e.g., ${tagListString}).`
                        // "content": `You will be provided with a question. Your task is to classify it as either "location-related" or "non-location-related". Additionally, if the question is "location-related", extract any place-related keywords ignore nearby.`
                    },
                    {
                        "role": "user",
                        "content": question,
                        // content: `Question: "${question}"\n\nClassification:\nPlace:`
                    }
                ],
                temperature: 0.5,

            });
            console.log(classification.usage);
            this.handleCost(classification.usage || {}, reqData);
            

            if (classification?.choices?.[0]?.message?.content) {
                const msg = classification?.choices?.[0]?.message?.content.trim();
                if (msg == 'Location-related' || msg == 'location-related') {
                    return { error: false, msg: msg, isLocation: true, isEmergency: false }
                } else if (msg == 'emergency' || msg == 'Emergency') {
                    return { error: false, msg: msg, isLocation: false, isEmergency: true }
                } else {
                    return { error: false, msg: msg, isLocation: false, isEmergency: false }
                }
            } else {
                return { error: true, msg: 'Could not identify' }
            }
        } catch (error) {
            logger.error(`BotService -> ClassifyQuestion -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' };
        }
    }

    async addConversationalLog(reqData): Promise<any> {
        try {
            const startDate = new Date();
            startDate.setHours(0, 0, 0, 0); // Set time to midnight (00:00:00.000)

            const endDate = new Date(startDate.getTime());
            endDate.setDate(endDate.getDate() + 1); // Set end date to next day (00:00:00.000)
            const findConversation = await conversationalLogModel.findOne({ botId: reqData['botId'], updatedAt: { $gte: startDate, $lt: endDate } })
            if (findConversation && findConversation.messages && findConversation.messages.length > 0) {
                findConversation.messages = findConversation.messages.concat(reqData["messages"]);
                await findConversation.save();
                return { error: false, msg: 'success' }
            } else {
                const addConversation = await conversationalLogModel.create(reqData);
                return { error: false, msg: 'success' }
            }
        } catch (error) {
            logger.error(`BotService -> conversationalLog -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }

    async getConversations(reqData): Promise<any> {
        try {
            if (reqData.userType === 'admin') {
                const response = await conversationalLogModel.find();
                return { error: false, data: response }
            } else {
                const conversations = await conversationalLogModel.aggregate([
                    {
                        $lookup: {
                            from: 'bots',
                            localField: 'botId',
                            foreignField: '_id',
                            as: 'bot'
                        }
                    },
                    {
                        $unwind: '$bot'
                    },
                    {
                        $lookup: {
                            from: 'admins',
                            localField: 'bot.userId',
                            foreignField: '_id',
                            as: 'user'
                        }
                    },
                    {
                        $unwind: '$user'
                    },
                    {
                        $match: {
                            'user._id': mongoose.Types.ObjectId(reqData['userId'])
                        }
                    },
                    {
                        // remove unwated fields
                        $project: {
                            'bot._id': 0,
                            'bot.userId': 0,
                            'user._id': 0,
                            'user.password': 0,
                        }
                    }
                ]);
                return { error: false, data: conversations };
            }

        } catch (error) {
            logger.error(`BotService -> getConversations -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }

    async getConversationsByDate(reqData): Promise<any> {
        try {
            const startDate = new Date(reqData.updatedAt);
            startDate.setHours(0, 0, 0, 0); // Set time to midnight (00:00:00.000)

            const endDate = new Date(startDate.getTime());
            endDate.setDate(endDate.getDate() + 1); // Set end date to next day (00:00:00.000)

            if (reqData.userType === 'admin') {
                const response = await conversationalLogModel.find({
                    updatedAt: { $gte: startDate, $lt: endDate },
                });
                if (!response || response.length === 0) {
                    return { error: true, msg: 'There is no data' };
                } else {
                    return { error: false, data: response, msg: 'Data fetched' };
                }
            } else {
                const conversations = await conversationalLogModel.aggregate([
                    {
                        $lookup: {
                            from: 'bots',
                            localField: 'botId',
                            foreignField: '_id',
                            as: 'bot'
                        }
                    },
                    {
                        $unwind: '$bot'
                    },
                    {
                        $lookup: {
                            from: 'admins',
                            localField: 'bot.userId',
                            foreignField: '_id',
                            as: 'user'
                        }
                    },
                    {
                        $unwind: '$user'
                    },
                    {
                        $match: {
                            'user._id': mongoose.Types.ObjectId(reqData['userId']),
                            updatedAt: { $gte: startDate, $lt: endDate },
                        }
                    },
                    {
                        // remove unwated fields
                        $project: {
                            'bot._id': 0,
                            'bot.userId': 0,
                            'user._id': 0,
                            'user.password': 0,
                        }
                    }
                ]);

                if (!conversations || conversations.length === 0) {
                    return { error: false, msg: 'There is no data' };
                } else {
                    return { error: false, data: conversations, msg: 'Data fetched' };
                }
            }
        } catch (error) {
            logger.error(`BotService -> getConversationsByDate -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' };
        }
    }
    async generateQR(reqData): Promise<any> {
        try {

            const qrData = `${process.env.SERVER_URL}/chatapp?botId=${reqData['botId']}&aptNo=${reqData['hostawayListId']}&aptName=${reqData['aptName']}&isOffline=true`;
            let folderPath = '';
            if (global.process.env.NODE_ENV === PRODUCTION) {
                folderPath = `/usr/src/app/uploads/${reqData['botId']}`;
            } else if (global.process.env.NODE_ENV === DEVELOPMENT) {
                folderPath = `/usr/src/app/apps/api/uploads/${reqData['botId']}`;
            } else {
                logger.error("Unknown environment. Please check NODE_ENV.");
                throw new Error("Unknown environment. Please check NODE_ENV.");
            }
            const outputPath = path.join(folderPath, `${reqData['hostawayListId']}.png`); // Save path
            const directory = path.dirname(outputPath);
            if (!fs.existsSync(directory)) {
                fs.mkdirSync(directory, { recursive: true });
            }
            try {
                await QRCode.toFile(outputPath, qrData);
                const updateQuery = {
                    $set: {
                        "listing.$[elem].qrImg": `${reqData['hostawayListId']}.png`,
                        "listing.$[elem].link": qrData
                    }
                };
                const options = {
                    arrayFilters: [{ "elem.hostawayListId": reqData.hostawayListId }],
                    new: true
                };
                const updateDB = await botModel.findByIdAndUpdate(
                    reqData.botId,
                    updateQuery,
                    options
                );

                if (!updateDB) {
                    logger.error("Bot ID or listing not found for update.");
                    return { error: true, msg: 'Bot ID or listing not found for update.' };
                }

                return { error: false, msg: 'QR Code is generated successfully', data: `${reqData['hostawayListId']}.png`, link: qrData };
            } catch (error) {
                return { error: true, msg: 'Internal Server Error' };
            }

        } catch (error) {
            logger.error(`BotService -> generateQR -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' };
        }
    }


    async deleteDataSource(reqData): Promise<any> {
        try {
            // get the current bot data
            const bot = await botModel.findById(reqData['botId']);
            if (bot) {
                const sources = bot['dataSourceFiles'].filter((_, index) => index !== reqData['arrayIndex']);
                const updateBot = await botModel.findByIdAndUpdate(reqData['botId'], { dataSourceFiles: sources }, {new: true});
                let absolutePath = '';
                if (global.process.env.NODE_ENV === PRODUCTION) {
                    absolutePath = `/usr/src/app/${reqData['filePath']}`;
                }

                if (global.process.env.NODE_ENV === DEVELOPMENT) {
                    absolutePath = `/usr/src/app/apps/api/${reqData['filePath']}`;
                }

                if (fs.existsSync(absolutePath)) {
                    fs.rmSync(absolutePath, {recursive: true})
                }

                return { error: false, msg: 'Data source is deleted successfully, please retrain your bot to update trained data', updatedBot: updateBot };
            } else {
                logger.warn(`BotService -> deleteDataSource -> Could not find bot details`)
                return { error: true, msg: 'Could not find bot details'}
            }

        } catch (error) {
            logger.error(`BotService -> deleteDataSource -> error: ${error.message}`);
            return { error: true, message: 'Internal server error' }
        }
    }

    async sendReplyHostaway(reqData): Promise<any> {
        try {
            const response = await axios.post(`https://api.hostaway.com/v1/conversations/${reqData['conversationId']}/messages`, {body: reqData['reply']},{
                headers: {
                    Authorization: `Bearer ${reqData['accessToken']}`
                }
            })
            .then((res) => {
                const { status, result } = res.data
                if (status == 'success' && result) {
                    return { error: false, data: result }
                } else {
                    return { error: true, msg: 'Sorry could not process your request at the moment' }
                }
            })
            .catch((err) => {
                console.log(err.response);
                console.error(`BotService -> sendReplyHostaway -> error: ${JSON.stringify(err)}`);
                return { error: true, msg: 'Internal server error' }
    
            });

            // update message count
            await botModel.findByIdAndUpdate(reqData["botId"], { $inc: { autoMsgCount: 1 } });

            return response;

        } catch (error) {
            logger.error(`BotService -> sendReplyHostaway -> error: ${error.message}`);
            return { error: true, message: 'Internal server error' }
        }
    }

    async checkAvailability(reqData): Promise<any> {
        try {
            const response = await axios.get(`https://api.hostaway.com/v1/listings/${reqData["listingId"]}/calendar?startDate=${reqData["startDate"]}&endDate=${reqData["endDate"]}`, {
                headers: {
                    Authorization: `Bearer ${reqData['accessToken']}`
                }
            })
            .then((res) => {
                const { status, result } = res.data
                if (status == 'success' && result) {
                    return { error: false, data: result }
                } else {
                    return { error: true, msg: 'Sorry could not process your request at the moment' }
                }
            })
            .catch((err) => {
                console.log(err.response);
                console.error(`BotService -> checkAvailability -> error: ${JSON.stringify(err)}`);
                return { error: true, msg: 'Internal server error' }
    
            });
            return response;

        } catch (error) {
            logger.error(`BotService -> checkAvailability -> error: ${error.message}`);
            return { error: true, message: 'Internal server error' }
        }
    }

    // hostway auto reply to messages
    async hostawayAutoReply(reqData): Promise<any> {
        try {
            const settingsData = await settingsModel.findOne({ groupId: reqData['accountId'] }).populate('userId');
            if (settingsData['userId']) {
                const botData = await botModel.findOne(
                    {
                      "userId": settingsData['userId']['_id'],
                      "vectorPath.apartment": reqData['listingName'],
                      "listing.internalListingName": reqData['listingName'],
                      "listing.responderStatus": true
                    },
                    {
                      "_id": 1, 
                      "vectorPath": { $elemMatch: { "apartment": reqData['listingName'] } }, 
                      "listing": { $elemMatch: { "internalListingName": reqData['listingName'] } }
                    }
                );

                if (botData !== null) {
                    const openAIClient = new openai({
                        apiKey: global.process.env.OPEN_AI_KEY
                    });
                    
                    // const dateCheckSystemPrompt = `
                    //     Your task is to decide whether a user's message is about checking availability based on dates.

                    //     If yes, extract:
                    //     - startDate (YYYY-MM-DD)
                    //     - endDate (YYYY-MM-DD)
                    //     - checkAvailability: true

                    //     Otherwise, return:
                    //     { "checkAvailability": false }

                    //     ALWAYS use JSON format.
                    //     Assume the current date is ${Date.now()} (pass this dynamically).
                    // `;

                    const currentDate = new Date(); // dynamically inject this
                    const currentYear = currentDate.getFullYear();
                    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
                    const currentDay = currentDate.getDate().toString().padStart(2, '0');
                    const currentISODate = `${currentYear}-${currentMonth}-${currentDay}`;

                    const dateCheckSystemPrompt = `
                    Your task is to decide whether a user's message is about checking availability based on dates.

                    If yes, extract:
                    - startDate (in YYYY-MM-DD format)
                    - endDate (in YYYY-MM-DD format)
                    - checkAvailability: true

                    Use these rules when interpreting dates:
                    - If only a date (e.g., "23") is provided, use the current month and year (${currentMonth}/${currentYear}).
                    - If only one date is provided, use it as startDate and set endDate to the next day.
                    - If a date and month (e.g., "23 July") are given without year, use the current year (${currentYear}).
                    - If two dates are given (e.g., "23 to 25"), infer both using the same logic (use current month and year if not specified).
                    - If dates are complete (day, month, year), use them as-is.

                    If the message is not about availability or doesn’t mention dates, return:
                    {
                    "checkAvailability": false
                    }

                    Always respond with a **valid JSON** object and nothing else.

                    Today’s date is ${currentISODate}.
                    `;

                    const detectAvailability = await openAIClient.chat.completions.create({
                        model: "gpt-4",
                        messages: [
                            { role: "system", content: dateCheckSystemPrompt },
                            { role: "user", content: reqData['body'] },
                        ],
                    });

                    const detection = JSON.parse(detectAvailability.choices[0].message.content);
                    if (detection["checkAvailability"]) {
                        const checkAvailability = await this.checkAvailability({ accessToken: settingsData['accessToken'], listingId: reqData["listingMapId"], startDate: detection["startDate"], endDate: detection["endDate"] });
                        const rewriteResponse = await this.rewriteResponseFromAvailability({ question: reqData["body"], availability: checkAvailability.data, userId: settingsData['userId'], botId: botData['_id'] })

                        console.log(detection);
                        console.log(checkAvailability);
                        console.log(rewriteResponse);
                        await this.sendReplyHostaway({conversationId: reqData['conversationId'], reply: rewriteResponse, accessToken: settingsData['accessToken'], botId: botData?.['_id']});
                        logger.info(`BotService => hostawayAutoReply => Question is about availability check `);
                        return { error: false, msg: "Replied to client's message" }
                    }

                    if (botData['vectorPath'].length === 1) {
                        // @ts-ignore
                        await UserService.sendNotificationOfMessage({userId: settingsData['userId']['_id'], message: reqData['body'], apartment: botData["listing"]?.[0]?.["internalListingName"]});
                        // Load the vector store and retrieve the retriever
                        const embeddings = new OpenAIEmbeddings({ openAIApiKey: process.env.OPEN_AI_KEY });
                        const vectorStore = await HNSWLib.load(botData['vectorPath']?.[0]?.['path'], embeddings);
                        const vectorStoreRetriever = vectorStore.asRetriever();
    
                        // User query
                        const question = reqData['body'].trim();
                        
                        // Retrieve relevant context
                        const topResults = await vectorStoreRetriever.getRelevantDocuments(question);
    
                        // Generate context from retrieved results
                        const context = topResults
                        .map(result => result.pageContent) // Use `pageContent` if that's where text is stored
                        .join('\n') || "No relevant information available in the context.";
    
                        const systemMessage = `
                        You are an AI assistant specialized in answering accommodation-related queries.
                        - Provide clear, accurate, and concise responses based on the given context.
                        - Do NOT add phrases like "According to the context provided" unless explicitly requested.
                        - Instead, **always respond naturally**, as if you are knowledgeable about the topic.
                        - Ensure responses strictly answer only what is asked, without adding extra details.
                        - If the query can be answered with a simple "Yes" or "No", provide only that response.
                        - If a slightly expanded response is necessary for clarity, keep it brief and avoid adding information not explicitly requested by the user.
                        - If the query is unrelated to accommodations, politely indicate that you can only assist with accommodation-related queries.
                        - If no relevant information is found in the context, return the following JSON structure:
                        {"answer": false, "msg": "Extremely sorry, as I do not have correct information about it please contact the property manager. If a contact number is available in the context, provide it."}
                        - If relevant information is found in the context, return the following JSON structure:
                        {"answer": true, "msg": "<your response here. Make sure you are giving the answer to what is asked by user only and do not include extra details>"}
                        - If **partial** information is available:
                        - **DO NOT say** "There is no mention of..."
                        - **Instead, respond in this format**:
                            - ✅ "The accommodation has a 4-burner gas stove. However, I couldn't find details about an oven. Please contact the property owner for confirmation."
                        - This ensures responses are **clear, helpful, and user-friendly.**
                        - If the user's query is unclear or ambiguous, ask for clarification before generating a response.
                        - **Always return responses in the following JSON format:**
                        {"answer": true, "msg": "<your response here>"}
                        - Even if the response is a simple greeting, confirmation, or farewell (e.g., "You're welcome!", "Thank you!", "Let me know if you need anything else."), it must still follow the JSON format:
                        {"answer": true, "msg": "You're welcome! If you have any other questions, feel free to ask."}
                        - Do not deviate from the required JSON format under any circumstances.
                        `;
    
                        const messages = [
                            { role: "system", content: systemMessage },
                            // ...reqData['session'],
                            { role: "assistant", content: `Context: ${context}` },
                            { role: "user", content: question },
                        ];
                        
                        const response = await openAIClient.chat.completions.create({
                            model: "gpt-4", // or "gpt-3.5-turbo"
                            // @ts-ignore
                            messages: messages,
                            temperature: 0.7,
                        });
        
                        // console.log(response);
        
                        // Extract the answer
                        // @ts-ignore
                        const answer = response.choices[0].message.content.trim();
                        const isValid = await this.isValidJson(answer);
                        if (isValid) {
                            const jsonObject = JSON.parse(answer);
                            console.log(jsonObject);
                            let finalAnswer = '';
                            if (jsonObject["answer"]) {
                                finalAnswer =jsonObject?.["msg"]?.replace(/\s*\[.*?\]\s*/g, ' ').trim();
                                await this.sendReplyHostaway({conversationId: reqData['conversationId'], reply: finalAnswer+'\n Would you like me to help you with anything else?', accessToken: settingsData['accessToken'], botId: botData?.['_id']});
                                return { error: false, msg: "Replied to client's message" }
                            } else {
                                // classify the question
                                reqData["userId"] = settingsData['userId']['_id'];
                                reqData["botId"] = botData["_id"];
                                const classify = await this.classifyQuestion(reqData['body'], reqData);
                                
                                if (classify.isLocation) {
                                    // answer is not found and question is related to location
                                    const botId = botData?.['_id'];
                                    
                                    console.log(botId);
                                    // console.log(botData);
                                    // @ts-ignore
                                    const lat = botData['listing']?.[0]?.['lat'] ? botData['listing']?.[0]?.['lat'] : 0;
                                    // @ts-ignore
                                    const lng = botData['listing']?.[0]?.['lng'] ? botData['listing']?.[0]?.['lng'] : 0;
                                    
                                    
                                    // search via google map
                                    const response = await this.getNearbyPlaces(lat, lng, reqData?.['body']);
                                    
                                    // console.log(response);
                                    let dynamicResponse = '';
                                    
                                    if (response?.['places'] && response?.['places']?.length > 0) {
                                        const places = response?.['places']?.map(place => {
                                            
                                            const distance = getDistance(
                                                { latitude: lat, longitude: lng },
                                                { latitude: place.location.latitude, longitude: place.location.longitude }
                                            );
                                            return {
                                                name: place.displayName.text,
                                                distance: (distance / 1000).toFixed(2) // Distance in kilometers
                                            };
                                        });
                                        dynamicResponse =  await this.rewriteResponse({question: reqData?.['body'], answer: `${places.map(place => `${place.name} - ${place.distance}KM,`).join('\n')}`});
                                    } else {
                                        dynamicResponse =  await this.rewriteResponse({question: reqData?.['body'], answer: `no data found`});
                                    }
                                    // return { error: false, data: { text: dynamicResponse } }
            
                                    await this.sendReplyHostaway({conversationId: reqData['conversationId'], reply: dynamicResponse, accessToken: settingsData['accessToken'], botId: botData?.['_id']});
                                    return { error: false, msg: "Replied to client's message" }
                                } else {
                                    await UserService.sendNotificationOfMessage({userId: settingsData['userId']['_id'], message: reqData['body']});
                                    const smsPayload = {
                                        template_id: "67b57700d6fc057bff7387c2",
                                        recipients: [
                                            {
                                                mobiles: settingsData["userId"]["contactNo"],
                                                var1: reqData["body"],
                                                // var2: reqData["listingName"]
                                            }
                                        ]
                
                                    };
                
                                    await NotificationService.sendSmsNotification(smsPayload);
                                    logger.info(`BotService => hostawayAutoReply => Notified to host via sms and email `)
                                    return { error: false, msg: "Notified to host" }
                                }
            
                                // finalAnswer =jsonObject?.["msg"]?.replace(/\s*\[.*?\]\s*/g, ' ').trim();
                                // return { error: false, data: { text: finalAnswer } }
                            }
                            
                            // await UserService.sendNotificationOfMessage({userId: settingsData['userId']['_id'], message: reqData['body']});
                        } else {
                            // reqData['session'].push({role: "user", content: question});
                            // reqData['session'].push({role: "assistant", content: answer.replace(/\s*\[.*?\]\s*/g, ' ').trim()});
                            await UserService.sendNotificationOfMessage({userId: settingsData['userId']['_id'], message: reqData['body']});
                            const smsPayload = {
                                template_id: "67b57700d6fc057bff7387c2",
                                recipients: [
                                    {
                                        mobiles: settingsData["userId"]["contactNo"],
                                        var1: reqData["body"],
                                        // var2: reqData["listingName"]
                                    }
                                ]
        
                            };
        
                            await NotificationService.sendSmsNotification(smsPayload);
                            return { error: false, msg: "Notified to host" }
                        }
                    } else {
                        await UserService.sendNotificationOfMessage({userId: settingsData['userId']['_id'], message: reqData['body']});
                        const smsPayload = {
                            template_id: "67b57700d6fc057bff7387c2",
                            recipients: [
                                {
                                    mobiles: settingsData["userId"]["contactNo"],
                                    var1: reqData["body"],
                                    // var2: reqData["listingName"]
                                }
                            ]
    
                        };
    
                        await NotificationService.sendSmsNotification(smsPayload);
                        logger.info(`BotService => hostawayAutoReply => Notified to host as there is no vector data found `)
                        return { error: false, msg: "Notified to host" }
                    }
                } else {
                    logger.warn(`BotService -> hostawayAutoReply -> botData not found`);
                    return { error: true, msg: 'Bot data not found' }
                }
            } else {
                logger.warn(`BotService -> hostawayAutoReply -> settings not found`);
                return { error: true, msg: 'Settings not found' }
            }
        } catch (error) {
            logger.error(`BotService -> hostawayAutoReply -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }

    async updateMsgCount(reqData): Promise<any> {
        try {
            const update = await botModel.findByIdAndUpdate(reqData["botId"], { $inc: { nonAutoMsgCount: 1 } });
            return { error: false, msg: "Message count is updated" }
        } catch (error) {
            logger.error(`BotService -> updateMsgCount -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }

}

export default new BotService();
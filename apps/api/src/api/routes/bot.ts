/** @format */

import BotService from '@app/services/BotService';
import { Request, Response, Router } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';



const route = Router();
const maxSize = 5368709120;


function saveImgToDirectory(cb, botId, apartment) {
    const dir = `./uploads/botDocuments/${botId}/${apartment}`;
    fs.mkdir(dir, { recursive: true }, err => {
        if (err) {
            return '';
        }
        return cb(null, dir);
    });
    return '';
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        saveImgToDirectory(cb, req.body.botId, req.query.apartment);
    },

    filename: function (req, file, cb) {
        // const extName = path.extname(file.originalname);
        //

        cb(null, `${file.originalname.replace(/\s+/g, '_')}`);
    },
});

const upload = multer({ storage: storage, limits: { fileSize: maxSize } });

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (app: Router) => {
    app.use('/bot', route);

    //LOGIN ROUTE USING BCRYPT
    route.post(
        '/create',
        async (req: Request, res: Response) => {
            const response = await BotService.createBot(req.body);
            return res.send(response);
        },
    );
    route.post(
        '/updateBot',
        async (req: Request, res: Response) => {
            const response = await BotService.updateBot(req.body);
            return res.send(response);
        },
    );

    route.post(
        '/upload-data-sources',
        upload.array('sources'),
        async (req: Request, res: Response) => {
            const reqData = req.body;

            const filePathArr = [];
            // @ts-ignore
            if (req.files !== undefined && req.files.length > 0) {
                const files = req.files;
                // @ts-ignore
                for (let i = 0; i < files.length; i++) {
                    const element = files[i];
                    filePathArr.push({ path: element.path, createdAt: Date.now(), mimeType: element.mimetype, apartMent: reqData['apartment'] });
                }
            }
            reqData['sources'] = filePathArr;
            const response = await BotService.addDataSources(reqData);
            return res.send(response);
        },
    );

    route.post(
        '/train',
        async (req: Request, res: Response) => {
            const response = await BotService.trainChatbot(req.body);
            return res.send(response);
        },
    );

    route.post(
        '/get-all-bots-by-user',
        async (req: Request, res: Response) => {
            const response = await BotService.getBotsByUserId(req.body);
            return res.send(response);
        },
    );

    route.post(
        '/get-bot-by-id',
        async (req: Request, res: Response) => {
            const response = await BotService.getBotById(req.body);
            return res.send(response);
        },
    );

    route.post(
        '/chat',
        async (req: Request, res: Response) => {
            // @ts-ignore
            console.log("Session ID:", req.session.id);
            // @ts-ignore
            if (!req.session.conversationHistory) {
                // @ts-ignore
                req.session.conversationHistory = {};
            }

            const reqData = req.body;
            
            // @ts-ignore
            if (!req.session.conversationHistory[reqData['botId']]) {
                // @ts-ignore
                req.session.conversationHistory[reqData['botId']] = {};
            }

            const listing = reqData['sourcePath'].substring(reqData['sourcePath'].lastIndexOf('/') + 1);

            // @ts-ignore
            if (!req.session.conversationHistory[reqData['botId']][listing]) {
                // @ts-ignore
                req.session.conversationHistory[reqData['botId']][listing] = [];
            }

            // @ts-ignore
            reqData['session'] = req.session.conversationHistory[reqData['botId']][listing];
            // @ts-ignore
            reqData['sessionMethod'] = req.session;
            const response = await BotService.chatWithData(reqData);
            return res.send(response);
        },
    );

    route.post(
        '/add-qa',
        async (req: Request, res: Response) => {
            const response = await BotService.createQA(req.body);
            return res.send(response);
        },
    );

    route.post(
        '/get-script',
        async (req: Request, res: Response) => {
            const protocol = req.protocol;
            const host = req.get('Host');

            // Construct the complete URL
            const url = `${protocol}://${host}`;
            const reqData = req.body;
            reqData['baseUrl'] = url;
            const response = await BotService.generateScript(reqData);
            return res.send(response);
        },
    );

    route.post(
        '/delete',
        async (req: Request, res: Response) => {
            const response = await BotService.deleteBot(req.body);
            return res.send(response);
        },
    );

    route.post(
        '/ai-reply',
        async (req: Request, res: Response) => {
            const response = await BotService.generateResponse(req.body);
            return res.send(response);
        },
    );

    route.post(
        '/webhook',
        async (req: Request, res: Response) => {
            console.log(req.body);
            const response = await BotService.hostawayAutoReply(req.body);
            return res.send(response);
        },
    );

    route.get(
        '/notifications',
        async (req: Request, res: Response) => {
            const response = await BotService.getAllNotification();
            return res.send(response);
        },
    );

    route.post(
        '/classify',
        async (req: Request, res: Response) => {
            const { question } = req.body;
            const response = await BotService.classifyQuestion(question, {});
            return res.send(response);
        },
    );

    route.get(
        '/update-notification',
        async (req: Request, res: Response) => {
            const response = await BotService.updateAllNotification();
            return res.send(response);
        },
    );

    route.get(
        '/get-count',
        async (req: Request, res: Response) => {
            const response = await BotService.getCounts(req.query);
            return res.send(response);
        },
    );

    route.post(
        '/add-conversations',
        async (req: Request, res: Response) => {
            const response = await BotService.addConversationalLog(req.body);
            return res.send(response);
        },
    );

    route.post(
        '/conversational-log',
        async (req: Request, res: Response) => {
            const reqData = req.body
            const response = await BotService.getConversations(reqData);
            return res.send(response);
        },
    );

    route.post(
        '/search-conversations',
        async (req: Request, res: Response) => {
            const response = await BotService.getConversationsByDate(req.body);
            return res.send(response);
        },
    );
    route.post(
        '/generate-qr',
        async (req: Request, res: Response) => {
            const response = await BotService.generateQR(req.body);
            return res.send(response);
        },
    );

    route.post(
        '/stayflexi-webhook',
        async (req: Request, res: Response) => {
            // const response = await BotService.webhookNotification(req.body);
            // return res.send(response);
            console.log('stayflexi webhook is called');
            console.log(req.body);
            return res.send({ error: false, msg: 'success' });
        },
    );

    route.post(
        '/delete-file',
        async (req: Request, res: Response) => {
            const response = await BotService.deleteDataSource(req.body);
            return res.send(response);
        },
    );

    route.post(
        '/update-msg-count',
        async (req: Request, res: Response) => {
            const response = await BotService.updateMsgCount(req.body);
            return res.send(response);
        },
    );

};

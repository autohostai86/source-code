import CustomerService from '@app/services/CustomerService';
import { Request, Response, Router } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';



const route = Router();
const maxSize = 5368709120;


function saveImgToDirectory(cb) {
    const dir = `./uploads/customers`;
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
        saveImgToDirectory(cb);
    },

    filename: function (req, file, cb) {
        const extName = path.extname(file.originalname);
        //

        cb(null, `${Date.now()}${extName}`);
    },
});

const upload = multer({ storage: storage, limits: { fileSize: maxSize } });

export default (app: Router) => {
    app.use('/customer', route);

    //LOGIN ROUTE USING BCRYPT
    route.post(
        '/create',
        upload.single('idProof'),
        async (req: Request, res: Response) => {
            const reqData = req.body;
            reqData['idProof'] = req.file?.path ? req.file?.path : '';
            const response = await CustomerService.addCustomer(reqData);
            return res.send(response);
        },
    );
    route.post(
        '/get',
        async (req: Request, res: Response) => {
            const response = await CustomerService.getCustomerData(req.body);
            return res.send(response);
        },
    );

    route.post(
        '/save-messages',
        async (req: Request, res: Response) => {
            const reqData = req.body;
            const response = await CustomerService.saveMessages(reqData);
            return res.send(response);
        },
    );

    route.post(
        '/get-conversations',
        async (req: Request, res: Response) => {
            const response = await CustomerService.getConversationsByBotId(req.body);
            return res.send(response);
        },
    );

    route.post(
        '/mark-as-read',
        async (req: Request, res: Response) => {
            const response = await CustomerService.updateMessageAsRead(req.body);
            return res.send(response);
        },
    );

    route.post(
        '/change-online-status',
        async (req: Request, res: Response) => {
            const response = await CustomerService.updateUserOnlineStatus(req.body);
            return res.send(response);
        },
    );

    route.get(
        '/get-only',
        async (req: Request, res: Response) => {
            const response = await CustomerService.getCustomerDataOnly(req.query);
            return res.send(response);
        },
    );

};
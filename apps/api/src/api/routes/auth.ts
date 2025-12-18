/** @format */

import { celebrate, Joi } from 'celebrate';
import { Request, Response, Router } from 'express';
import AuthService from '@app/services/AuthService';
import fs from 'fs';
import multer from 'multer';

const route = Router();

const maxSize = 5368709120;


function saveImgToDirectory(cb) {
    const dir = `./uploads`;
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
        // const extName = path.extname(file.originalname);
        //

        cb(null, `${file.originalname.replace(/\s+/g, '_')}`);
    },
});

const upload = multer({ storage: storage, limits: { fileSize: maxSize } });

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (app: Router) => {
    app.use('/auth', route);

    //LOGIN ROUTE USING BCRYPT
    route.post(
        '/login',
        celebrate({
            body: Joi.object({
                password: Joi.string(),
                // userType: Joi.string(),
                email: Joi.string(),
            }),
        }),
        async (req: Request, res: Response) => {
            const login = await AuthService.login(req.body);
            return res.send(login);
        },
    ),
    route.post(
        '/forgot-password',
        async (req: Request, res: Response) => {
            const response = await AuthService.forgotPassword(req.body);
            return res.send(response);
        }),
    route.post(
        '/resetpassword',
        async (req: Request, res: Response) => {
            const response = await AuthService.resetPasswordData(req.body);
            return res.send(response);
        }),

    route.post(
        '/is-user-exists',
        celebrate({
            body: Joi.object({
                email: Joi.string(),
                type: Joi.string(),
            }),
        }),
        async (req: Request, res: Response) => {
            const isExists = await AuthService.isUserExists(req.body);
            return res.send(isExists);
        },
    );
    // register code added here 
    route.post(
        '/create',
        async (req: Request, res: Response) => {

            const response = await AuthService.createUser(req.body);
            return res.send(response);
        }
    );


    route.post(
        '/update-image',
        upload.single('file'),
        async (req: Request, res: Response) => {
            const reqData = req.body;
            reqData["file"] = req.file;
            const response = await AuthService.uploadImage(reqData);
            return res.send(response);
        }
    );

    route.post(
        '/update-profile',
        async (req: Request, res: Response) => {
            const reqData = req.body;
            const response = await AuthService.updateProfile(reqData);
            return res.send(response);
        }
    );

    route.get("/ping-health", async (req: Request, res: Response) => {
        return res.send({ error: false, msg: "Server is running" })
    });

};

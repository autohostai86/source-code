/** @format */
import logger from '@app/loaders/logger';
import loginModel from '@app/models/loginModel';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import botModel from '@app/models/botModel';
import subscribedPlansModel from '@app/models/subscribedPlansModel';
import billingModel from '@app/models/billingModel';
import conversationalLogModel from '@app/models/conversationalLogModel';
import customerDataModel from '@app/models/customerDataModel';
import { DEVELOPMENT, PRODUCTION } from '@app/constants';
import fs from 'fs';

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: "no-reply@autohostai.com",
        pass: "nufn evzn xrnj iviy",
    },
});

const twilioClient = twilio('ACad363a7383ec8881b1a2f48ad889c6ef', '3f481b6594a2f6b6834b16a20eacef7b');

class UserService { 
    async createUser(reqData): Promise<any> {
        try {
            const searchUser = await loginModel.find({ email: reqData.email })
            if (searchUser.length === 0) {
                const salt = bcrypt.genSaltSync(10);
                const hashedPassword = bcrypt.hashSync(reqData['password'], salt);
                reqData['password'] = hashedPassword;
                const user = await loginModel.create(reqData);
                 // creating bot automatically
                 if (user['_id']) {
                    const createBot = await botModel.create({
                        title: "Autohost AI",
                        initialMessage: "Hi, How can I help you?",
                        userId: user['_id']
                    });
                    logger.info(`UserService -> createUser -> default bot is created`);
                    if (createBot['_id']) {
                        // billing Finding Entry is here
                        const isBillingExists = await billingModel.find({ title: 'Free Tier' });
                        // end of that code logic is here
                        // Subscribe Plan  module Default Creation Code is here
                        if (isBillingExists.length !== 0) {
                            const currentDate = new Date();
                            const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + isBillingExists[0].validityPeriod, currentDate.getDate());
                            const formattedNextMonthDate = `${nextMonthDate.getFullYear()}-${(nextMonthDate.getMonth() + 1).toString().padStart(2, '0')}-${nextMonthDate.getDate().toString().padStart(2, '0')}`;
                            const SuscribedPlansData = {
                                userId: user['_id'],
                                botId: createBot['_id'],
                                billingId: isBillingExists[0]._id,
                                expiryDate: formattedNextMonthDate,
                                paymentStatus: true

                            }
                            const create = await subscribedPlansModel.create(SuscribedPlansData);
                            logger.info(`Default Subscribe Plan is created`);
                        }

                        // end of that code logic is here
                    }
                }
                return ({ error: false, msg: 'User added' })
            } else {
                logger.error(`UserService -> createUser -> duplicate key error`);
                return { error: true, msg: 'This email ID already exists' };
            }
        } catch (error) {
            logger.error(`UserService -> createUser -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }

    }
    async deleteUser(reqData): Promise<any> {
        try {
            // delete user
            const delUser = await loginModel.findByIdAndDelete(reqData['_id']);
            // delete bot
            const delBot = await botModel.findOneAndDelete({userId: delUser?.['_id']});
            
            // delete any data source files and vectors
            let sourcePath = '';
            let vectorPath = '';
            let imagesPath = '';
            if (global.process.env.NODE_ENV === PRODUCTION) {
                sourcePath = `/usr/src/app/uploads/botDocuments/${delBot['_id']}`;
                vectorPath = `/usr/src/app/uploads/vectors/${delBot['_id']}`;
                imagesPath = `/usr/src/app/uploads/listingImages/${delBot['_id']}`;
            }

            if (global.process.env.NODE_ENV === DEVELOPMENT) {
                sourcePath = `/usr/src/app/apps/api/uploads/botDocuments/${delBot['_id']}`;
                vectorPath = `/usr/src/app/uploads/vectors/${delBot['_id']}`;
                imagesPath = `/usr/src/app/uploads/listingImages/${delBot['_id']}`;
            }

            if (fs.existsSync(sourcePath)) {
                fs.rmdirSync(sourcePath, { recursive: true });
            }

            if (fs.existsSync(vectorPath)) {
                fs.rmdirSync(vectorPath, { recursive: true });
            }

            if (fs.existsSync(imagesPath)) {
                fs.rmdirSync(imagesPath, { recursive: true });
            }
            return { error: false, msg: 'success' }
        } catch (error) {
            logger.error(`UserService -> deleteUser -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }

    async getUserById(reqData): Promise<any> {
        try {
            const getUser = await loginModel.findById(reqData['_id'])
            if (getUser) {
                return { error: false, msg: 'success', data: getUser }
            } else {
                return { error: false, msg: 'User not exist' }
            }
        } catch (error) {
            logger.error(`UserService -> getUserById -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }

    async getAllUser(): Promise<any> {
        try {
            const getAllUser = await loginModel.find({userType: 'user'})
            if (getAllUser) {
                return { error: false, msg: 'success', data: getAllUser }
            } else {
                return { error: false, msg: 'No user exist' }
            }
        } catch (error) {
            logger.error(`UserService -> getUserById -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }

    async editUser(reqData): Promise<any> {
        try {
            const searchUser = await loginModel.find({ email: reqData.email })
            if (searchUser.length === 0 || (searchUser.length === 1 && searchUser[0]._id.toString() === reqData._id)) {
                if (reqData.password === '') {
                    delete reqData['password']
                }
                console.log(reqData)
                const editUser = await loginModel.findByIdAndUpdate(reqData._id, reqData)
                return { error: false, msg: 'User updated', data: reqData }
            } else {
                logger.error(`UserService -> editUser -> duplicate key error`);
                return { error: true, msg: 'This email ID already exists' };
            }
        } catch (error) {
            logger.error(`UserService -> editUser -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }


    async updateUserOnlineStatus(reqData): Promise<any> {
        try {
            await loginModel.findByIdAndUpdate(reqData['_id'], {onlineStatus: reqData['status']});
            return { error: false, msg: 'Online status is updated' }
        } catch (error) {
            logger.error(`UserService -> updateUserOnlineStatus -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }

    async sendNotificationOfMessage(reqData): Promise<any> {
        try {
            // check whether the user is offline
            const user = await loginModel.findById(reqData['userId']);
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
                            <p style="font-size: 18px">You have received a new message from a guest<br/></p>
                            <p style="font-style: italic;font-size: 18px">"${reqData['message']}"</p>
                            <p style="font-style: italic;font-size: 18px">${reqData['apartment']}</p>
                            <p style="font-size: 18px">Thanks!<br>
                            - <span style="font-weight: bold">AutoHost AI</span></p>
                        </div>
                    </body>
                </html>`;

                const info = await transporter.sendMail({
                    from: '"AutoHost AI" <no-reply@autohostai.com>', // sender address
                    to: user['email'],
                    cc: "mshafnaz12225@gmail.com", // list of receivers
                    subject: "New message notification", // Subject line
                    html: htmlData, // html body
                });

                logger.info(`Email is sent successfully: ${info.messageId} to ${user['email']}`);

                // sent sms
                // const message = await twilioClient.messages.create({
                //     body: reqData['message'],
                //     from: "+15017122661",
                //     to: "+15558675310",
                // });
                
                // logger.info(`Sms is sent successfully: ${message.body}`);
                
            }
        } catch (error) {
            logger.error(`UserService ->  sendNotificationOfMessage-> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }

    async saveSingleMessage(reqData): Promise<any> {
        try {
            const customer = await customerDataModel.findById(reqData['customerId']);
            console.log(customer);
            if (customer['onlineStatus'] === false) {
                console.log('test');
                const { botId, aptNo, customerId, message } = reqData;

                // Find and update in one step, merging `message` with existing `messages` array
                const result = await conversationalLogModel.updateOne(
                    { botId, aptNo, customerId },
                    { $push: { messages: { $each: [message] } } },
                    { upsert: true }  // Creates a new document if no match is found
                );
            }
        } catch (error) {
            logger.error(`UserService ->  saveSingleMessage-> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }

}

export default new UserService();

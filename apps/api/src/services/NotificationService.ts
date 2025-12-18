/** @format */

import nodemailer from 'nodemailer'
import subscribedPlansModel from '@app/models/subscribedPlansModel';
import logger from '@app/loaders/logger';
import botModel from '@app/models/botModel';
import axios from 'axios';

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: "no-reply@autohostai.com", 
        pass: "nufn evzn xrnj iviy",
    },
});
class NotificationService {

    async getEmailsOfExpiringSubscriptions(): Promise<any> {
        const currentDate = new Date();
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(currentDate.getDate() + 7);

        // const startOfDay = new Date(sevenDaysFromNow.setHours(0, 0, 0, 0));
        // const endOfDay = new Date(sevenDaysFromNow.setHours(23, 59, 59, 999));

        try {
            const expiringPlans = await subscribedPlansModel.find({
                expiryDate: {
                    $gte: currentDate,
                    $lte: sevenDaysFromNow
                }
            }).populate('userId');
            return expiringPlans;
        } catch (error) {
            logger.error(`NotificationService -> getEmailsOfExpiringSubscriptions -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }

    async sendExpiryEmail(): Promise<any> {
        const users = await this.getEmailsOfExpiringSubscriptions();
        for (const user of users) {
            const botDetails = await botModel.find({ userId: user.userId })
            const htmlTemp = `<!DOCTYPE html>
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
                        .logo {
                            text-align: center;
                            margin-bottom: 20px;
                        }
                        .logo img {
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
                        <div class="logo">
                            <img src="https://autohostai.com/website/assets/img/whitelogo.png" alt="bot.com Logo" style="background-color: #10275B; padding: 5%">
                        </div>
                        <p>Hello Dear ${user.userId.userName},</p>
                        <p>Your Chatbot subscription will be expiering in few days
                        <p>Please use the following Bot Details for future inquiries.<br>
                         Bot Title: ${botDetails[0].title}  (Bot ID: ${botDetails[0]._id})</p>
                        <p>Thanks!<br>
                        - <span class="highlight">Soul@Home</span></p>
                    </div>
                </body>
                </html>
                `
            try {
                const info = await transporter.sendMail({
                    from: '"AutoHost AI" <no-reply@autohostai.com>',
                    to: user.userId.email,
                    subject: " Expiration reminder",
                    html: htmlTemp,
                });
                return { error: false, msg: `success ${info.messageId}` }
            } catch (error) {
                logger.error(`NotificationService -> sendExpiryEmail -> error: ${error.message}`);
                return { error: true, msg: 'Internal server error' }
            }
        }
    }


    async sendContactMail(reqData): Promise<any> {
        try {
            const htmlTemp = `<!DOCTYPE html>
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
                    .logo {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .logo img {
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
                    <div class="logo">
                        <img src="https://autohostai.com/website/assets/img/whitelogo.png" alt="bot.com Logo" style="background-color: #10275B; padding: 5%">
                    </div>
                    <p>You have got new inquiry from AutoHost AI platform</p>
                    <p>${reqData['message']}<br/>
                     - ${reqData['name']} (${reqData['mobileNo']})</p>
                    <p>Thanks!<br>
                    - <span style="font-weight: bold">AutoHost AI</span></p>
                </div>
            </body>
            </html>`;
            const info = await transporter.sendMail({
                from: '"AutoHost AI" <no-reply@autohostai.com>',
                to: 'wecare@autohostai.com',
                // to: 'mshafnaz12225@gmail.com',
                replyTo: reqData['email'],
                subject: "Inquiry from AutoHost AI",
                html: htmlTemp,
            });
            return { error: false, msg: `success ${info.messageId}` }
        } catch (error) {
            logger.error(`NotificationService -> sendContactMail -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }


    async deactivatePlan(): Promise<any> {
        try {
            const currentDate = new Date();
            const filter = { expiryDate: { $lte: currentDate } }
            const update = { isExpired: true, paymentStatus: false }
            const expriredPlans = await subscribedPlansModel.updateMany(filter, update);
            console.log(expriredPlans);
            return expriredPlans;
        } catch (error) {
            logger.error(`NotificationService -> deactivatePlan -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }

    async sendSmsNotification(reqData: any): Promise<any> {
        try {
            const response = axios.post("https://control.msg91.com/api/v5/flow", reqData, {
                headers: {
                    authkey: '441226AK7BYmF267ac2b1cP1',
                    accept: 'application/json',
                    'content-type': 'application/json'
                }
            })
            .then((res) => {
                console.log(res.data);
                return { error: false, msg: "Sending sms is success"}
            })
            .catch((err) => {
                console.log(err);
                return { error: true, msg: "Failed to send sms"}
            });
        } catch (error) {
            logger.error(`NotificationService -> sendSmsNotification -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }

}
export default new NotificationService();

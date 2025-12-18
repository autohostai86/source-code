/** @format */
import logger from '@app/loaders/logger';
import loginModel from '@app/models/loginModel';
import billingModel from '@app/models/billingModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config';
import botModel from '@app/models/botModel';
import subscribedPlansModel from '@app/models/subscribedPlansModel';
const nodemailer = require("nodemailer");
import crypto from 'crypto';
import querystring from 'querystring';
import { DEVELOPMENT, PRODUCTION } from '@app/constants';
import fs from "fs";
// Define the algorithm and secret key
const algorithm = 'aes-256-cbc';
const secretKey = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
const staticIV = Buffer.from('aabbccddeeff00112233445566778899', 'hex');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: "no-reply@autohostai.com",
        pass: "nufn evzn xrnj iviy",
    },
});
// Encrypt function
async function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), staticIV);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: staticIV.toString('hex'), encryptedData: encrypted.toString('hex') };
}


// Decrypt function
async function decrypt(text) {
    const iv = Buffer.from(text.iv, 'hex');
    const encryptedText = Buffer.from(text.encryptedData, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
class AuthService {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public generateToken(user): any {
        const today = new Date();
        const exp = new Date(today);
        exp.setDate(today.getDate() + 60);

        return jwt.sign({ ...user }, config.jwtSecret, { expiresIn: '1d' });
    }
    // create default admin user account
    async login(reqData: any): Promise<any> {
        try {
            let user: any = await loginModel.find({ email: reqData.email });
    
            if (user && user.length > 0) {
                if (user[0].userType === 'user' && !user[0].accountStatus) {
                    return { error: true, msg: 'Your account is suspended' };
                } else {
                    const isMatch = await bcrypt.compare(reqData.password, user[0].password);
    
                    if (isMatch) {
                        let payload = {};
                        let successMessage = '';
    
                        if (user[0].userType === "user") {
                            let botModule = await botModel.find({ userId: user[0]._id });
                            payload = {
                                id: user[0]._id,
                                email: user[0].email,
                                name: user[0].userName,
                                userType: user[0].userType,
                                roles: user[0].roles,
                                isOffline: botModule[0].isOffline,
                                contactNo: user[0].contactNo,
                                profileImg: user[0].profileImg
                            };
                        } else {
                            payload = {
                                id: user[0]._id,
                                email: user[0].email,
                                name: user[0].userName,
                                userType: user[0].userType,
                                roles: user[0].roles
                            };
                        }
    
                        successMessage = 'Welcome ' + user[0].email;
    
                        // Generate token and send
                        const token = this.generateToken(payload);
                        return { error: false, msg: successMessage, token: 'Bearer ' + token };
                    } else {
                        return { error: true, msg: 'Invalid credentials' };
                    }
                }
            } else {
                return { error: true, msg: 'Invalid credentials' };
            }
        } catch (error) {
            logger.error(`AuthService -> login -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' };
        }
    }
    

    // user verfication
    async isUserExists(reqData: any): Promise<any> {
        try {
            const isExists = await loginModel.find({ email: reqData.email });

            if (isExists.length > 0) {
                return { exits: true };
            } else {
                return { exits: false };
            }

        } catch (error) {
            logger.error(`AuthService -> isUserExists -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }
    // register User 
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
                    logger.info(`AuthService -> createUser -> default bot is created`);
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

                // this logic to automatically login when created the user
                let payload = {};
                const name = user['userName'];
                payload = {
                    id: user['_id'],
                    email: user['email'],
                    name: user['name'],
                    userType: user['userType'],
                    roles: user['roles'],
                    contactNo: user["contactNo"]
                };

                // generate token and send
                const token = this.generateToken(payload);


                return { error: false, msg: 'User Register Successfully....!!!', token: 'Bearer ' + token }

            } else {
                logger.error(`UserService -> createUser -> duplicate key error`);
                return { error: true, msg: 'This email ID already exists' };
            }
        } catch (error) {
            logger.error(`UserService -> createUser -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }

    }
    //forgot Password
    async forgotPassword(reqData): Promise<any> {
        try {
            let encryptedEmail = "";
            const searchUser = await loginModel.find({ email: reqData.email })
            if (searchUser.length !== 0) {
                encryptedEmail = reqData['email'];
                const encrypted = await encrypt(encryptedEmail);
                const encodedData = querystring.stringify({
                    //  secretApi   mean Actual email Id
                    secretApi: encrypted.encryptedData,
                });
                const resetUrl = `${process.env.SERVER_URL}/forgot-password?${encodedData}`;
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
                        <p>Please update your password with below link<br/>
                        ${resetUrl}</p>
                        <p>Thanks!<br>
                        - <span style="font-weight: bold">AutoHost AI</span></p>
                    </div>
                </body>
                </html>`;
                const info = await transporter.sendMail({
                    from: '"AutoHost AI" <no-reply@autohostai.com>', // sender address
                    to: reqData['email'], // list of receivers
                    subject: "Reset Password", // Subject line
                    html: htmlTemp, // html body
                });

                logger.info(`Message sent Success: ${info.messageId}`);
                return { error: false, msg: 'success' }
            } else {
                return { error: true, msg: 'Email Not Recognized' }
            }

        }
        catch (error) {
            logger.error(`AuthService ->  forgotPassword-> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }
    // reset Passwrod
    async resetPasswordData(reqData): Promise<any> {
        try {
            let arrayEncryptData = {
                iv: staticIV,
                encryptedData: reqData.secretApi,

            }
            const decryptedEmail = await decrypt(arrayEncryptData);

            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(reqData['password'], salt);
            const updatePassword = await loginModel.updateOne({
                email: decryptedEmail,
            }, {
                password: hashedPassword,
            })
            if (updatePassword) {
                logger.info(`AuthService ->  resetPasswordData-> Success:Your Password Has Been Successfully Updated `);
                return { error: false, msg: 'success' }
            } else {
                return { error: true, msg: 'Error In Updating Data' }
            }


        }
        catch (error) {
            logger.error(`AuthService ->  resetPasswordData-> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }


    async uploadImage(reqData): Promise<any> {
        try {
            const userData = await loginModel.findById(reqData["id"]);
            if (userData["profileImg"]) {
                // previous profile pic available
                // remove the existing pic
                let absoluteFilePath = "";
                if (global.process.env.NODE_ENV === PRODUCTION) {
                    absoluteFilePath = `/usr/src/app/${userData["profileImg"]}`;
                }

                if (global.process.env.NODE_ENV === DEVELOPMENT) {
                    absoluteFilePath = `/usr/src/app/apps/api/${userData["profileImg"]}`;
                }

                if (fs.existsSync(absoluteFilePath)) {
                    fs.unlinkSync(absoluteFilePath)
                }

            }

            // updating the new img path
            userData["profileImg"] = reqData["file"]["path"];
            userData.save();
            let botModule = await botModel.find({ userId: userData._id });
            const payload = {
                id: userData._id,
                email: userData.email,
                name: userData.userName,
                userType: userData["userType"],
                roles: userData["roles"],
                isOffline: botModule["isOffline"],
                contactNo: userData["contactNo"],
                profileImg: userData["profileImg"]
            };


            const token = this.generateToken(payload);
            return { error: false, msg: "Image is updated successfully.", token: 'Bearer ' + token }
        }
        catch (error) {
            logger.error(`AuthService ->  uploadImage-> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }


    async updateProfile(reqData): Promise<any> {
        try {
            // Check if the contact number already exists for another user
            const existingUserWithContact = await loginModel.findOne({
                contactNo: reqData["contactNo"],
                _id: { $ne: reqData["id"] } // exclude the current user
            });
        
            if (existingUserWithContact) {
                return { error: true, msg: "This contact number is already associated with another user." };
            }
        
            // Fetch the current user
            const userData = await loginModel.findById(reqData["id"]);
        
            // Update fields
            userData["contactNo"] = reqData["contactNo"];
            if (reqData["name"]) {
                userData.userName = reqData["name"];
            }
        
            await userData.save();
        
            // Fetch bot module info
            let botModule = await botModel.findOne({ userId: userData._id });
        
            // Prepare token payload
            const payload = {
                id: userData._id,
                email: userData.email,
                name: userData.userName,
                userType: userData["userType"],
                roles: userData["roles"],
                isOffline: botModule?.isOffline || false,
                contactNo: userData["contactNo"],
                profileImg: userData["profileImg"]
            };
        
            const token = this.generateToken(payload);
            return { error: false, msg: "Profile updated successfully.", token: 'Bearer ' + token };
        }
        catch (error) {
            logger.error(`AuthService ->  updateProfile-> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }


}

export default new AuthService();
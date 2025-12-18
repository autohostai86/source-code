/** @format */
import { DEVELOPMENT, PRODUCTION } from '@app/constants';
import logger from '@app/loaders/logger';
import billingModel from '@app/models/billingModel';
import loginModel from '@app/models/loginModel';
import bcrypt from 'bcryptjs';
import { copyFile } from 'fs/promises';
import fs from 'fs';
class SeederService {
    // create default admin user account
    async createDefaultAdmin(): Promise<any> {
        try {
            // check admin cred is already exists
            const isAdminExists = await loginModel.find({ email: 'admin@vinnovate.com' });
            if (isAdminExists.length === 0) {
                const salt = bcrypt.genSaltSync(10);
                const hashedPassword = bcrypt.hashSync('admin', salt);
                const adminData = {
                    userName: "admin",
                    email: "admin@vinnovate.com",
                    password: hashedPassword,
                    userType: "admin"
                }
    
                const create = await loginModel.create(adminData);
                logger.info(`Default admin account is created`);
            }

        } catch (error) {
            logger.error(`SeederService -> createDefaultAdmin -> error: ${error.message}`);
        }
    }
    async createDefaultBilling(): Promise<any> {
        try {

            const isBillingExists = await billingModel.find({ title: 'Free Tier' });
            if (isBillingExists.length === 0) {

                const billingData = {
                    title: "Free Tier",
                    description: "Free Tier Package",
                    durationType: "months",
                    validityPeriod: 1,
                    price:"0",
                }
                const create = await billingModel.create(billingData);
                logger.info(`Default Default Billing Module is created`);
            }
            

        } catch (error) {
            logger.error(`SeederService -> createDefaultBilling -> error: ${error.message}`);
        }
    }

    // copy video to uploads folder
    async copyVideo(): Promise<any> {
        try {
            let sourcePath = '';
            let destinationPath = '';
            if (global.process.env.NODE_ENV === PRODUCTION) {
                sourcePath = `/usr/src/app/build/assets/final.mp4`;
                destinationPath = `/usr/src/app/uploads/final.mp4`;
                if (!fs.existsSync(`/usr/src/app/uploads`)) {
                    fs.mkdirSync(`/usr/src/app/uploads`)
                }
            }

            if (global.process.env.NODE_ENV === DEVELOPMENT) {
                sourcePath = `/usr/src/app/apps/api/src/assets/final.mp4`;
                destinationPath = `/usr/src/app/apps/api/uploads/final.mp4`;
                if (!fs.existsSync(`/usr/src/app/apps/api/uploads`)) {
                    fs.mkdirSync(`/usr/src/app/apps/api/uploads`)
                }
            }

            if (!fs.existsSync(destinationPath)) {
                fs.copyFileSync(sourcePath, destinationPath);
            }

        } catch (error) {
            logger.error(`SeederService -> copyVideo -> error: ${error.message}`);
        }
    }

}

export default new SeederService();
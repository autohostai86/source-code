/** @format */
import cron from "node-cron";
import logger from '../loaders/logger';
import NotificationService from "./NotificationService";

class CronService {
    async deactivateCron(): Promise<any> {
        try {
            const task = cron.schedule('0 0 * * *', () => {
                logger.info(`CronService -> deactivateCron -> running every day at 12AM`);    
                NotificationService.deactivatePlan();
            });
            task.start();
        } catch (error) {
            logger.error(`CronService -> deactivateCron -> error: ${error.message}`);
        }
    }


    async expiryReminderCron(): Promise<any> {
        try {
            const task = cron.schedule('0 0 */2 * *', () => {
                logger.info(`CronService -> expiryReminderCron -> running every day 2days`);    
                NotificationService.sendExpiryEmail();
            });
            task.start();
        } catch (error) {
            logger.error(`CronService -> expiryReminderCron -> error: ${error.message}`);
        }
    }

}
export default new CronService();

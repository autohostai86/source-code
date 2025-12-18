/** @format */

import ContactModel from '@app/models/contactModel';
import logger from '@app/loaders/logger';
import UrgentTagModel from '@app/models/UrgentTagModel';
import botModel from '@app/models/botModel';
import conversationalLogModel from '@app/models/conversationalLogModel';
import settingsModel from '@app/models/settingsModel';
import loginModel from '@app/models/loginModel';
import billingModel from '@app/models/billingModel';
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "parashara924@gmail.com",
    pass: "iimgcwbjnyynhhty",
  },
});

class DashoboardService {

  async contactEmail(reqData): Promise<any> {
    try {
      const user = await ContactModel.create(reqData);
      // const info = await transporter.sendMail({
      //   from: '"Website Enquiry" <parashara924@gmail.com>', // sender address
      //   to: "parashara924@gmail.com, parashara924@gmail.com", // list of receivers
      //   subject: "Enquiry From AutoHostAI Website", // Subject line
      //   // text: "Hello world?", // plain text body
      //   html: `Enquiry From AutoHostAI Website<br>Email :- ${reqData.email} <br> Name :- ${reqData.name} <br> Message :- ${reqData.message} <br> Number :- ${reqData.number} <br>`, // html body
      // });

      // console.log("Message sent: %s", info.messageId);
      // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
      return { error: false, msg: 'Your message has been received successfully. We will connect with you shortly.' };
    } catch (error) {
      logger.error(
        `DashboardServices -> contactEmail -> error: ${error.message}`
      );
      return { error: true, msg: 'Internal server error' };
    }
  }


  // get dashboard counts
  async getCounts(reqData): Promise<any> {
    try {
      // get tags count
      let dashboardCountsItems = {};

      if (reqData.userType === "admin") {

      }

      const userId = reqData.userId;

      if (reqData.userType !== "admin") {
        const [tagsCount, botData] = await Promise.all([
          UrgentTagModel.countDocuments({ userId }),
          botModel.findOne({ userId }),
        ]);
        
        dashboardCountsItems["tagsCount"] = tagsCount;
        if (botData) {
          dashboardCountsItems["listingsCount"] = botData.listing?.length || 0;
          if (botData.isOffline) {
            // get offline conversation counts
            const [logCounts] = await conversationalLogModel.aggregate([
              { $match: { botId: botData._id } },
              {
                $group: {
                  _id: null,
                  messagesCount: { $sum: 1 },
                  unreadMessagesCount: {
                    $sum: {
                      $cond: [{ $eq: ["$isUnread", true] }, 1, 0],
                    },
                  },
                },
              },
            ]);

            dashboardCountsItems["messagesCount"] = logCounts?.messagesCount || 0;
            dashboardCountsItems["unreadMessagesCount"] = logCounts?.unreadMessagesCount || 0;
          } else {
            // PMS based bot
            const autoMsgCount = Number(botData["autoMsgCount"]) || 0;
            const nonAutoMsgCount = Number(botData["nonAutoMsgCount"]) || 0;

            const total = autoMsgCount + nonAutoMsgCount;

            const autoMsgPercentage = total > 0 ? (autoMsgCount / total) * 100 : 0;

            dashboardCountsItems["autoMsgPercentage"] = Math.round(autoMsgPercentage)+"%";

            logger.info(`DashboardServices -> getCounts -> bot is not offline`);
            const settingsData = await settingsModel.findOne({ userId: reqData["userId"] });
            if (settingsData) {
              dashboardCountsItems["isPMS"] = true;
            }
          }
        }
      } else {
        const usersCountAgg = await loginModel.aggregate([
          {
            $match: {
              userType: { $ne: "admin" }
            }
          },
          {
            $group: {
              _id: "$accountStatus", // true or false
              count: { $sum: 1 }
            }
          },
          {
            $group: {
              _id: null,
              counts: {
                $push: {
                  k: { $cond: [{ $eq: ["$_id", true] }, "active", "inactive"] },
                  v: "$count"
                }
              },
              total: { $sum: "$count" }
            }
          },
          {
            $replaceRoot: {
              newRoot: {
                $mergeObjects: [
                  { total: "$total" },
                  { active: 0, inactive: 0 },
                  { $arrayToObject: "$counts" }
                ]
              }
            }
          }
        ]);

        if (usersCountAgg.length > 0) {
          dashboardCountsItems["usersCount"] = usersCountAgg[0]['total'];
          dashboardCountsItems["activeUsersCount"] = usersCountAgg[0]['active'];
          dashboardCountsItems["InactiveUsersCount"] = usersCountAgg[0]['inactive'];
        }


        const packages = await billingModel.find().countDocuments();

        dashboardCountsItems["packagesCount"] = packages;
      }

      return { error: false, data: dashboardCountsItems }
    } catch (error) {
      logger.error(
        `DashboardServices -> getCounts -> error: ${error.message}`
      );
      return { error: true, msg: 'Internal server error' };
    }
  }


}

export default new DashoboardService();

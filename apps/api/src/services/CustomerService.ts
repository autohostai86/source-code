import logger from "@app/loaders/logger";
import conversationalLogModel from "@app/models/conversationalLogModel";
import customerDataModel from "@app/models/customerDataModel";
import mongoose from 'mongoose';

class CustomerService {
    async addCustomer(reqData): Promise<any> {
        try {
            const create = await customerDataModel.create(reqData);
            if (create.get('_id')) {
                return { error: false, data: create, msg: 'Customer data is created successfully' }
            } else {
                return { error: true, msg: 'Failed to create customer data' }
            }
        } catch (error) {
            logger.error(`CustomerService -> addCustomer -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }

    async getCustomerData(reqData): Promise<any> {
        try {
            let filters = {};
            if (reqData['botId']) {
                filters['conversations.botId'] = mongoose.Types.ObjectId(reqData['botId']); // Convert botId to ObjectId
            }
            if (reqData['aptNo']) {
                filters['conversations.aptNo'] = reqData['aptNo'];
            }

            const data = await customerDataModel.aggregate([
                {
                    $match: {
                        phone: reqData['phone']
                    }
                },
                {
                    $lookup: {
                        from: "conversations", // Join with conversations collection
                        localField: '_id', // Match customer _id with conversation customerId
                        foreignField: 'customerId',
                        as: 'conversations'
                    }
                },
                {
                    $project: {
                        // Include all customer fields
                        phone: 1,
                        botId: 1,
                        aptNo: 1,
                        // Include other customer fields dynamically if needed
                        // Add additional customer fields here...

                        // Set conversations to an empty array if it doesn't exist or is not an array
                        conversations: {
                            $cond: {
                                if: { $isArray: "$conversations" },
                                then: "$conversations",
                                else: [] // Return an empty array if no conversations found
                            }
                        }
                    }
                },
                // Add a match stage to filter conversations if they exist
                {
                    $match: {
                        $or: [
                            { 'conversations': { $size: 0 } }, // No conversations present
                            filters // Apply filters if conversations exist
                        ]
                    }
                }
            ]).exec();

            console.log(data);
            return { error: false, data: data.length > 0 ? data[0] : {} }
        } catch (error) {
            logger.error(`CustomerService -> getCustomerData -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }


    async saveMessages(reqData): Promise<any> {
        try {
            if (reqData['customerId'] !== '') {
                // create or update
                const update = await conversationalLogModel.findOneAndUpdate({
                    customerId: reqData['customerId'],
                    aptNo: reqData['aptNo']
                },
                    {
                        botId: reqData['botId'],
                        customerId: reqData['customerId'],
                        isOfflineBot: reqData['isOfflineBot'],
                        messages: reqData['messages'],
                        isUnread: reqData['isUnread'],
                        internalListingName: reqData['internalListingName']
                    },
                    { upsert: true }
                );
            }
            return { error: false, data: 'updated' }
        } catch (error) {
            logger.error(`CustomerService -> getCustomerData -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }

    async getConversationsByBotId(reqData): Promise<any> {
        try {
            const data = await conversationalLogModel.find({ botId: reqData['botId'] }).populate('customerId');
            return { error: false, data: data }
        } catch (error) {
            logger.error(`CustomerService -> getConversationsByBotId -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }

    async updateMessageAsRead(reqData): Promise<any> {
        try {
            const data = await conversationalLogModel.findByIdAndUpdate(reqData['id'],{ isUnread: false });
            return { error: false, msg: 'success' }
        } catch (error) {
            logger.error(`CustomerService -> updateMessageAsRead -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }

    async updateUserOnlineStatus(reqData): Promise<any> {
        try {
            console.log(reqData);
            await customerDataModel.findByIdAndUpdate(reqData['userId'], {onlineStatus: reqData['status']});
            return { error: false, msg: 'Online status is updated' }
        } catch (error) {
            logger.error(`CustomerService -> updateUserOnlineStatus -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }

    async getCustomerDataOnly(reqData): Promise<any> {
        try {
            const data = await customerDataModel.find({botId: mongoose.Types.ObjectId(reqData['botId']), aptNo: reqData['aptNo']});
            return { error: false, data: data }
        } catch (error) {
            logger.error(`CustomerService -> getCustomerDataOnly -> error: ${error.message}`);
            return { error: true, msg: 'Internal server error' }
        }
    }
}

export default new CustomerService();
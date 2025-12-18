import subscribedPlansModel from "@app/models/subscribedPlansModel";
import mongoose from "mongoose";

const isSubscribed = async function (req, res, next: any): Promise<any> {
    const authSkipPaths = [
        '/api/superAdmin/getConfigs',
        '/api/users/login',
        '/api/upload/v2/generate-auth-url/oauth',
        '/api/bot/get-bot-by-id',
        '/api/auth/is-user-exists',
        '/api/auth/login',
        '/api/settings/get-by-user',
        '/api/auth/forgot-password',
        '/api/settings/get-by-user',
        '/api/bot/chat',
        '/api/bot/add-conversations',
        '/api/bot/webhook',
        '/api/bot/stayflexi-webhook',
        '/api//customer/get',
        '/api/customer/save-messages',
        '/api/customer/change-online-status',
        '/api/customer/create',
        '/api/bot/get-all-bots-by-user',
        '/api/bot/get-count',
        '/api/subscribedplans/get-current-subscription',
        '/api/auth/update-profile',
        '/api/customer/get',
        '/api/update-notification',
        '/api/customer/mark-as-read',
        '/api/customer/get-conversations',
        '/api/subscribedplans/add-credits',
        '/api/subscribedplans/change',
        '/api/uploads/botDocuments',
        '/api/plan/create-order'

    ];
    // skipping on public route as well as on development
    if (authSkipPaths.includes(req.path)) {
        // if (authSkipPaths.includes(req.originalUrl)) {
        next();
    } else {
        if (req.token) {
            const userData = req.token;
            console.log(userData);
            if (userData.userType !== "admin") {
                const userId = new mongoose.Types.ObjectId(userData.id);
                let planCategory = "free";
                let isExpired = false;
                const subscriptionData = await subscribedPlansModel.aggregate([
                    {
                        $match: { userId: userId }
                    },
                    {
                        $lookup: {
                            from: "billings",
                            localField: "billingId",
                            foreignField: "_id",
                            as: "billingDetails"
                        }
                    },
                    {
                        $unwind: "$billingDetails"
                    }
                ]);
                if (subscriptionData.length > 0 && subscriptionData[0]['billingDetails']['category']) {
                    planCategory = subscriptionData[0]['billingDetails']['category'];
                    isExpired = subscriptionData[0]['isExpired'];
                }

                if (planCategory === "free") {
                    // check for expiry
                    if (isExpired) {
                        return res.status(403).json({
                            success: false,
                            errorType: "FREE_PLAN_EXPIRED",
                            message: "Your quota is exceeded. Please upgrade your plan.",
                            planCategory,
                            isExpired,
                            availableBalance: 0
                        });
                    } else {
                        next();
                    }
                } else if (planCategory === "payAsYouGo") {
                    const balance = Number(subscriptionData[0]['availableBalance'] || 0);
                    if (subscriptionData.length > 0 && balance <= 1) {
                        return res.status(403).json({
                            success: false,
                            errorType: "FREE_PLAN_EXPIRED",
                            message: "Your quota is exceeded. Please upgrade your plan.",
                            planCategory,
                            isExpired,
                            availableBalance: balance
                        });
                    } else if (subscriptionData.length > 0 && balance > 0) {
                        console.log(subscriptionData[0]['availableBalance']);
                        res.setHeader("X-Plan-Category", planCategory);
                        res.setHeader("X-Expired", isExpired);
                        res.setHeader("X-Balance", balance);
                        next();
                    }

                }


            } else {
                next();
            }
        } else {
            next();
        }
        
    }
}

export default isSubscribed;
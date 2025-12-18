/** @format */

import mongoose, { Schema } from 'mongoose';


export interface ISubscribedPlansModel extends mongoose.Document {
    paymentStatus: any;
    expiryDate: any;

}

const SubscribedPlansModel = new mongoose.Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'admins' },
        billingId: { type: Schema.Types.ObjectId, ref: 'billing' },
        botId: { type: Schema.Types.ObjectId, ref: 'bots' },
        isExpired: {
            type: Boolean,
            default: false,
            index: true
        },
        paymentStatus: {
            type: Boolean,
            default: false,
            index: true
        },
        expiryDate: {
            require: false,
            type: Date,
            index: true
        },
        transactions: [],
        availableBalance: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true },
);

export default mongoose.model<ISubscribedPlansModel>('subscribedPlans', SubscribedPlansModel);

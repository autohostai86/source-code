/** @format */

import mongoose, { Schema } from 'mongoose';


export interface INotificationModel extends mongoose.Document {
    accountId: string;
    email: string;
    password: string;
}

const NotificationModel = new mongoose.Schema(
    {
        accountId: String,
        isSeen: {
            type: Boolean,
            default: false
        },
        data: {}
    },
    { timestamps: true },
);

export default mongoose.model<INotificationModel>('notifications', NotificationModel);

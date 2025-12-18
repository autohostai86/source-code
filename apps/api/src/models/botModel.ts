/** @format */

import mongoose, { Schema } from 'mongoose';


export interface IBotModel extends mongoose.Document {
    userName: string;
    email: string;
    password: string;
    title: String;
    listing: [];
    isOffline:boolean
}

const BotModel = new mongoose.Schema(
    {
        title: String,
        initialMessage: String,
        dataSourceFiles: [],
        qa: {},
        vectorPath: {
            type: [],
            require: false
        },
        isOffline: {
            type: Boolean,
            default: false
        },
        botToken: {
            type: {},
            require: false
        },
        userId: { type: Schema.Types.ObjectId, ref: 'admins' },
        listing: {
            type: [],
            require: false
        },
        isActive: {
            type: Boolean,
            default: true
        },
        autoMsgCount: {
            default: 0
        },
        nonAutoMsgCount: {
            default: 0
        },
    },
    { timestamps: true },
);

export default mongoose.model<IBotModel>('bots', BotModel);

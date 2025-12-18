/** @format */

import mongoose, { Schema } from 'mongoose';

export interface ICustomerDataModel extends mongoose.Document {
    name: String;
    email: String;
    phone: string;
    idProof: string;
    signature: string;
    aptName: string;
    aptNo: string;
}

const CustomerDataModel = new mongoose.Schema(
    {
        botId: { type: Schema.Types.ObjectId, ref: 'bots' },
        aptName: {
            type: String,
            index: true
        },
        aptNo: {
            type: String,
            index: true
        },
        name: {
            type: String,
            index: true
        },
        email: {
            type: String,
            index: true
        },
        phone: {
            type: String,
            index: true
        },
        idProof: {
            type: String,
            require: false,
        },
        signature: {
            type: String,
            require: false,
        },
        onlineStatus: {
            type: Boolean,
            default: false
        },
        
    },
    { timestamps: true },
);

export default mongoose.model<ICustomerDataModel>('customers', CustomerDataModel);

/** @format */

import mongoose, { Schema } from 'mongoose';


export interface IAutomatedResponseModel extends mongoose.Document {
    timedelay: string;
    message: string;
}

const AutomatedResponseModel = new mongoose.Schema(
    {
        timedelay: {
            type: String,
            require: true,
        },
        message: {
            type: String,
            require: true,
        },
    },
    { timestamps: true },
);

export default mongoose.model<IAutomatedResponseModel>('automatedResponse', AutomatedResponseModel);
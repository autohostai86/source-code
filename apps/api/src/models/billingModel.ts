/** @format */

import mongoose, { Schema } from 'mongoose';


export interface IBillingModel extends mongoose.Document {
    title: string;
    description: string;
    validityPeriod: number;
}

const BillingModel = new mongoose.Schema(
    {
        category: {
            type: String,
            default: "free"
        },
        title: String,
        description: String,
        durationType: String,
        validityPeriod: Number,
        price: Number
    },
    { timestamps: true },
);

export default mongoose.model<IBillingModel>('billing', BillingModel);

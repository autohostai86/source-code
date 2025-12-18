/** @format */

import mongoose, { Schema } from 'mongoose';


export interface IUrgentTagModel extends mongoose.Document {
    title: string;
    description: string;
    isActive: boolean
}

const UrgentTagModel = new mongoose.Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'admins' },
        title: {
            type: String,
            require: true,
            // unique: true
        },
        description: String,
        isActive: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true },
);

export default mongoose.model<IUrgentTagModel>('urgentTag', UrgentTagModel);
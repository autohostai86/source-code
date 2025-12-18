/** @format */

import mongoose, { Schema } from 'mongoose';

export interface ISettingsModel extends mongoose.Document {
    userId: string,
    pmsType: string,
    accessToken: string;
}

const SettingsSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'admins' },
    pmsType: {
        type: Object,
        required: true
    },
    accessToken: {
        type: String,
        required: true
    },
    groupId: {
        type: String,
        required: false
    },
    apiKey: {
        type: String,
        required: false
    }

}, { timestamps: true }); // Enable timestamps to automatically manage createdAt and updatedAt fields

export default mongoose.model<ISettingsModel>('settings', SettingsSchema);

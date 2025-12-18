/** @format */

import mongoose, { Schema, Types } from 'mongoose';

const ConversationalLogModel = new mongoose.Schema(
    {
        botId: { type: Schema.Types.ObjectId, ref: 'bots' },
        customerId: { type: Schema.Types.ObjectId, ref: 'customers' },
        aptNo: {
          type: String,
          index: true
        },
        isOfflineBot: {
            type: Boolean,
            default: false,
            index: true
        },
        messages: {
            type: Array,
            default: []
        },
        isUnread: {
            type: Boolean,
            default: false,
        },
        internalListingName: {
            type: String,
            index: true
        },
    },
    { timestamps: true },
);

export default mongoose.model('conversations', ConversationalLogModel);
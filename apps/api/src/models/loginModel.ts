/** @format */

import mongoose, { Schema } from 'mongoose';
import screenMenuItems, { screenMenuItemType } from '../constants/screenMenuItems';

export interface IAdminModel extends mongoose.Document {
    userName: string;
    email: string;
    password: string;
}

const AdminModel = new mongoose.Schema(
    {
        userType: {
            type: String,
            default: 'user'
        },
        userName: String,
        email: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
            index: true,
        },
        contactNo: {
            type: String
        },
        password: String,
        accountStatus: {
            type: Boolean,
            default: true
        },
        roles: { type: [] },
        onlineStatus: {
            type: Boolean,
            default: false
        },
        tokenExpiry: {
            type: String,
            require: false
        },
        profileImg: {
            type: String,
            default: ""
        }
    },
    { timestamps: true },
);

export default mongoose.model<IAdminModel>('admins', AdminModel);

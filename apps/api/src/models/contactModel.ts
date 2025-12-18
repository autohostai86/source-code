/** @format */

import mongoose, { Schema } from 'mongoose';


export interface IContactModel extends mongoose.Document {
    name: string;
    email: string;
    number: number;
    message: string;
}

const ContactModel = new mongoose.Schema(
    {
        name: String,
        email: String,
        number: Number,
        message: String,
    },
    { timestamps: true },
);

export default mongoose.model<IContactModel>('contact', ContactModel);

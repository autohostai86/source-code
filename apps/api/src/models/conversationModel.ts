/** @format */

import mongoose, { Schema } from 'mongoose';

export interface IConversationModel extends mongoose.Document {
    pmsReservationId: String;
    listingMapId: String;
    internalListingName: string;
}

const ConversationModel = new mongoose.Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'admins' },
        botId: { type: Schema.Types.ObjectId, ref: 'bots' },
        pmsReservationId: {
            type: String,
            index: true
        },
        listingMapId: {
            type: String,
            index: true
        },
        internalListingName: {
            type: String,
            index: true
        },
        channelName: {
            type: String,
            require: false,
        },
        reservationDate: {
            type: String,
            require: false,
        },
        pendingExpireDate: {
            type: String,
            require: false,
        },
        guestName: {
            type: String,
            require: false,
        },
        guestFirstName: {
            type: String,
            require: false,
        },
        guestLastName: {
            type: String,
            require: false,
        },
        guestExternalAccountId: {
            type: String,
            require: false,
        },
        guestZipCode: {
            type: String,
            require: false,
        },
        guestAddress: {
            type: String,
            require: false,
        },
        guestCity: {
            type: String,
            require: false
        },
        guestCountry: {
            type: String,
            require: false
        },
        guestEmail: {
            type: String,
            require: false
        },
        guestPicture: {
            type: String,
            require: false
        },
        numberOfGuests: {
            type: String,
            require: false
        },
        adults: {
            type: String,
            require: false
        },
        children: {
            type: String,
            require: false
        },
        infants: {
            type: String,
            require: false
        },
        pets: {
            type: String,
            require: false
        },
        arrivalDate: {
            type: String,
            require: false
        },
        departureDate: {
            type: String,
            require: false
        },
        checkInTime: {
            type: String,
            require: false
        },
        checkOutTime: {
            type: String,
            require: false
        },
        nights: {
            type: String,
            require: false
        },
        phone: {
            type: String,
            require: false
        },
        totalPrice: {
            type: String,
            require: false
        },
        remainingBalance: {
            type: String,
            require: false
        },
        taxAmount: {
            type: String,
            require: false
        },
        currency: {
            type: String,
            require: false
        },
        status: {
            type: String,
            require: false
        },
        paymentStatus: {
            type: String,
            require: false
        },
        cancellationDate: {
            type: String,
            require: false
        },
        cancelledBy: {
            type: String,
            require: false
        },
        insertedOn: {
            type: String,
            require: false
        },
        updatedOn: {
            type: String,
            require: false
        },
        latestActivityOn: {
            type: String,
            require: false
        },
        messageType: {
            type: String,
            require: false
        }
        
    },
    { timestamps: true },
);

export default mongoose.model<IConversationModel>('conversations', ConversationModel);

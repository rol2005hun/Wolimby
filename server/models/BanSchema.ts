import { Schema, Document, model } from 'mongoose';

export interface IBan {
    bannedIpList: [{
        ip: string,
        bannedAt: Date
    }],
    bannedUserList: [{
        user: string,
        bannedAt: Date
    }]
}
export interface IBanModel extends IBan, Document {};

const BanSchema: Schema = new Schema({
    _id: {
        type: String,
        required: true
    },

    bannedIpList: [{
        ip: {
            type: String
        },

        bannedAt: {
            type: Date,
            default: new Date()
        }
    }],

    bannedUserList: [{
        user: {
            type: String
        },

        bannedAt: {
            type: Date,
            default: new Date()
        }
    }]
});

export default model<IBanModel>('Ban', BanSchema);
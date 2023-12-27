import { Schema, Document, Types, model } from 'mongoose';

export interface IChat {
    messages: [{
        message: string,
        sentBy: string,
        createdAt: number
    }],

    users: [{
        user: string,
        roles: string[],
        nickname: string,
        joinedAt?: Date
    }],

    type: string,
    name: string,
    chatPicture: string,
}
export interface IChatModel extends IChat, Document {};

const ChatSchema: Schema = new Schema({
    messages: [{
        message: {
            type: String
        },

        sentBy: {
            type: Types.ObjectId,
            ref: 'User'
        },

        createdAt: {
            type: Date,
            default: new Date()
        }
    }],

    users: [{
        user: {
            type: Types.ObjectId,
            ref: 'User'
        },

        roles: [{
            type: String
        }],

        nickname: {
            type: String
        },

        joinedAt: {
            type: Date,
            default: new Date()
        }
    }],

    type: {
        type: String,
    },

    name: {
        type: String,
    },

    chatPicture: {
        type: String,
        default: ''
    },

    createdAt: {
        type: Date,
        default: new Date()
    }
});

export default model<IChatModel>('chat', ChatSchema);
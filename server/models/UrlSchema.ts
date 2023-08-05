import { Schema, Document, model } from 'mongoose';

interface IUrl {
    url: {
        fullUrl: string,
        shortUrl: string,
        createdAt: Date,
        updatedAt: Date,
        clicks: number
    }
}

export interface IUrlModel extends IUrl, Document {};

const UrlSchema: Schema = new Schema({
    url: {
        fullUrl: {
            type: String,
            required: true 
        },
        
        shortUrl: {
            type: String,
            required: true
        },

        createdAt: {
            type: Date,
            default: Date.now
        },

        updatedAt: {
            type: Date,
            default: Date.now
        },

        clicks: {
            type: Number,
            default: 0
        }
    }
});

export default model<IUrlModel>('Url', UrlSchema);
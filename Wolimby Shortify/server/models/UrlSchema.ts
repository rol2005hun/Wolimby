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
            default: new Date()
        },

        updatedAt: {
            type: Date,
            default: new Date()
        },

        clicks: {
            type: Number,
            default: 0
        }
    }
});

export default model<IUrlModel>('Url', UrlSchema);
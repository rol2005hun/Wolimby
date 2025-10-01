import { Schema, Document, Types, model } from 'mongoose';

export interface IPost {
    _id: Types.ObjectId,
    author: Types.ObjectId,
    description: string,
    file: string,
    likes: Types.ObjectId[],
    comments: IComment[],
    shares: Types.ObjectId[],
    privacy: {
        whoCanSee: Types.ObjectId[],
        whoCantSee: Types.ObjectId[],
        public: string
    },
    createdAt: Date
}

export interface IComment {
    _id: Types.ObjectId,
    author: Types.ObjectId,
    description: string,
    file: string,
    likes: Types.ObjectId[],
    replies: IReply[],
    createdAt: Date
}

export interface IReply {
    _id: Types.ObjectId,
    author: Types.ObjectId,
    description: string,
    file: string,
    likes: Types.ObjectId[],
    createdAt: Date
}

const PostSchema: Schema = new Schema({
    author: {
        type: Types.ObjectId,
        ref: 'User',
    },

    description: {
        type: String,
    },

    file: {
        type: String,
        default: 'none',
    },

    likes: [{
        type: Types.ObjectId,
        ref: 'User',
    }],

    comments: [{
        author: {
            type: Types.ObjectId,
            ref: 'User',
        },

        description: {
            type: String,
        },

        file: {
            type: String,
            default: 'none',
        },

        likes: [{
            type: Types.ObjectId,
            ref: 'User',
        }],

        replies: [{
            author: {
                type: Types.ObjectId,
                ref: 'User',
            },

            description: {
                type: String,
            },

            file: {
                type: String,
                default: 'none',
            },

            likes: [{
                type: Types.ObjectId,
                ref: 'User',
            }],

            createdAt: {
                type: Date,
                default: new Date(),
            },
        }],

        createdAt: {
            type: Date,
            default: new Date(),
        },
    }],

    shares: [{
        type: Types.ObjectId,
        ref: 'User',
    }],

    privacy: {
        whoCanSee: [{
            type: Types.ObjectId,
            ref: 'User',
        }],

        whoCantSee: [{
            type: Types.ObjectId,
            ref: 'User',
        }],

        public: {
            type: String,
            default: 'true',
        },
    },

    createdAt: {
        type: Date,
        default: new Date(),
    },
});

export default model<IPost>('Post', PostSchema);

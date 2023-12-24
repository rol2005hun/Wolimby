import { Schema, Document, model } from 'mongoose';

export interface IUser {
    profile: {
        username: string,
        email: string,
        name: string,
        password: string,
        profilePicture: string,
        biography: string,
        birthday?: Date,
        roles: string,
        notificationList: [{
            title: string,
            profilePicture: string,
            message: string,
            createdAt: Date
        }],
        ipList: [{
            ip: string,
            loggedAt: Date
        }],
        createdAt: Date
    },
    privacy: {
        showName: boolean,
        showEmail: boolean
    },
    appearance: {
        backgroundImage: string,
        theme: string
    }
}

export interface IUserModel extends IUser, Document {};

const UserSchema: Schema = new Schema({
    profile: {
        username: {
            type: String,
            required: true
        },
    
        name: {
            type: String,
            default: 'Nincs Megadva',
        },
    
        email: {
            type: String,
            required: true
        },
    
        password: {
            type: String,
            required: true
        },
    
        profilePicture: {
            type: String,
            default: 'https://i.imgur.com/ceDUpKL.png'
        },
    
        biography: {
            type: String,
            default: 'Wolimbyt használok.'
        },

        birthday: {
            type: Date
        },
    
        roles: {
            type: Array,
            default: ['user']
        },

        notificationList: [{
            title: {
                type: String
            },

            profilePicture: {
                type: String,
                default: 'https://i.imgur.com/N72oZnx.png'
            },
    
            message: {
                type: String
            },
    
            createdAt: {
                type: Date,
                default: new Date()
            }
        }],
    
        ipList: [{
            ip: {
                type: String
            },
    
            loggedAt: {
                type: Date,
                default: new Date()
            }
        }],

        createdAt: {
            type: Date,
            default: new Date()
        }
    },

    privacy: {
        showName: {
            type: Boolean,
            default: true
        },

        showEmail: {
            type: Boolean,
            default: true
        }
    },

    appearance: {
        backgroundImage: {
            type: String,
            default: 'none'
        },

        theme: {
            type: String,
            default: 'theme3'
        },
    }
});

export default model<IUserModel>('User', UserSchema);
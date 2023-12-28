import { NextFunction, Request, Response } from 'express';
import Chat from '../models/ChatSchema';

const createChat = async (req: Request, res: Response, next: NextFunction) => {
    let newChat = new Chat({
        type: req.body.type,
        users: [],
        name: req.body.name,
        chatPicture: req.body.chatPicture
    });

    for(let i = 0; i < req.body.users.length; i++) {
        newChat.users.push({
            user: req.body.users[i],
            roles: ['user'],
            nickname: null,
        });
    }

    try {
        await newChat.save();
        await newChat.populate(['users.user', 'messages.sentBy']);
        return res.status(201).send({
            success: true,
            message: 'Sikeres chat készítés.',
            chat: newChat
        });
    } catch (err) {
        return res.status(404).send({
            success: false,
            error: err.message
        });
    }
}

const getChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const chat = await Chat.findOne({ _id: req.query.chatId }).populate(['users.user', 'messages.sentBy']);
        return res.status(200).send({
            success: true,
            chat: chat
        });
    } catch (err) {
        return res.status(404).send({
            success: false,
            error: err.message
        });
    }
}

const getUserChats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const chats = await Chat.find({ 'users.user': req.query.userId }).populate(['users.user', 'messages.sentBy']);

        chats.sort((a: any, b: any) => {
            const lastMessageA = a.messages[a.messages.length - 1];
            const lastMessageB = b.messages[b.messages.length - 1];

            if (lastMessageA && lastMessageB) {
                return new Date(lastMessageB.createdAt).getTime() - new Date(lastMessageA.createdAt).getTime();
            } else {
                return 0;
            }
        });

        return res.status(200).send({
            success: true,
            chats: chats
        });
    } catch (err) {
        return res.status(404).send({
            success: false,
            error: err.message
        });
    }
}

const editChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const chat = await Chat.findOne({ _id: req.query.chatId });
        chat.set(req.body);
        chat.save().then(() => {
            return res.status(200).send({
                success: true,
                message: 'Sikeres chat módosítás.',
                chat: chat
            });
        });
    } catch (err) {
        return res.status(404).send({
            success: false,
            error: err.message
        });
    }
}

const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    const chat = await Chat.findOne({ _id: req.query.chatId });

    try {
        chat.messages.push(req.body.message);
        chat.save().then(() => {
            return res.status(201).send({
                success: true,
                message: 'Sikeres üzenet küldés.'
            });
        });
    } catch (err) {
        return res.status(404).send({
            success: false,
            error: err.message
        });
    }
}

const deleteChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const chat = await Chat.findOneAndDelete({ _id: req.query.chatId });

        return res.status(200).send({
            success: true,
            message: 'Sikeres chat törlés.',
            chat: chat
        });
    } catch (err) {
        return res.status(404).send({
            success: false,
            error: err.message
        });
    }    
}

const deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await Chat.updateOne({ _id: req.query.chatId }, { $pull: { messages: { _id: req.query.messageId } } }).then(() => {
            return res.status(200).send({
                success: true,
                message: 'Sikeres üzenet törlés.'
            });
        });
    } catch (err) {
        return res.status(404).send({
            success: false,
            error: err.message
        });
    }
}

export default {
    createChat,
    getChat,
    getUserChats,
    editChat,
    sendMessage,
    deleteChat,
    deleteMessage
}
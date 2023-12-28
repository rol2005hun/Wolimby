import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const createChat = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.body.type) {
        return res.status(400).send({
            success: false,
            message: 'A chat típusa kötelező.'
        });
    }

    if(req.body.users < 2) {
        return res.status(400).send({
            success: false,
            message: 'A chat felhasználói kötelezőek. (min. 2)'
        });
    }

    next();
}

export const getChat = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.query.chatId) {
        return res.status(400).send({
            success: false,
            message: 'A chat azonosítója kötelező.'
        });
    }

    next();
}

export const getUserChats = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.query.userId) {
        return res.status(400).send({
            success: false,
            message: 'A felhasználó azonosítója kötelező.'
        });
    }

    next();
}

export const editChat = async (req: Request, res: Response, next: NextFunction) => {
    const userId = jwt.decode(req.headers.authorization.split(' ')[1])?._id;
    const isInChat = req.body.users.find((user: any) => user.user._id == userId);

    if(!isInChat) {
        return res.status(401).send({
            success: false,
            message: 'Nincs jogosultságod a chat szerkesztéséhez.'
        });
    }

    if(!req.query.chatId) {
        return res.status(400).send({
            success: false,
            message: 'A chat azonosítója kötelező.'
        });
    }

    if(!req.body) {
        return res.status(400).send({
            success: false,
            message: 'A chat adatai kötelezőek.'
        });
    }

    next();
}

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    const userId = jwt.decode(req.headers.authorization.split(' ')[1])?._id;
    const isInChat = req.body.chat.users.find((user: any) => user.user._id == userId);

    if(!isInChat) {
        return res.status(401).send({
            success: false,
            message: 'Nincs jogosultságod az üzenet küldéséhez.'
        });
    }

    if(!req.query.chatId) {
        return res.status(400).send({
            success: false,
            message: 'A chat azonosítója kötelező.'
        });
    }

    if(!req.body.message) {
        return res.status(400).send({
            success: false,
            message: 'Az üzenet kötelező.'
        });
    }

    next();
}

export const deleteChat = async (req: Request, res: Response, next: NextFunction) => {
    const userId = jwt.decode(req.headers.authorization.split(' ')[1])?._id;
    const isInChat = req.body.users.find((user: any) => user.user._id == userId);

    if(!isInChat) {
        return res.status(401).send({
            success: false,
            message: 'Nincs jogosultságod a chat törléséhez.'
        });
    }

    if(!req.query.chatId) {
        return res.status(400).send({
            success: false,
            message: 'A chat azonosítója kötelező.'
        });
    }

    next();
}

export const deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.query.chatId) {
        return res.status(400).send({
            success: false,
            message: 'A chat azonosítója kötelező.'
        });
    }

    if(!req.query.messageId) {
        return res.status(400).send({
            success: false,
            message: 'Az üzenet azonosítója kötelező.'
        });
    }

    next();
}
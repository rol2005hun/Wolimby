import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const createReply = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.body.author) {
        return res.status(404).send({
            success: false,
            message: 'Nincs szerző megadva.'
        });
    }

    if(!req.body.file && (req.body.description.length < 1 || req.body.description.length > 200)) {
        return res.status(404).send({
            success: false,
            message: 'A válasz 1 és 200 karakter között kell álljon.'
        });
    }

    next();
}

export const removeReply = async (req: Request, res: Response, next: NextFunction) => {
    const userId = jwt.decode(req.headers.authorization.split(' ')[1])?._id;
    const hasPermission = req.body.userId == userId;

    if(!hasPermission) {
        return res.status(404).send({
            success: false,
            message: 'Nincs jogosultságod a válasz törléséhez.'
        });
    }

    if(!req.query.postId) {
        return res.status(404).send({
            success: false,
            message: 'Nincs bejegyzés ID megadva.'
        });
    }

    if(!req.query.commentId) {
        return res.status(404).send({
            success: false,
            message: 'Nincs hozzászólás ID megadva.'
        });
    }

    if(!req.query.replyId) {
        return res.status(404).send({
            success: false,
            message: 'Nincs válasz ID megadva.'
        });
    }

    next();
}
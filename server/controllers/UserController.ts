import { NextFunction, Request, Response } from 'express';
import User from '../models/UserSchema';

const currentUser = async (req: Request, res: Response, next: NextFunction) => {
    return res.send({
        success: true,
        user: req.user
    });
}

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find();
        return res.status(200).send({
            success: true,
            users
        });
    } catch (err) {
        return res.status(404).send({
            success: false,
            error: err.message
        });
    }
}

export default {
    currentUser,
    getUsers
};
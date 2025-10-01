import { NextFunction, Request, Response } from 'express';

const currentUser = async (req: Request, res: Response, next: NextFunction) => {
    return res.send({
        success: true,
        user: req.user
    });
}

export default {
    currentUser
}
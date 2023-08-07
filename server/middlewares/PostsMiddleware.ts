import { NextFunction, Request, Response } from 'express';

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.body.author) {
        return res.status(404).send({
            success: false,
            message: 'Nincs szerző megadva.'
        });
    }

    if(!req.body.file && (req.body.description.length < 1 || req.body.description.length > 200)) {
        return res.status(404).send({
            success: false,
            message: 'A leírás 1 és 200 karakter között kell álljon.'
        });
    }

    next();
}


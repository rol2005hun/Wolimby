import { NextFunction, Request, Response } from 'express';

const test = async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(201).send({
            success: true,
            message: 'A Wolimby Account szerverei megfelőlen müködnek.'
        });
    } catch (err) {
        return res.status(404).send({
            success: false,
            message: err.message
        });
    }
}

export default {
    test
};
import { NextFunction, Request, Response } from 'express';
import Url from '../models/UrlSchema';

const url = async (req: Request, res: Response, next: NextFunction) => {
    const url = await Url.findOne({ 'url.shortUrl': req.query.url });
    
    if(!url) {
        return res.status(404).send({
            success: false,
            message: 'Nincs ilyen URL.'
        });
    }

    try {
        return res.status(201).send({
            success: true,
            url: url.url.fullUrl
        });
    } catch (err) {
        return res.status(404).send({
            success: false,
            error: err.message
        });
    }
}

const create = async (req: Request, res: Response, next: NextFunction) => {
    const url = new Url ({
        url: {
            fullUrl: req.body.fullUrl,
            shortUrl: req.body.shortUrl
        }
    });

    try {
        url.save().then(() => {
            return res.status(201).send({
                success: true,
                message: 'Sikeres url rövidítés.',
                url: url
            });
        });
    } catch (err) {
        return res.status(404).send({
            success: false,
            message: 'Sikertelen url rövidítés: ' + err
        });
    }
}

export default {
    url,
    create
}
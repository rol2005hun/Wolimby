import { NextFunction, Request, Response } from 'express';
import Url from '../models/UrlSchema';

export const checkUrl = async (req: Request, res: Response, next: NextFunction) => {
    const url = await Url.findOne({shortUrl: req.body.shortUrl});

    if(url) {
        return res.status(404).send({
            success: false,
            message: 'A megadott rövidített url már foglalt.'
        });
    }

    function isURL(str: string) {
        const pattern = new RegExp('^(https?:\\/\\/)?'+
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+
          '((\\d{1,3}\\.){3}\\d{1,3}))'+
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
          '(\\?[;&a-z\\d%_.~+=-]*)?'+
          '(\\#[-a-z\\d_]*)?$','i');
        return !!pattern.test(str);
    }

    if(!isURL(req.body.fullUrl)) {
        return res.status(404).send({
            success: false,
            message: 'A megadott url nem egy URL.'
        });
    }

    if(req.body.shortUrl.length < 3 || req.body.shortUrl.length > 8) {
        return res.status(404).send({
            success: false,
            message: 'A rövidített URL 3 és 8 karakter között kell álljon.'
        })
    }
  
    next();
}


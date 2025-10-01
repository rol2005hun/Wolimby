import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../models/UserSchema';

function passportAuthenticate(callback: (req: Request, res: Response, next: NextFunction) => void) {
  function hack(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('jwt', function (err, user, info) {
      if (err) return res.status(404).send({
        success: false,
        message: 'Ismeretlen hiba: ' + err
      });

      if (!user) return res.status(401).send({
        success: false,
        message: 'Kérlek előbb jelentkezz be.'
      });

      req.user = user;
      return callback(req, res, next);
    })(req, res, next);
  }

  return hack;
}

export const isLoggedIn = passportAuthenticate(async (req, res, next) => {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    try {
      const decoded = jwt.verify(req.headers.authorization.split(' ')[1], process.env.KEY);
      const user = await User.findOne({ _id: decoded._id }).exec();
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(401).send({
          success: false,
          message: 'Kérlek előbb jelentkezz be.'
        });
      }
    } catch (error) {
      res.status(500).send({
        success: false,
        message: 'Ismeretlen hiba: ' + error
      });
    }
  } else {
    res.status(401).send({
      success: false,
      message: 'Kérlek előbb jelentkezz be.'
    });
  }
});
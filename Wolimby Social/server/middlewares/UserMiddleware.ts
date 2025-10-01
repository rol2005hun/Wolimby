import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../models/UserSchema';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findOne({ $or: [{ 'profile.username': req.body.username }, { 'profile.email': req.body.username }] });

  if (!user) {
    return res.status(404).send({
      success: false,
      message: 'A megadott felhasználónév vagy email cím nem létezik.'
    });
  }

  if (req.body.username.length < 3 || req.body.username.length > 20) {
    return res.status(404).send({
      success: false,
      message: 'A felhasználónév 3 és 20 karakter között kell álljon.'
    });
  }

  if (req.body.password.length < 6) {
    return res.status(404).send({
      success: false,
      message: 'A jelszó minimum 6 karakterből kell álljon.'
    });
  }
  
  next();
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const isUsernameTaken = await User.findOne({ 'profile.username': req.body.username });
    const isEmailTaken = await User.findOne({ 'profile.email': req.body.email });

    if (isUsernameTaken) {
        return res.status(404).send({
            success: false,
            message: 'A megadott felhasználónév már foglalt.'
        });
    }

    if (isEmailTaken) {
        return res.status(404).send({
            success: false,
            message: 'A megadott email cím már foglalt.'
        });
    }

    if (req.body.username.length < 3 || req.body.username.length > 20) {
        return res.status(404).send({
            success: false,
            message: 'A felhasználónév 3 és 20 karakter között kell álljon.'
        });
    }

    if (req.body.email.length < 6 || req.body.email.length > 30) {
        return res.status(404).send({
            success: false,
            message: 'Az email cím 6 és 30 karakter között kell álljon.'
        });
    }

    function isEmail(str: string) {
        const pattern = new RegExp('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$');
        return !!pattern.test(str);
    }

    if(!isEmail(req.body.email)) {
        return res.status(404).send({
            success: false,
            message: 'A megadott email cím nem megfelelő. (pelda@wolimby.site)'
        });
    }

    if (req.body.password.length < 6) {
        return res.status(404).send({
            success: false,
            message: 'A jelszó minimum 6 karakterből kell álljon.'
        });
    }

    next();
}

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
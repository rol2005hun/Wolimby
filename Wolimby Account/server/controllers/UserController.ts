import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import reqip from 'request-ip';
import User from '../models/UserSchema';
import { config } from '../config/config';

const login = async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ $or: [{ 'profile.username': req.body.username }, { 'profile.email': req.body.username }] });
    const key = config.key;

    const validPassword = await bcrypt.compare(req.body.password, user.profile.password);
    try {
        if (validPassword) {
            const payload = {
                _id: user._id,
                username: user.profile.username,
                name: user.profile.name,
                email: user.profile.email
            }
            jwt.sign(payload, key, {
                expiresIn: 604800
            }, async (err, token) => {
                user.profile.ipList.push({ ip: reqip.getClientIp(req), loggedAt: new Date() });
                await user.save();

                return res.status(200).send({
                    success: true,
                    message: 'Sikeres bejelentkezés.',
                    user: user,
                    token: `Bearer ${token}`
                });
            })
        } else {
            return res.status(404).send({
                success: false,
                message: 'A megadott jelszó helytelen.'
            });
        }
    } catch (err) {
        return res.status(404).send({
            success: false,
            error: err.message
        });
    }
}

const register = async (req: Request, res: Response, next: NextFunction) => {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    const user = new User ({
        profile: {
            username: req.body.username,
            email: req.body.email,
            birthday: req.body.birthday,
            password: password
        }
    });

    try {
        user.save().then(async () => {
            user.profile.ipList.push({ ip: reqip.getClientIp(req), loggedAt: new Date() });
            await user.save();
            
            return res.status(201).send({
                success: true,
                message: 'Sikeres regisztráció.',
                user: user
            })
        });
    } catch(err) {
        return res.status(404).send({
            success: false,
            message: 'Sikertelen regisztráció: ' + err
        });
    }
}

const patchUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let temp = {};
        switch(req.query.patching) {
            case 'profile':
                if(req.body.password) {
                    const salt = await bcrypt.genSalt(10);
                    req.body.password = await bcrypt.hash(req.body.password, salt);
                }
                for(let field in req.body) {
                    temp['profile.' + field] = req.body[field];
                }
                await User.updateOne({ _id: req.query.user }, { $set: temp });
                break;
            case 'appearance':
                for(let field in req.body) {
                    temp['appearance.' + field] = req.body[field];
                }
                await User.updateOne({ _id: req.query.user }, { $set: temp });
                break;
            case 'privacy':
                for(let field in req.body) {
                    temp['privacy.' + field] = req.body[field];
                }
                await User.updateOne({ _id: req.query.user }, { $set: temp });
                break;
        }
    } catch (err) {
        return res.status(404).send({
            success: false,
            error: err.message
        });
    }
    const userToPatch = await User.findOne({ _id: req.query.user });

    return res.status(201).send({
        success: true,
        message: 'Sikeres mentés.',
        user: userToPatch
    });
}

const notification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        switch(req.query.action) {
            case 'add':
                const notification = { 'profile.notificationList': [{ title: req.body.title, message: req.body.message }] };
                await User.updateOne({ _id: req.query.user }, { $push: notification });
                break
            case 'delete':
                await User.updateOne({ _id: req.params.id}, { $set: {'profile.notificationList': []}}, { multi: true });
                break;
        }
    } catch (err) {
        return res.status(404).send({
            success: false,
            error: err.message
        });
    }

    const userToPatch = await User.findOne({ _id: req.query.user });

    return res.status(201).send({
        success: true,
        message: 'Sikeres mentés.',
        user: userToPatch
    });
}

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await User.findByIdAndDelete({ _id: req.query.user });

        return res.send({
            success: true,
            message: 'Sikeres törlés.'
        });
    } catch (err) {
        return res.status(404).send({
            success: false,
            error: err.message
        });
    }
}

const getUser = async (req: Request, res: Response, next: NextFunction) => {
    let user;
    
    if(mongoose.Types.ObjectId.isValid(req.query.user)) {
        user = await User.findOne({ _id: req.query.user }).select(['-profile.password', '-profile.ipList']);
    } else {
        user = await User.findOne({ 'profile.username': req.query.user }).select(['-profile.password', '-profile.ipList']);
    }

    try {
        if(!user) return res.status(404).send({
            success: false,
            message: 'Nem létezik ilyen felhasználó a megadott paraméterekkel.'
        });

        return res.send({
            success: true,
            user: user
        });
    } catch (err) {
        return res.status(404).send({
            success: false,
            error: err.message
        });
    }
}

const currentUser = async (req: Request, res: Response, next: NextFunction) => {
    return res.send({
        success: true,
        user: req.user
    });
}

export default {
    login,
    register,
    patchUser,
    notification,
    deleteUser,
    getUser,
    currentUser
};
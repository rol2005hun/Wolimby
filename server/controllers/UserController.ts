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

    async function ipLogging() {
        if (!user.profile.ipList.length) {
            const ip = { 'profile.ipList': [{ ip: reqip.getClientIp(req) }] };
            await User.updateOne({ $or: [{ 'profile.username': req.body.username }, { 'profile.email': req.body.email }] }, { $push: ip });
        } else {
            if (user.profile.ipList.length > 5) {
                user.profile.ipList.shift();
                await user.save();
            }

            for (let i = 0; i < user.profile.ipList.length; i++) {
                if (user.profile.ipList[i].ip == reqip.getClientIp(req)) {
                    await user.profile.ipList.splice(user.profile.ipList.map(x => x.ip).indexOf(reqip.getClientIp(req)), 1);
                    break;
                }
            }

            await user.profile.ipList.push({ ip: reqip.getClientIp(req), loggedAt: new Date() });
            await user.save();
        }
    }

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
            }, (err, token) => {
                ipLogging();
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
    const passwordk = await bcrypt.hash(req.body.password, salt);

    const user = new User ({
        profile: {
            username: req.body.username,
            email: req.body.email,
            birthday: req.body.birthday,
            password: passwordk
        }
    });

    try {
        user.save().then(() => {
            return res.status(201).send({
                success: true,
                message: 'Sikeres regisztráció.',
                user: user
            })
        })
    } catch(err) {
        return res.status(404).send({
            success: false,
            message: 'Sikertelen regisztráció: ' + err
        })
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
    currentUser
};
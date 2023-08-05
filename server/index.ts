import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import cors from 'cors';
import { config, configPassport } from './config/config';
import url from './routes/api/UrlAPI';
import users from './routes/api/UsersAPI';
import test from './routes/api/TestAPI';

const server = express();

mongoose.connect(config.mongo.url)
    .then(() => console.log('[Wolimby Account] Az adatbázishoz való csatlakozás sikeres volt.'))
    .catch(err => console.log('[Wolimby Account] Az adatbázishoz való csatlakozás sikertelen volt: ' + err));

server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(passport.initialize());
server.use(cors());

configPassport(passport);

server.use('/url', url);
server.use('/users', users);
server.use('/test', test);

server.listen(config.server.port, () => {
    console.log('[Wolimby Account] A szerver sikeres elindult, port: ' + config.server.port);
});
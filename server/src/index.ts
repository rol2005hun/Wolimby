import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import cors from 'cors';
import { config, configPassport } from './config/config';
import users from './routes/api/UsersAPI';

const server = express();

mongoose.connect(config.mongo.url)
    .then(() => console.log('[Wolimby Account] Az adatbázishoz való csatlakozás sikeres volt.'))
    .catch(err => console.log('[Wolimby Account] Az adatbázishoz való csatlakozás sikertelen volt: ' + err));

server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(passport.initialize());
server.use(cors());

configPassport(passport);

server.use('/users', users);

server.listen(config.server.port, () => {
    console.log('[Wolimby Account] A szervere sikeres elindult, port: ' + config.server.port);
});
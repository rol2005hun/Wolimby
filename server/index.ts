import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import cors from 'cors';
import { config, configPassport } from './config/config';
import posts from './routes/api/PostsAPI';
import comments from './routes/api/CommentsAPI';
import replies from './routes/api/RepliesAPI';
import users from './routes/api/UsersAPI';
import test from './routes/api/TestAPI';

const server = express();

mongoose.connect(config.mongo.url)
    .then(() => console.log('[Wolimby Social] Az adatbázishoz való csatlakozás sikeres volt.'))
    .catch(err => console.log('[Wolimby Social] Az adatbázishoz való csatlakozás sikertelen volt: ' + err));

server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(passport.initialize());
server.use(cors());

configPassport(passport);

server.use('/posts', posts);
server.use('/posts/comments', comments);
server.use('/posts/comments/replies', replies);
server.use('/users', users);
server.use('/test', test);

server.listen(config.server.port, () => {
    console.log('[Wolimby Social] A szerver sikeres elindult, port: ' + config.server.port);
});
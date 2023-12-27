import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import passport from 'passport';
import cors from 'cors';
import { config, configPassport } from './config/config';
import posts from './routes/api/PostsAPI';
import comments from './routes/api/CommentsAPI';
import replies from './routes/api/RepliesAPI';
import users from './routes/api/UsersAPI';
import chats from './routes/api/ChatsAPI';
import test from './routes/api/TestAPI';
import setupSocket from './socket';

const app = express();
const server = http.createServer(app);

mongoose.connect(config.mongo.url)
    .then(() => console.log('[Wolimby Social] Az adatbázishoz való csatlakozás sikeres volt.'))
    .catch(err => console.log('[Wolimby Social] Az adatbázishoz való csatlakozás sikertelen volt: ' + err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(cors());

configPassport(passport);
setupSocket(server);

app.use('/posts', posts);
app.use('/posts/comments', comments);
app.use('/posts/comments/replies', replies);
app.use('/users', users);
app.use('/chats', chats);
app.use('/test', test);

server.listen(config.server.port, () => {
    console.log('[Wolimby Social] A szerver sikeres elindult, port: ' + config.server.port);
});
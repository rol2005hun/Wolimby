import dotenv from 'dotenv';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/UserSchema';

dotenv.config();

const MONGO_USERNAME = process.env.MONGO_USERNAME || '';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${[MONGO_PASSWORD]}@viewfy.zrgs7.mongodb.net/?retryWrites=true&w=majority`;
const KEY = process.env.KEY || '';
const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 1337;
const OPTS = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: KEY
};

export const config = {
    mongo: {
        username: MONGO_USERNAME,
        password: MONGO_PASSWORD,
        url: MONGO_URL
    },
    server: {
        port: SERVER_PORT
    },
    key: KEY
};

export const configPassport = (passport: any) => {
    passport.use(
        new JwtStrategy(OPTS, (jwt_payload, done) => {
          User.findById(jwt_payload._id)
            .then((user: any) => {
              if (user) return done(null, user);
              return done(null, false);
            })
            .catch((err: any) => console.log(err));
        })
    )
}
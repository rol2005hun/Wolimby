import express from 'express';
import controller from '../../controllers/UserController';
import { login, register, isLoggedIn } from '../../middlewares/UserMiddleware';

const router = express.Router();

router.post('/login', login, controller.login);
router.post('/register', register, controller.register);
router.get('/currentuser', isLoggedIn, controller.currentUser);

export = router;
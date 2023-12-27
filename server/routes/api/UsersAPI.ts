import express from 'express';
import controller from '../../controllers/UserController';
import { login, register, isLoggedIn } from '../../middlewares/UserMiddleware';

const router = express.Router();

router.get('/currentuser', isLoggedIn, controller.currentUser);
router.get('/', controller.getUsers);

export = router;
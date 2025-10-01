import express from 'express';
import controller from '../../controllers/UserController';
import { isLoggedIn } from '../../middlewares/UserMiddleware';

const router = express.Router();

router.get('/currentuser', isLoggedIn, controller.currentUser);

export = router;
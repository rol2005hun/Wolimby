import express from 'express';
import controller from '../../controllers/UserController';
import middleWare from '../../middlewares/UserMiddleware';

const router = express.Router();

router.post('/login', middleWare.login, controller.login);
router.post('/register', middleWare.register, controller.register);
router.patch('/patch', middleWare.isLoggedIn, controller.patchUser);
router.patch('/notification', middleWare.isLoggedIn, controller.notification);
router.delete('/delete', middleWare.isLoggedIn, controller.deleteUser);
router.get('/get', controller.getUser);
router.get('/currentuser', middleWare.isLoggedIn, controller.currentUser);

export = router;
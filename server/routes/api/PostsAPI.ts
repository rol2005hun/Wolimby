import express from 'express';
import controller from '../../controllers/PostsController';
import { createPost } from '../../middlewares/PostsMiddleware';

const router = express.Router();

router.post('/create', createPost, controller.createPost);
router.get('/get', controller.getPost);
router.get('/getall', controller.getAllPost);
router.patch('/edit', controller.editPost);
router.delete('/delete', controller.removePost);

export = router;

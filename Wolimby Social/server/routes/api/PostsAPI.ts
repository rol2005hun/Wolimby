import express from 'express';
import controller from '../../controllers/PostsController';
import { createPost, getPost, removePost } from '../../middlewares/PostsMiddleware';

const router = express.Router();

router.post('/create', createPost, controller.createPost);
router.get('/get', getPost, controller.getPost);
router.get('/getall', controller.getAllPost);
router.patch('/edit', controller.editPost);
router.delete('/delete', removePost, controller.removePost);

export = router;

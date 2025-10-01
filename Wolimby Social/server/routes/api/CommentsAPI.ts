import express from 'express';
import controller from '../../controllers/CommentsController';
import { createComment, removeComment } from '../../middlewares/CommentsMiddleware';

const router = express.Router();

router.post('/create', createComment, controller.createComment);
router.patch('/edit', controller.editComment);
router.delete('/delete', removeComment, controller.removeComment);

export = router;

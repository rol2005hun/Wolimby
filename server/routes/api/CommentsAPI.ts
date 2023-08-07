import express from 'express';
import controller from '../../controllers/CommentsController';

const router = express.Router();

router.post('/create', controller.createComment);
router.patch('/edit', controller.editComment);
router.delete('/delete', controller.removeComment);

export = router;

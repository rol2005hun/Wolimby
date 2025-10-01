import express from 'express';
import controller from '../../controllers/RepliesController';
import { createReply, removeReply } from '../../middlewares/RepliesMiddleware';

const router = express.Router();

router.post('/create', createReply, controller.createReply);
router.patch('/edit', controller.editReply);
router.delete('/delete', removeReply, controller.removeReply);

export = router;

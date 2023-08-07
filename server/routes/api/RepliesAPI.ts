import express from 'express';
import controller from '../../controllers/RepliesController';

const router = express.Router();

router.post('/create', controller.createReply);
router.patch('/edit', controller.editReply);
router.delete('/delete', controller.removeReply);

export = router;

import express from 'express';
import controller from '../../controllers/ChatsController';

const router = express.Router();

router.post('/create', controller.createChat);
router.get('/', controller.getUserChats);
router.post('/messages/send', controller.sendMessage);
router.patch('/edit', controller.editChat);
router.delete('/delete', controller.deleteChat);
router.delete('/messages/delete', controller.deleteMessage);

export = router;

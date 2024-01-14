import express from 'express';
import controller from '../../controllers/ChatsController';
import { sendMessage, editChat, deleteChat } from '../../middlewares/ChatMiddleware';

const router = express.Router();

router.post('/create', controller.createChat);
router.get('/', controller.getUserChats);
router.post('/messages/send', sendMessage, controller.sendMessage);
router.patch('/edit', editChat, controller.editChat);
router.delete('/delete', deleteChat, controller.deleteChat);
router.delete('/messages/delete', controller.deleteMessage);

export = router;

import express from 'express';
import { auth } from '../middleware/auth.middleware.js';
import { getChats, getMessages, createChat, getOrgUsers, deleteChat } from '../controllers/chat.controller.js';

const router = express.Router();

router.use(auth);

router.get('/', getChats);
router.get('/users', getOrgUsers);
router.get('/:chatId/messages', getMessages);
router.post('/', createChat);
router.delete('/:chatId', deleteChat);

export default router;

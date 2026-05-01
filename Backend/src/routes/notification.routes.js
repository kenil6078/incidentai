import express from 'express';
const router = express.Router();
import * as notificationController from '../controllers/notification.controller.js';
import { auth  } from '../middleware/auth.middleware.js';

router.get('/', auth, notificationController.getNotifications);
router.post('/read-all', auth, notificationController.readAll);

export default router;

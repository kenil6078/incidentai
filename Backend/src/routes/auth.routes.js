import express from 'express';
const router = express.Router();
import * as authController from '../controllers/auth.controller.js';
import { auth  } from '../middleware/auth.middleware.js';

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', auth, authController.logout);
router.get('/me', auth, authController.getMe);

export default router;

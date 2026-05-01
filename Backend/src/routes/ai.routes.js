import express from 'express';
const router = express.Router();
import * as aiController from '../controllers/ai.controller.js';
import { auth  } from '../middleware/auth.middleware.js';

router.post('/summary', auth, aiController.getSummary);
router.post('/root-cause', auth, aiController.getRootCause);
router.post('/postmortem', auth, aiController.getPostmortem);

export default router;

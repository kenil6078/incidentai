import express from 'express';
const router = express.Router();
import * as analyticsController from '../controllers/analytics.controller.js';
import { auth  } from '../middleware/auth.middleware.js';

router.get('/overview', auth, analyticsController.getOverview);
router.get('/summary', auth, analyticsController.getSummary);

export default router;

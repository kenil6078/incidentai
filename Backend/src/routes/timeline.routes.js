import express from 'express';
const router = express.Router();
import * as timelineController from '../controllers/timeline.controller.js';
import { auth  } from '../middleware/auth.middleware.js';

router.get('/:incidentId', auth, timelineController.getTimeline);
router.post('/:incidentId', auth, timelineController.addTimelineEntry);

export default router;

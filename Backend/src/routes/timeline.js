const express = require('express');
const router = express.Router();
const timelineController = require('../controllers/timelineController');
const { auth } = require('../middleware/authMiddleware');

router.get('/:incidentId', auth, timelineController.getTimeline);
router.post('/:incidentId', auth, timelineController.addTimelineEntry);

module.exports = router;

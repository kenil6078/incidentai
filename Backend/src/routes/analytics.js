const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { auth } = require('../middleware/authMiddleware');

router.get('/overview', auth, analyticsController.getOverview);
router.get('/summary', auth, analyticsController.getSummary);

module.exports = router;

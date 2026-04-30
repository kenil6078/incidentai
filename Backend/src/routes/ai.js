const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { auth } = require('../middleware/authMiddleware');

router.post('/summary', auth, aiController.getSummary);
router.post('/root-cause', auth, aiController.getRootCause);
router.post('/postmortem', auth, aiController.getPostmortem);

module.exports = router;

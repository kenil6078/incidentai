const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { auth } = require('../middleware/authMiddleware');

router.get('/', auth, notificationController.getNotifications);
router.post('/read-all', auth, notificationController.readAll);

module.exports = router;

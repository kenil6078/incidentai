const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { auth, admin } = require('../middleware/authMiddleware');

router.get('/', auth, serviceController.getServices);
router.post('/', auth, admin, serviceController.createService);

module.exports = router;

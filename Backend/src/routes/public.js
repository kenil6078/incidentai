const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

router.get('/status/:orgSlug', publicController.getPublicStatus);

module.exports = router;

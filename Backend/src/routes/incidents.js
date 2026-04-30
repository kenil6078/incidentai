const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');
const { auth } = require('../middleware/authMiddleware');

router.get('/', auth, incidentController.getIncidents);
router.post('/', auth, incidentController.createIncident);
router.get('/:id', auth, incidentController.getIncidentById);
router.put('/:id', auth, incidentController.updateIncident);
router.delete('/:id', auth, incidentController.deleteIncident);

module.exports = router;

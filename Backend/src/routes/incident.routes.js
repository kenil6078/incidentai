import express from 'express';
const router = express.Router();
import * as incidentController from '../controllers/incident.controller.js';
import { auth, admin } from '../middleware/auth.middleware.js';

router.get('/', auth, incidentController.getIncidents);
router.post('/', auth, admin, incidentController.createIncident);
router.get('/:id', auth, incidentController.getIncidentById);
router.put('/:id', auth, incidentController.updateIncident);
router.delete('/:id', auth, incidentController.deleteIncident);

export default router;

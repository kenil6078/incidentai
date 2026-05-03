import express from 'express';
const router = express.Router();
import * as serviceController from '../controllers/service.controller.js';
import { auth, admin  } from '../middleware/auth.middleware.js';

router.get('/', auth, serviceController.getServices);
router.post('/', auth, admin, serviceController.createService);
router.patch('/:id', auth, admin, serviceController.updateService);
router.delete('/:id', auth, admin, serviceController.deleteService);

export default router;

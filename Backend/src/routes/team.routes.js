import express from 'express';
const router = express.Router();
import * as teamController from '../controllers/team.controller.js';
import { auth, admin  } from '../middleware/auth.middleware.js';

router.get('/', auth, teamController.getTeam);
router.post('/invite', auth, admin, teamController.inviteMember);
router.put('/:id/role', auth, admin, teamController.updateRole);
router.delete('/:id', auth, admin, teamController.removeMember);

export default router;

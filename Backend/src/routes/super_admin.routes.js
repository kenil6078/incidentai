import express from 'express';
import { getAllOrganizations, getOrganizationUsers, getAllUsers } from '../controllers/super_admin.controller.js';
import { auth, superAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(auth);
router.use(superAdmin);

router.get('/organizations', getAllOrganizations);
router.get('/organizations/:orgId/users', getOrganizationUsers);
router.get('/users', getAllUsers);

export default router;

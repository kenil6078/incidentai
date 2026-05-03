import express from 'express';
import { 
  getAllOrganizations, 
  getOrganizationUsers, 
  getAllUsers,
  updateUser,
  toggleUserStatus,
  updateOrganizationPlan,
  deleteUser,
  deleteOrganization
} from '../controllers/super_admin.controller.js';
import { auth, superAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(auth);
router.use(superAdmin);

router.get('/organizations', getAllOrganizations);
router.get('/organizations/:orgId/users', getOrganizationUsers);
router.put('/organizations/:orgId/plan', updateOrganizationPlan);
router.delete('/organizations/:orgId', deleteOrganization);
router.get('/users', getAllUsers);
router.put('/users/:userId', updateUser);
router.patch('/users/:userId/toggle-status', toggleUserStatus);
router.delete('/users/:userId', deleteUser);

export default router;

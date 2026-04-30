const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { auth, admin } = require('../middleware/authMiddleware');

router.get('/', auth, teamController.getTeam);
router.post('/invite', auth, admin, teamController.inviteMember);
router.put('/:id/role', auth, admin, teamController.updateRole);
router.delete('/:id', auth, admin, teamController.removeMember);

module.exports = router;

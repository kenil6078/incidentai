import userModel from '../models/user.model.js';
import organizationModel from '../models/organization.model.js';

export const getAllOrganizations = async (req, res) => {
  try {
    const orgs = await organizationModel.find().lean();
    
    // For each org, get count of developers
    const orgsWithCounts = await Promise.all(orgs.map(async (org) => {
      const devCount = await userModel.countDocuments({ orgId: org._id, role: 'developer' });
      const adminCount = await userModel.countDocuments({ orgId: org._id, role: 'admin' });
      return {
        ...org,
        counts: {
          developers: devCount,
          admins: adminCount,
          total: devCount + adminCount
        }
      };
    }));

    res.json(orgsWithCounts);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const getOrganizationUsers = async (req, res) => {
  try {
    const { orgId } = req.params;
    const users = await userModel.find({ orgId }).select('-password').lean();
    res.json(users);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find().populate('orgId', 'name').select('-password').lean();
    res.json(users);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, role } = req.body;
    
    const user = await userModel.findByIdAndUpdate(
      userId, 
      { name, email, role },
      { new: true }
    ).select('-password');
    
    if (!user) return res.status(404).json({ detail: 'User not found' });
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId);
    
    if (!user) return res.status(404).json({ detail: 'User not found' });
    
    user.active = !user.active;
    await user.save();
    
    res.json({ message: `User ${user.active ? 'unbanned' : 'banned'} successfully`, active: user.active });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const updateOrganizationPlan = async (req, res) => {
  try {
    const { orgId } = req.params;
    const { plan } = req.body;
    
    if (!['free', 'pro', 'enterprise'].includes(plan)) {
      return res.status(400).json({ detail: 'Invalid plan' });
    }
    
    const org = await organizationModel.findByIdAndUpdate(
      orgId,
      { plan },
      { new: true }
    );
    
    if (!org) return res.status(404).json({ detail: 'Organization not found' });
    
    res.json(org);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ detail: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const deleteOrganization = async (req, res) => {
  try {
    const { orgId } = req.params;
    
    // Optional: Check if org has users and decide if you want to delete them or prevent deletion
    const userCount = await userModel.countDocuments({ orgId });
    if (userCount > 0) {
      return res.status(400).json({ detail: 'Cannot delete organization with active users. Delete users first.' });
    }

    const org = await organizationModel.findByIdAndDelete(orgId);
    if (!org) return res.status(404).json({ detail: 'Organization not found' });
    res.json({ message: 'Organization deleted successfully' });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

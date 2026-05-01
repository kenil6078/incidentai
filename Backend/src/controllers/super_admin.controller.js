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

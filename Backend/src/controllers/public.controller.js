import organizationModel from '../models/organization.model.js';
import serviceModel from '../models/service.model.js';
import incidentModel from '../models/incident.model.js';

export const getPublicStatus = async (req, res) => {
  try {
    const { orgSlug } = req.params;
    const organization = await organizationModel.findOne({ slug: orgSlug });
    
    if (!organization) return res.status(404).json({ detail: 'Organization not found' });

    const services = await serviceModel.find({ orgId: organization._id });
    const active_incidents = await incidentModel.find({ 
      orgId: organization._id, 
      status: { $ne: 'resolved' } 
    }).sort({ createdAt: -1 });

    res.json({
      org_name: organization.name,
      services,
      active_incidents
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

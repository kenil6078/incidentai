import organizationModel from '../models/organization.model.js';
import serviceModel from '../models/service.model.js';
import incidentModel from '../models/incident.model.js';
import timelineModel from '../models/timeline.model.js';

export const getPublicStatus = async (req, res) => {
  try {
    const { orgSlug } = req.params;
    const organization = await organizationModel.findOne({ slug: orgSlug });
    
    if (!organization) return res.status(404).json({ detail: 'Organization not found' });

    const services = await serviceModel.find({ orgId: organization._id });
    const raw_incidents = await incidentModel.find({ 
      orgId: organization._id, 
      status: { $ne: 'resolved' } 
    }).sort({ createdAt: -1 });

    const active_incidents = [];
    for (const inc of raw_incidents) {
      const timeline = await timelineModel.find({ incidentId: inc._id })
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 });
      
      active_incidents.push({
        ...inc.toObject(),
        timeline
      });
    }

    res.json({
      org_name: organization.name,
      services,
      active_incidents
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

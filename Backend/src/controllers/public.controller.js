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
    
    // Active incidents (investigating, identified, monitoring)
    const raw_active = await incidentModel.find({ 
      orgId: organization._id, 
      status: { $in: ['investigating', 'identified', 'monitoring'] } 
    }).sort({ createdAt: -1 });

    // Past incidents (resolved) - last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const raw_past = await incidentModel.find({ 
      orgId: organization._id, 
      status: 'resolved',
      resolvedAt: { $gte: sevenDaysAgo }
    }).sort({ resolvedAt: -1 });

    const processIncidents = async (incidents) => {
      const results = [];
      for (const inc of incidents) {
        const timeline = await timelineModel.find({ incidentId: inc._id })
          .populate('createdBy', 'name')
          .sort({ createdAt: -1 });
        
        results.push({
          ...inc.toObject(),
          timeline
        });
      }
      return results;
    };

    const active_incidents = await processIncidents(raw_active);
    const past_incidents = await processIncidents(raw_past);

    res.json({
      org_name: organization.name,
      services,
      active_incidents,
      past_incidents
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

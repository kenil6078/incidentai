const Organization = require('../models/Organization');
const Service = require('../models/Service');
const Incident = require('../models/Incident');

exports.getPublicStatus = async (req, res) => {
  try {
    const { orgSlug } = req.params;
    const organization = await Organization.findOne({ slug: orgSlug });
    
    if (!organization) return res.status(404).json({ detail: 'Organization not found' });

    const services = await Service.find({ orgId: organization._id });
    const active_incidents = await Incident.find({ 
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

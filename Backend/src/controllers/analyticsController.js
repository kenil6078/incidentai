const Incident = require('../models/Incident');

exports.getOverview = async (req, res) => {
  try {
    const orgId = req.user.orgId._id;
    
    const total = await Incident.countDocuments({ orgId });
    const active = await Incident.countDocuments({ orgId, status: { $ne: 'resolved' } });
    const resolved = await Incident.countDocuments({ orgId, status: 'resolved' });
    
    // Calculate MTTR (Mean Time To Resolution)
    const resolvedIncidents = await Incident.find({ orgId, status: 'resolved', resolvedAt: { $exists: true } });
    let totalResolutionTime = 0;
    resolvedIncidents.forEach(inc => {
      totalResolutionTime += (inc.resolvedAt - inc.createdAt);
    });
    
    const mttr_minutes = resolvedIncidents.length > 0 
      ? Math.round((totalResolutionTime / resolvedIncidents.length) / (1000 * 60)) 
      : 0;

    res.json({
      total,
      active,
      resolved,
      mttr_minutes
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const orgId = req.user.orgId._id;
    
    const total_incidents = await Incident.countDocuments({ orgId });
    const critical_count = await Incident.countDocuments({ orgId, severity: 'critical', status: { $ne: 'resolved' } });
    
    const by_severity = {
      Critical: await Incident.countDocuments({ orgId, severity: 'critical' }),
      High: await Incident.countDocuments({ orgId, severity: 'high' }),
      Medium: await Incident.countDocuments({ orgId, severity: 'medium' }),
      Low: await Incident.countDocuments({ orgId, severity: 'low' }),
    };

    const resolvedIncidents = await Incident.find({ orgId, status: 'resolved', resolvedAt: { $exists: true } });
    let totalResolutionTime = 0;
    resolvedIncidents.forEach(inc => {
      totalResolutionTime += (inc.resolvedAt - inc.createdAt);
    });
    const mttr_minutes = resolvedIncidents.length > 0 
      ? Math.round((totalResolutionTime / resolvedIncidents.length) / (1000 * 60)) 
      : 0;

    const Service = require('../models/Service');
    const services = await Service.find({ orgId });
    const by_service = services.map(s => ({
      name: s.name,
      uptime: s.status === 'operational' ? 99.9 : 85.5
    }));

    res.json({
      total_incidents,
      critical_count,
      mttr_minutes,
      availability: 99.9,
      by_severity,
      by_service
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};


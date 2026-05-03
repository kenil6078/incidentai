import incidentModel from '../models/incident.model.js';
import serviceModel from '../models/service.model.js';


export const getOverview = async (req, res) => {
  try {
    const orgId = req.user.orgId._id;
    
    const total = await incidentModel.countDocuments({ orgId });
    const active = await incidentModel.countDocuments({ orgId, status: { $ne: 'resolved' } });
    const resolved = await incidentModel.countDocuments({ orgId, status: 'resolved' });
    
    // Calculate MTTR (Mean Time To Resolution)
    const resolvedIncidents = await incidentModel.find({ orgId, status: 'resolved', resolvedAt: { $exists: true } });
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

export const getSummary = async (req, res) => {
  try {
    const orgId = req.user.orgId._id;
    
    const total_incidents = await incidentModel.countDocuments({ orgId });
    const critical_count = await incidentModel.countDocuments({ orgId, severity: 'critical', status: { $ne: 'resolved' } });
    
    const by_severity = {
      Critical: await incidentModel.countDocuments({ orgId, severity: 'critical' }),
      High: await incidentModel.countDocuments({ orgId, severity: 'high' }),
      Medium: await incidentModel.countDocuments({ orgId, severity: 'medium' }),
      Low: await incidentModel.countDocuments({ orgId, severity: 'low' }),
    };

    const resolvedIncidents = await incidentModel.find({ orgId, status: 'resolved', resolvedAt: { $exists: true } });
    let totalResolutionTime = 0;
    resolvedIncidents.forEach(inc => {
      totalResolutionTime += (inc.resolvedAt - inc.createdAt);
    });
    const mttr_minutes = resolvedIncidents.length > 0 
      ? Math.round((totalResolutionTime / resolvedIncidents.length) / (1000 * 60)) 
      : 0;

    const services = await serviceModel.find({ orgId });
    const operationalCount = services.filter(s => s.status === 'operational').length;
    const availability = services.length > 0 
      ? Math.round((operationalCount / services.length) * 100) 
      : 100;

    const by_service = services.map(s => ({
      name: s.name,
      uptime: s.status === 'operational' ? 100 : s.status === 'degraded' ? 85 : 50,
      status: s.status
    }));

    res.json({
      total_incidents,
      critical_count,
      mttr_minutes,
      availability,
      by_severity,
      by_service
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};


import timelineModel from '../models/timeline.model.js';
import incidentModel from '../models/incident.model.js';
import userModel from '../models/user.model.js';
import { notifyTeam } from '../services/notification.service.js';

export const getTimeline = async (req, res) => {
  try {
    const timeline = await timelineModel.find({ incidentId: req.params.incidentId })
      .populate('createdBy', 'name avatar')
      .sort({ timestamp: 1 });
    res.json(timeline);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const addTimelineEntry = async (req, res) => {
  try {
    const { message, type } = req.body;
    const entry = new timelineModel({
      incidentId: req.params.incidentId,
      message,
      type,
      createdBy: req.user._id
    });

    await entry.save();
    
    // Fetch incident to get title and orgId
    const incident = await incidentModel.findById(req.params.incidentId);
    if (incident) {
      const team = await userModel.find({ orgId: incident.orgId });
      const notificationMsg = `[${incident.title}] ${type.toUpperCase()}: ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}`;
      
      notifyTeam(
        team, 
        incident.orgId, 
        notificationMsg, 
        `incident_${type}`, 
        req.app.get('io'),
        incident._id
      );
    }

    // Emit socket event for the timeline list update
    req.app.get('io').to(req.user.orgId._id.toString()).emit('timeline.added', {
      ...entry.toObject(),
      incidentId: req.params.incidentId
    });

    res.json(entry);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

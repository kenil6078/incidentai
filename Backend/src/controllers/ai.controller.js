import aiService from '../services/aiService.js';
import Incident from '../models/incident.model.js';
import Timeline from '../models/timeline.model.js';

export const getSummary = async (req, res) => {
  try {
    const { incidentId } = req.body;
    const incident = await Incident.findById(incidentId);
    const timeline = await Timeline.find({ incidentId }).populate('createdBy', 'name');
    
    const summary = await aiService.generateSummary(incident, timeline);
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const getRootCause = async (req, res) => {
  try {
    const { incidentId } = req.body;
    const incident = await Incident.findById(incidentId);
    const timeline = await Timeline.find({ incidentId }).populate('createdBy', 'name');
    
    const rootCause = await aiService.suggestRootCause(incident, timeline);
    res.json({ rootCause });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const getPostmortem = async (req, res) => {
  try {
    const { incidentId } = req.body;
    const incident = await Incident.findById(incidentId);
    const timeline = await Timeline.find({ incidentId }).populate('createdBy', 'name');
    
    const postmortem = await aiService.generatePostmortem(incident, timeline);
    res.json({ postmortem });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

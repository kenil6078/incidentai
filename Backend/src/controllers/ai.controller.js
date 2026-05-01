import * as aiService from '../services/ai.service.js';
import incidentModel from '../models/incident.model.js';
import timelineModel from '../models/timeline.model.js';

export const getSummary = async (req, res) => {
  try {
    const { incidentId } = req.body;
    const incident = await incidentModel.findById(incidentId);
    const timeline = await timelineModel.find({ incidentId }).populate('createdBy', 'name');
    
    const summary = await aiService.generateSummary(incident, timeline);
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const getRootCause = async (req, res) => {
  try {
    const { incidentId } = req.body;
    const incident = await incidentModel.findById(incidentId);
    const timeline = await timelineModel.find({ incidentId }).populate('createdBy', 'name');
    
    const rootCause = await aiService.suggestRootCause(incident, timeline);
    res.json({ rootCause });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const getPostmortem = async (req, res) => {
  try {
    const { incidentId } = req.body;
    const incident = await incidentModel.findById(incidentId);
    const timeline = await timelineModel.find({ incidentId }).populate('createdBy', 'name');
    
    const postmortem = await aiService.generatePostmortem(incident, timeline);
    res.json({ postmortem });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

import * as aiService from '../services/ai.service.js';
import incidentModel from '../models/incident.model.js';
import timelineModel from '../models/timeline.model.js';

export const getSummary = async (req, res) => {
  try {
    const { incidentId } = req.body;
    const incident = await incidentModel.findById(incidentId);
    const timeline = await timelineModel.find({ incidentId }).populate('createdBy', 'name');
    
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let fullText = '';
    await aiService.generateSummaryStream(incident, timeline, (chunk) => {
      fullText += chunk;
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    });

    // Save to database after stream completes
    incident.aiSummary = fullText;
    await incident.save();

    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (err) {
    console.error('AI Summary Error:', err);
    res.status(500).write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
};

export const getRootCause = async (req, res) => {
  try {
    const { incidentId } = req.body;
    const incident = await incidentModel.findById(incidentId);
    const timeline = await timelineModel.find({ incidentId }).populate('createdBy', 'name');
    
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let fullText = '';
    await aiService.suggestRootCauseStream(incident, timeline, (chunk) => {
      fullText += chunk;
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    });

    // Save to database
    incident.aiRootCause = fullText;
    await incident.save();

    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (err) {
    res.status(500).write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
};

export const getPostmortem = async (req, res) => {
  try {
    const { incidentId } = req.body;
    const incident = await incidentModel.findById(incidentId);
    const timeline = await timelineModel.find({ incidentId }).populate('createdBy', 'name');
    
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let fullText = '';
    await aiService.generatePostmortemStream(incident, timeline, (chunk) => {
      fullText += chunk;
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    });

    // Save to database
    incident.aiPostmortem = fullText;
    if (!incident.resolvedAt) {
      incident.resolvedAt = new Date();
      incident.status = 'resolved';
    }
    await incident.save();

    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (err) {
    res.status(500).write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
};

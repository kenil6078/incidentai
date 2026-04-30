const Timeline = require('../models/Timeline');

exports.getTimeline = async (req, res) => {
  try {
    const timeline = await Timeline.find({ incidentId: req.params.incidentId })
      .populate('createdBy', 'name avatar')
      .sort({ timestamp: 1 });
    res.json(timeline);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

exports.addTimelineEntry = async (req, res) => {
  try {
    const { message, type } = req.body;
    const entry = new Timeline({
      incidentId: req.params.incidentId,
      message,
      type,
      createdBy: req.user._id
    });
    await entry.save();
    
    // Emit socket event
    req.app.get('io').to(req.user.orgId._id.toString()).emit('timeline.added', entry);

    res.json(entry);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

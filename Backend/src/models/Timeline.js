const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema({
  incidentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident', required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['update', 'alert', 'fix', 'system'], default: 'update' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Timeline', timelineSchema);

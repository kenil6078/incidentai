const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Organization', organizationSchema);

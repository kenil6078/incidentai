const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  role: { type: String, enum: ['admin', 'developer', 'viewer'], default: 'admin' },
  avatar: { type: String },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);

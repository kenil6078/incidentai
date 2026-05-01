import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['incident_created', 'incident_updated', 'assigned', 'mention'], default: 'incident_updated' },
  read: { type: Boolean, default: false },
}, { timestamps: true });

const notificationModel = mongoose.model('Notification', notificationSchema);
export default notificationModel;


import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['operational', 'degraded', 'outage'], default: 'operational' },
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
}, { timestamps: true });

const serviceModel = mongoose.model('Service', serviceSchema);
export default serviceModel;


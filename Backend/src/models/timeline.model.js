import mongoose from 'mongoose';

const timelineSchema = new mongoose.Schema({
  incidentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Incident',
    required: true
  },
  message: { type: String, required: true },
  type: {
    type: String, enum: ['update', 'alert', 'fix', 'system'],
    default: 'update'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  }
},
{
  timestamps: true

});

const timelineModel = mongoose.model('Timeline', timelineSchema);
export default timelineModel;


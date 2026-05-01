import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema({
  name: {
    type: String, required: true

  },
  slug: {
    type: String, required: true,
    unique: true

  },
  plan: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    default: 'free'
  },
  address: {
    type: String
  },
}, {
  timestamps: true

});

const organizationModel = mongoose.model('Organization', organizationSchema);
export default organizationModel;


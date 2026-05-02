import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  razorpayOrderId: {
    type: String,
    required: true,
    unique: true
  },
  razorpayPaymentId: {
    type: String
  },
  razorpaySignature: {
    type: String
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  planId: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    required: true
  },
  status: {
    type: String,
    enum: ['created', 'captured', 'failed'],
    default: 'created'
  }
}, {
  timestamps: true
});

const transactionModel = mongoose.model('Transaction', transactionSchema);
export default transactionModel;

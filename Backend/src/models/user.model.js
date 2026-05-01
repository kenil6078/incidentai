import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String, 
    required: true
  },
  email: {
    type: String, 
    required: true, 
    unique: true
  },
  password: {
    type: String,
    select: false
  },
  googleId: {
    type: String
  },
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  },
  role: {
    type: String, 
    enum: ['admin', 'developer', 'viewer', 'super_admin', 'normal_user'],
    default: 'normal_user'
  },
  developerStatus: {
    type: String,
    enum: ['pending', 'approved']
  },
  address: {
    type: String
  },
  profileCompleted: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String,
  },
  avatar: {
    type: String,
  },
  active: {
    type: Boolean, 
    default: true
  },
},
{
  timestamps: true
}
);

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const userModel = mongoose.model('User', userSchema);
export default userModel;

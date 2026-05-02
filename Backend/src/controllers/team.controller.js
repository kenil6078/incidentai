import userModel from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendEmail } from '../services/email.service.js';
import { config } from '../config/config.js';

export const getTeam = async (req, res) => {
  try {
    const team = await userModel.find({ orgId: req.user.orgId._id }).select('-password');
    res.json(team);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const inviteMember = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    
    let user = await userModel.findOne({ email });
    if (user) return res.status(400).json({ detail: 'User already exists' });

    const verificationToken = crypto.randomBytes(32).toString('hex');

    user = new userModel({
      name,
      email,
      password,
      orgId: req.user.orgId._id,
      role,
      isVerified: false,
      verificationToken
    });
    await user.save();

    const verifyUrl = `${config.FRONTEND_URL}/verify-email/${verificationToken}`;
    
    await sendEmail({
      to: email,
      subject: `Invitation to join ${req.user.orgId.name} on incident.ai`,
      html: `
        <div style="background-color: #FAFAFA; padding: 40px 20px; font-family: 'Inter', sans-serif;">
          <div style="background-color: #FFFFFF; max-width: 500px; margin: 0 auto; border: 2px solid #000; box-shadow: 8px 8px 0px #000; padding: 48px;">
            <h1 style="font-size: 24px; font-weight: 900; margin-bottom: 16px;">You've been invited!</h1>
            <p style="color: #555; font-size: 16px; line-height: 24px; margin-bottom: 32px;">
              ${req.user.name} has invited you to join <strong>${req.user.orgId.name}</strong> as a <strong>${role}</strong> on incident.ai.
            </p>
            <div style="background-color: #F3F4F6; padding: 20px; border: 2px dashed #000; margin-bottom: 32px;">
              <p style="margin: 0; font-size: 14px;">Your temporary password: <strong>${password}</strong></p>
            </div>
            <a href="${verifyUrl}" style="display: inline-block; background-color: #FF6B6B; color: #000; padding: 16px 32px; border: 2px solid #000; font-weight: 900; text-decoration: none; box-shadow: 4px 4px 0px #000;">
              Accept Invitation & Verify Email
            </a>
          </div>
        </div>
      `
    });

    res.json({ email: user.email, temp_password: password });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await userModel.findOneAndUpdate(
      { _id: req.params.id, orgId: req.user.orgId._id },
      { role },
      { new: true }
    );
    if (!user) return res.status(404).json({ detail: 'Member not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const removeMember = async (req, res) => {
  try {
    const user = await userModel.findOneAndDelete({ _id: req.params.id, orgId: req.user.orgId._id });
    if (!user) return res.status(404).json({ detail: 'Member not found' });
    res.json({ detail: 'Member removed' });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import userModel from '../models/user.model.js';
import organizationModel from '../models/organization.model.js';
import { config } from '../config/config.js';
import { sendEmail } from '../services/email.service.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, orgName } = req.body;
    
    let user = await userModel.findOne({ email });
    if (user) return res.status(400).json({ detail: 'User already exists' });

    // Create Organization
    const slug = orgName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const organization = new organizationModel({ name: orgName, slug });
    await organization.save();

    // Create User with Verification Token
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    user = new userModel({
      name,
      email,
      password: hashedPassword,
      orgId: organization._id,
      role: 'admin',
      isVerified: false,
      verificationToken
    });
    await user.save();

    // Send Verification Email
    const verifyLink = `http://localhost:5173/verify-email/${verificationToken}`;
    await sendEmail({
      to: email,
      subject: 'Verify your Incident.ai Account',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Welcome to Incident.ai, ${name}!</h2>
          <p>Please click the button below to verify your email address and activate your account:</p>
          <a href="${verifyLink}" style="padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 15px; font-weight: bold;">Verify Email</a>
          <p style="margin-top: 20px; font-size: 14px; color: #666;">Or copy and paste this link in your browser:<br> <a href="${verifyLink}" style="color: #0066cc;">${verifyLink}</a></p>
        </div>
      `
    });

    // Instead of logging them in, ask them to verify
    res.json({ detail: 'Registration successful! Please check your email to verify your account.', unverified: true });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await userModel.findOne({ verificationToken: token });

    if (!user) return res.status(400).json({ detail: 'Invalid or expired verification link.' });

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.json({ success: true, detail: 'Email verified successfully. You can now log in.' });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) return res.status(404).json({ detail: 'User not found.' });
    if (user.isVerified) return res.status(400).json({ detail: 'User is already verified.' });

    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    await user.save();

    const verifyLink = `http://localhost:5173/verify-email/${verificationToken}`;
    await sendEmail({
      to: email,
      subject: 'Verify your Incident.ai Account',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Incident.ai Email Verification</h2>
          <p>You requested a new verification link. Please click the button below to verify your email address:</p>
          <a href="${verifyLink}" style="padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 15px; font-weight: bold;">Verify Email</a>
        </div>
      `
    });

    res.json({ detail: 'Verification email resent. Please check your inbox.' });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).populate('orgId');
    if (!user) return res.status(400).json({ detail: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ detail: 'Invalid credentials' });

    if (!user.isVerified) {
      return res.status(403).json({ detail: 'Please verify your email first', unverified: true });
    }

    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    res.json({ 
      user: { 
        id: user._id, 
        name: user.name, 
        email, 
        orgId: user.orgId._id, 
        org_name: user.orgId.name,
        orgName: user.orgId.name, 
        role: user.role,
        isVerified: user.isVerified
      } 
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).populate('orgId').select('-password');
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      orgId: user.orgId._id,
      organizationId: user.orgId._id,
      org_name: user.orgId.name,
      orgName: user.orgId.name,
      role: user.role,
      isVerified: user.isVerified
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
};

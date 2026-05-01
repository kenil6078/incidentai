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
    if (user) return res.status(400).json({ detail: "User already exists" });

    // Create Organization
    const slug = orgName
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
    const organization = new organizationModel({ name: orgName, slug });
    await organization.save();

    // Create User with Verification Token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    user = new userModel({
      name,
      email,
      password,
      orgId: organization._id,
      role: 'admin',
      verificationToken
    });
    await user.save();

    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    // Send Verification Email
    const verifyUrl = `${config.FRONTEND_URL}/verify-email/${verificationToken}`;
    await sendEmail({
      to: email,
      subject: 'Verify your email - incident.ai',
      html: `
        <h1>Welcome to incident.ai!</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#FF6B6B;color:black;font-weight:bold;text-decoration:none;border:2px solid black;">Verify Email</a>
        <p>If the button doesn't work, copy and paste this link: ${verifyUrl}</p>
      `
    });

    res.json({ 
      message: 'Registration successful! Please check your email to verify your account.',
      user: { id: user._id, name, email, orgId: organization._id, org_name: orgName, orgName, role: user.role } 
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).populate('orgId').select('+password');
    if (!user) return res.status(400).json({ detail: 'Invalid credentials' });

    if (!user.isVerified) {
      return res.status(403).json({ 
        detail: 'Please verify your email first', 
        unverified: true 
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ detail: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email,
        orgId: user.orgId._id,
        org_name: user.orgId.name,
        orgName: user.orgId.name, 
        role: user.role 
      } 
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user.id)
      .populate("orgId")
      .select("-password");
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      orgId: user.orgId._id,
      organizationId: user.orgId._id,
      org_name: user.orgId.name,
      orgName: user.orgId.name,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await userModel.findOne({ verificationToken: token });
    
    if (!user) {
      return res.status(400).json({ detail: 'Invalid or expired verification token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ detail: 'Email verified successfully! You can now log in.' });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ detail: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ detail: 'Email is already verified' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    await user.save();

    const verifyUrl = `${config.FRONTEND_URL}/verify-email/${verificationToken}`;
    await sendEmail({
      to: email,
      subject: 'Verify your email - incident.ai',
      html: `
        <h1>Verify your email address</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#FF6B6B;color:black;font-weight:bold;text-decoration:none;border:2px solid black;">Verify Email</a>
      `
    });

    res.json({ detail: 'Verification email resent!' });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

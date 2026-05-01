import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import userModel from '../models/user.model.js';
import organizationModel from '../models/organization.model.js';
import { config } from '../config/config.js';
import { sendEmail } from '../services/email.service.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, orgName } = req.body;

    if (!name || !email || !password || !orgName) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields (name, email, password, orgName) are required" 
      });
    }

    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: "User with this email already exists" 
      });
    }

    // Create Organization
    const slug = orgName
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
    
    if (!slug) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid organization name" 
      });
    }

    const orgExists = await organizationModel.findOne({ slug });
    if (orgExists) {
      return res.status(400).json({ 
        success: false, 
        message: "Organization name is already taken" 
      });
    }

    const organization = await organizationModel.create({ name: orgName, slug });

    // Create User with Verification Token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    const user = await userModel.create({
      name,
      email,
      password,
      orgId: organization._id,
      role: 'admin',
      verificationToken
    });

    const verifyUrl = `${config.FRONTEND_URL}/verify-email/${verificationToken}`;
    
    // Premium Email Template like Perplexity
    const emailResult = await sendEmail({
      to: email,
      subject: 'Verify your email - incident.ai',
      html: `
        <div style="background-color: #FAFAFA; padding: 40px 20px; font-family: 'Inter', -apple-system, sans-serif;">
          <div style="background-color: #FFFFFF; max-width: 500px; margin: 0 auto; border-radius: 12px; border: 2px solid #000; box-shadow: 8px 8px 0px #000; overflow: hidden;">
            <div style="padding: 48px; text-align: center;">
              <div style="width: 56px; height: 56px; background-color: #FF6B6B; border: 2px solid #000; border-radius: 8px; margin: 0 auto 32px; display: flex; align-items: center; justify-content: center; box-shadow: 4px 4px 0px #000;">
                 <span style="color: #000; font-weight: 900; font-size: 24px;">i</span>
              </div>
              <h1 style="color: #000; font-size: 28px; font-weight: 900; margin: 0 0 16px; letter-spacing: -0.05em;">Verify your workspace</h1>
              <p style="color: #555; font-size: 16px; line-height: 24px; margin-bottom: 32px;">
                Welcome to <strong>incident.ai</strong>, ${name}. You've created the <strong>${orgName}</strong> workspace. Please verify your email to get started.
              </p>
              <a href="${verifyUrl}" 
                 style="display: inline-block; background-color: #FF6B6B; color: #000; padding: 16px 40px; border: 2px solid #000; font-size: 16px; font-weight: 700; text-decoration: none; box-shadow: 4px 4px 0px #000;">
                Verify Email Address
              </a>
              <div style="margin-top: 48px; padding-top: 32px; border-top: 2px solid #EEE;">
                <p style="color: #888; font-size: 12px; line-height: 20px; margin: 0;">
                  If you didn't create an account, you can safely ignore this email.
                </p>
              </div>
            </div>
          </div>
        </div>
      `
    });

    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.error);
    }

    res.status(201).json({ 
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
      user: { 
        id: user._id, 
        name, 
        email, 
        orgId: organization._id, 
        orgName, 
        org_name: orgName, 
        role: user.role 
      } 
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error during registration",
      detail: err.message 
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    const user = await userModel.findOne({ email }).populate('orgId').select('+password');
    
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid credentials',
        err: "user not found" 
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({ 
        success: false,
        message: 'Please verify your email first', 
        unverified: true,
        err: "email not verified"
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid credentials',
        err: "incorrect password"
      });
    }

    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        orgId: user.orgId?._id,
        orgName: user.orgId?.name, 
        org_name: user.orgId?.name, 
        role: user.role 
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error during login",
      detail: err.message 
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user.id)
      .populate("orgId");

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        orgId: user.orgId?._id,
        orgName: user.orgId?.name,
        org_name: user.orgId?.name,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch user profile",
      detail: err.message 
    });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ 
    success: true, 
    message: "Logged out successfully" 
  });
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await userModel.findOne({ verificationToken: token });
    
    if (!user) {
      return res.status(400).send(`
        <html>
          <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #FAFAFA;">
            <div style="text-align: center; padding: 40px; border: 2px solid #000; box-shadow: 8px 8px 0px #000; background: #FFF;">
              <h1 style="color: #FF6B6B;">Verification Failed</h1>
              <p>The link is invalid or has expired.</p>
              <a href="${config.FRONTEND_URL}/register" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background: #000; color: #FFF; text-decoration: none;">Back to Register</a>
            </div>
          </body>
        </html>
      `);
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).send(`
      <html>
        <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #FAFAFA;">
          <div style="text-align: center; padding: 40px; border: 2px solid #000; box-shadow: 8px 8px 0px #000; background: #FFF;">
            <h1 style="color: #2ECC71;">Email Verified!</h1>
            <p>Welcome to incident.ai, ${user.name}. Your account is ready.</p>
            <a href="${config.FRONTEND_URL}/login" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background: #FF6B6B; color: #000; font-weight: bold; border: 2px solid #000; text-decoration: none; box-shadow: 4px 4px 0px #000;">Login to Workspace</a>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'Email is already verified' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    await user.save();

    const verifyUrl = `${config.FRONTEND_URL}/verify-email/${verificationToken}`;
    await sendEmail({
      to: email,
      subject: 'Verify your email - incident.ai',
      html: `<h1>Verify your email</h1><p>Click <a href="${verifyUrl}">here</a> to verify.</p>`
    });

    res.status(200).json({ success: true, message: 'Verification email resent!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

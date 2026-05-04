import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import userModel from '../models/user.model.js';
import organizationModel from '../models/organization.model.js';
import { config } from '../config/config.js';
import { sendEmail } from '../services/email.service.js';
import { getRedisClient } from '../config/redis.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, role, orgName, address, orgId } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ 
        success: false, 
        message: "Name, email, password and role are required" 
      });
    }

    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: "User with this email already exists" 
      });
    }

    let organization = null;
    let devStatus = undefined;

    if (role === 'admin') {
      if (!orgName || !address) {
        return res.status(400).json({ success: false, message: "Organization name and address are required for admin" });
      }
      const slug = orgName.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
      if (!slug) return res.status(400).json({ success: false, message: "Invalid organization name" });
      
      const orgExists = await organizationModel.findOne({ slug });
      if (orgExists) return res.status(400).json({ success: false, message: "Organization name is already taken" });
      
      organization = await organizationModel.create({ name: orgName, slug, address });
    } else if (role === 'developer') {
      if (!orgId) {
        return res.status(400).json({ success: false, message: "Organization selection is required for developers" });
      }
      organization = await organizationModel.findById(orgId);
      if (!organization) return res.status(400).json({ success: false, message: "Organization not found" });
      devStatus = 'pending';
      // Here a notification would be sent to the organization admin
      console.log(`Notification: User ${email} requested to join ${organization.name} as a developer.`);
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    const user = await userModel.create({
      name,
      email,
      password,
      role,
      orgId: organization ? organization._id : undefined,
      developerStatus: devStatus,
      verificationToken,
      address: role === 'admin' ? address : undefined,
      profileCompleted: true
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
              <h1 style="color: #000; font-size: 28px; font-weight: 900; margin: 0 0 16px; letter-spacing: -0.05em;">Verify your email</h1>
              <p style="color: #555; font-size: 16px; line-height: 24px; margin-bottom: 32px;">
                Welcome to <strong>incident.ai</strong>, ${name}. Please verify your email to get started.
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
      return res.status(201).json({ 
        success: true, 
        message: 'Registration successful, but we could not send the verification email. Please contact support or try logging in with Google.',
        warning: 'Email service error',
        user: { 
          id: user._id, 
          name, 
          email, 
          role: user.role,
          profileCompleted: user.profileCompleted
        } 
      });
    }

    res.status(201).json({ 
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
      user: { 
        id: user._id, 
        name, 
        email, 
        orgId: organization?._id, 
        orgName: organization?.name, 
        org_name: organization?.name, 
        role: user.role,
        isVerified: user.isVerified || false,
        profileCompleted: user.profileCompleted,
        hasPassword: !!user.password
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

export const googleCallback = async (req, res) => {
    const passportUser = req.user;
    if (!passportUser) {
        return res.redirect(`${config.FRONTEND_URL}/login?error=auth_failed`);
    }

    const { id, displayName, emails, photos } = passportUser;
    const email = emails[0].value;
    const profilePic = photos ? photos[0].value : undefined;

    try {
        let user = await userModel.findOne({ email }).populate('orgId');

        if (!user) {
            user = await userModel.create({
                email,
                googleId: id,
                name: displayName,
                avatar: profilePic,
                isVerified: true, 
                role: 'admin', 
                profileCompleted: false 
            });
        } else if (!user.isVerified) {
             user.isVerified = true;
             user.googleId = id;
             await user.save();
        }

        const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: config.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const redirectUrl = user.profileCompleted ? `${config.FRONTEND_URL}/` : `${config.FRONTEND_URL}/complete-profile`;
        res.redirect(redirectUrl);
    } catch (error) {
        console.error(error);
        res.redirect(`${config.FRONTEND_URL}/login?error=server_error`);
    }
};

export const finalizeProfile = async (req, res) => {
    try {
        const { role, orgName, address, orgId, password } = req.body;
        const user = await userModel.findById(req.user.id).select('+password');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.profileCompleted) {
            return res.status(400).json({ success: false, message: "Profile is already complete" });
        }

        let organization = null;
        let devStatus = undefined;

        if (role === 'admin') {
            if (!orgName || !address) {
                return res.status(400).json({ success: false, message: "Organization name and address are required" });
            }
            const slug = orgName.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
            const orgExists = await organizationModel.findOne({ slug });
            if (orgExists) return res.status(400).json({ success: false, message: "Organization name is already taken" });
            
            organization = await organizationModel.create({ name: orgName, slug, address });
        } else if (role === 'developer') {
            if (!orgId) return res.status(400).json({ success: false, message: "Organization selection is required" });
            organization = await organizationModel.findById(orgId);
            if (!organization) return res.status(400).json({ success: false, message: "Organization not found" });
            devStatus = 'pending';
        }

        user.role = role;
        user.orgId = organization ? organization._id : undefined;
        user.developerStatus = devStatus;
        if (role === 'admin') user.address = address;
        if (password) user.password = password; // Set password if provided
        user.profileCompleted = true;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile completed successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                orgId: user.orgId,
                orgName: organization?.name,
                org_name: organization?.name,
                profileCompleted: user.profileCompleted,
                hasPassword: !!(user.password && user.password.startsWith('$2'))
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", detail: error.message });
    }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log(`[Login Attempt] Email: ${email}`);

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    const user = await userModel.findOne({ email }).populate('orgId').select('+password');
    
    if (!user) {
      console.log(`[Login Failed] User not found: ${email}`);
      return res.status(400).json({ 
        success: false, 
        message: 'Account not found with this email',
        err: "user not found" 
      });
    }

    if (!user.isVerified) {
      console.log(`[Login Failed] Email not verified: ${email}`);
      return res.status(403).json({ 
        success: false,
        message: 'Please verify your email first', 
        unverified: true,
        err: "email not verified"
      });
    }

    // Google-only users might not have a password set
    if (!user.password) {
        console.log(`[Login Failed] No password set for Google user: ${email}`);
        return res.status(400).json({
            success: false,
            message: "This account uses Google Login. Please use the Google button.",
            err: "no password"
        });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log(`[Login Failed] Incorrect password for: ${email}`);
      return res.status(400).json({ 
        success: false, 
        message: 'Incorrect password. Please try again.',
        err: "incorrect password"
      });
    }

    console.log(`[Login Success] User: ${email}`);

    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: config.NODE_ENV === "production" ? "none" : "lax",
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
        role: user.role,
        isVerified: user.isVerified,
        profileCompleted: user.profileCompleted,
        hasPassword: !!user.password
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
      .populate("orgId")
      .select('+password');

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
        role: user.role,
        isVerified: user.isVerified,
        profileCompleted: user.profileCompleted,
        hasPassword: !!(user.password && user.password.startsWith('$2'))
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

export const logout = async (req, res) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    
    if (token) {
      const redis = getRedisClient();
      // Blacklist for 7 days (matching JWT expiry)
      await redis.set(`blacklist:${token}`, 'true', 'EX', 7 * 24 * 60 * 60);
    }

    res.clearCookie("token", {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: config.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
    });

    res.status(200).json({ 
      success: true, 
      message: "Logged out successfully" 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Logout failed" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await userModel.findOne({ verificationToken: token });
    
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        detail: "Invalid or expired verification link." 
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return res.status(200).json({ 
      success: true, 
      detail: "Email verified successfully!",
      message: `Welcome to incident.ai, ${user.name}. Your account is ready.`
    });
  } catch (err) {
    return res.status(500).json({ success: false, detail: err.message });
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

export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const user = await userModel.findById(req.user.id).populate('orgId').select('+password');
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (name) user.name = name;
    await user.save();

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        orgId: user.orgId?._id,
        orgName: user.orgId?.name,
        org_name: user.orgId?.name,
        isVerified: user.isVerified,
        profileCompleted: user.profileCompleted,
        hasPassword: !!(user.password && user.password.startsWith('$2'))
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update profile", detail: err.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await userModel.findById(req.user.id).select('+password');
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Hashed passwords (bcrypt) typically start with $2a$ or $2b$
    const hasExistingPassword = !!(user.password && user.password.startsWith('$2'));
    
    console.log(`[UpdatePassword] Debug: Email=${user.email}, GoogleId=${user.googleId ? 'Present' : 'Absent'}, PwdStart=${user.password ? user.password.substring(0, 4) : 'null'}, hasExistingPassword=${hasExistingPassword}`);

    // If user has a password (manual user), verify current one
    if (hasExistingPassword) {
      // If no current password provided
      if (!currentPassword) {
        // If it's a Google user, check if they are just setting their first password (empty hash check)
        if (user.googleId) {
          const isEmptyHash = await user.comparePassword("");
          if (isEmptyHash) {
            console.log(`[UpdatePassword] Google user with default empty hash detected. Allowing first password set.`);
          } else {
            console.log(`[UpdatePassword] Google user has a real password set. Current password required.`);
            return res.status(400).json({ success: false, message: "Current password is required to change your existing password" });
          }
        } else {
          return res.status(400).json({ success: false, message: "Current password is required" });
        }
      } else {
        // Current password provided, verify it
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
          console.log(`[UpdatePassword] Incorrect current password for user ${user.email}`);
          return res.status(400).json({ success: false, message: "Incorrect current password" });
        }
      }
    }

    // Set or update the password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: "Password updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        orgId: user.orgId?._id,
        orgName: user.orgId?.name,
        org_name: user.orgId?.name,
        isVerified: user.isVerified,
        profileCompleted: user.profileCompleted,
        hasPassword: true
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update password", detail: err.message });
  }
};

export const getOrganizations = async (req, res) => {
    try {
        const orgs = await organizationModel.find({}, '_id name');
        res.status(200).json({ success: true, organizations: orgs });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to fetch organizations" });
    }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Account not found with this email' });
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.resetOTP = otp;
    user.resetOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    await sendEmail({
      to: email,
      subject: 'Your Password Reset OTP - incident.ai',
      html: `
        <div style="background-color: #FAFAFA; padding: 40px 20px; font-family: 'Inter', sans-serif;">
          <div style="background-color: #FFFFFF; max-width: 500px; margin: 0 auto; border-radius: 12px; border: 2px solid #000; box-shadow: 8px 8px 0px #000; padding: 48px; text-align: center;">
            <h1 style="font-size: 24px; font-weight: 900; margin-bottom: 16px;">Password Reset</h1>
            <p style="color: #666; margin-bottom: 32px;">Use the code below to reset your password. This code expires in 10 minutes.</p>
            <div style="font-size: 48px; font-weight: 900; letter-spacing: 12px; background: #F4F4F4; padding: 20px; border: 2px dashed #000; display: inline-block;">
              ${otp}
            </div>
          </div>
        </div>
      `
    });

    res.status(200).json({ success: true, message: 'OTP sent to your email' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to send OTP', detail: err.message });
  }
};

export const resetPasswordWithOTP = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await userModel.findOne({ 
      email,
      resetOTP: otp,
      resetOTPExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    user.password = newPassword;
    user.resetOTP = undefined;
    user.resetOTPExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful! You can now login.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to reset password', detail: err.message });
  }
};

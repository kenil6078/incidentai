import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';
import { config } from '../config/config.js';

export const auth = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ detail: 'No token provided' });

    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await userModel.findById(decoded.id).populate('orgId');

    
    if (!user) return res.status(401).json({ detail: 'User not found' });
    if (!user.active) return res.status(401).json({ detail: 'User account is disabled' });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ detail: 'Invalid or expired token' });
  }
};

export const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'super_admin')) {
    next();
  } else {
    res.status(403).json({ detail: 'Access denied: Admin role required' });
  }
};

export const superAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'super_admin') {
    next();
  } else {
    res.status(403).json({ detail: 'Access denied: Super Admin role required' });
  }
};


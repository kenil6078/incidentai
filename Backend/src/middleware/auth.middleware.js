import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { config } from '../config/config.js';

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ detail: 'No token provided' });

    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await User.findById(decoded.id).populate('orgId');
    
    if (!user) return res.status(401).json({ detail: 'User not found' });
    if (!user.active) return res.status(401).json({ detail: 'User account is disabled' });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ detail: 'Invalid or expired token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ detail: 'Access denied: Admin role required' });
  }
};

export default { auth, admin };

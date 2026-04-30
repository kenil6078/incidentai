const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Organization = require('../models/Organization');

exports.register = async (req, res) => {
  try {
    const { name, email, password, orgName } = req.body;
    
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ detail: 'User already exists' });

    // Create Organization
    const slug = orgName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const organization = new Organization({ name: orgName, slug });
    await organization.save();

    // Create User
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      name,
      email,
      password: hashedPassword,
      orgId: organization._id,
      role: 'admin'
    });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      token, 
      user: { id: user._id, name, email, orgId: organization._id, org_name: orgName, orgName, role: user.role } 
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate('orgId');
    if (!user) return res.status(400).json({ detail: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ detail: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      token, 
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

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('orgId').select('-password');
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

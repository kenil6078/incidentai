import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const getTeam = async (req, res) => {
  try {
    const team = await User.find({ orgId: req.user.orgId._id }).select('-password');
    res.json(team);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const inviteMember = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ detail: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      name,
      email,
      password: hashedPassword,
      orgId: req.user.orgId._id,
      role
    });
    await user.save();

    res.json({ email: user.email, temp_password: password });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findOneAndUpdate(
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
    const user = await User.findOneAndDelete({ _id: req.params.id, orgId: req.user.orgId._id });
    if (!user) return res.status(404).json({ detail: 'Member not found' });
    res.json({ detail: 'Member removed' });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

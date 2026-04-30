const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ 
      userId: req.user._id,
      orgId: req.user.orgId._id
    })
    .sort({ createdAt: -1 })
    .limit(50);
    
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

exports.readAll = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, read: false },
      { $set: { read: true } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

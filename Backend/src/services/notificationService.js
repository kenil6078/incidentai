const nodemailer = require('nodemailer');
const Notification = require('../models/Notification');

// Mock transporter - in a real app, use real SMTP credentials
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
  port: process.env.EMAIL_PORT || 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: '"Incedent AI" <alerts@incedent.ai>',
      to,
      subject,
      text,
    });
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error('Email sending failed', err);
  }
};

const createNotification = async (userId, orgId, message, type, io) => {
  try {
    const notification = new Notification({
      userId,
      orgId,
      message,
      type
    });
    await notification.save();

    // Emit real-time notification if socket io is provided
    if (io) {
      io.to(userId.toString()).emit('notification', notification);
    }

    return notification;
  } catch (err) {
    console.error('Failed to create notification', err);
  }
};

const notifyTeam = async (users, orgId, message, type, io) => {
  for (const user of users) {
    await createNotification(user._id, orgId, message, type, io);
    if (user.email) {
      await sendEmail(user.email, `Incident Alert: ${message}`, message);
    }
  }
};

module.exports = {
  sendEmail,
  createNotification,
  notifyTeam
};

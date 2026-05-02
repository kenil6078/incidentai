import notificationModel from "../models/notification.model.js";
import { sendEmail } from "./email.service.js";

export const createNotification = async (
  userId,
  orgId,
  message,
  type,
  io,
  incidentId = null,
) => {
  try {
    const notification = new notificationModel({
      userId,
      orgId,
      incidentId,
      message,
      type,
    });

    await notification.save();

    // Emit real-time notification if socket io is provided
    if (io) {
      io.to(userId.toString()).emit("notification", notification);
    }

    return notification;
  } catch (err) {
    console.error("Failed to create notification", err);
  }
};

export const notifyTeam = async (
  users,
  orgId,
  message,
  type,
  io,
  incidentId = null,
) => {
  for (const user of users) {
    await createNotification(user._id, orgId, message, type, io, incidentId);
    if (user.email) {
      await sendEmail({
        to: user.email,
        subject: `Incident Alert: ${message}`,
        html: `<p>${message}</p>`,
      });
    }
  }
};

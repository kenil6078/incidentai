import incidentModel from "../models/incident.model.js";
import timelineModel from "../models/timeline.model.js";
import userModel from "../models/user.model.js";
import organizationModel from "../models/organization.model.js";
import { notifyTeam } from "../services/notification.service.js";

export const getIncidents = async (req, res) => {
  try {
    const { status, severity } = req.query;
    const query = { orgId: req.user.orgId._id };

    if (status) query.status = status.toLowerCase();
    if (severity) query.severity = severity.toLowerCase();

    const incidents = await incidentModel
      .find(query)
      .populate("creator", "name avatar")
      .populate("assignedTo", "name avatar")
      .sort({ createdAt: -1 });
    res.json(incidents);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const createIncident = async (req, res) => {
  try {
    const { title, description, severity, assignedTo, affectedServices } =
      req.body;

    // Check plan limits
    const org = await organizationModel.findById(req.user.orgId._id);
    const incidentCount = await incidentModel.countDocuments({
      orgId: req.user.orgId._id,
    });

    const LIMITS = {
      free: 5,
      pro: Infinity,
      enterprise: Infinity,
    };

    const currentLimit = LIMITS[org.plan] || 5;

    if (incidentCount >= currentLimit) {
      return res.status(403).json({
        detail: `Incident limit reached. Your ${org.plan} plan allows up to ${currentLimit} incidents. Please upgrade your plan in the Billing section.`,
      });
    }

    const incident = new incidentModel({
      title,
      description,
      severity,
      assignedTo,
      affectedServices,
      creator: req.user._id,
      orgId: req.user.orgId._id,
    });
    await incident.save();

    // Initial Timeline entry
    const timeline = new timelineModel({
      incidentId: incident._id,
      message: "Incident created",
      type: "system",
      createdBy: req.user._id,
    });
    await timeline.save();

    // Notify team
    const team = await userModel.find({ orgId: req.user.orgId._id });
    notifyTeam(
      team,
      req.user.orgId._id,
      `New Incident: ${title}`,
      "incident_created",
      req.app.get("io"),
      incident._id,
    );

    // Emit socket event
    req.app
      .get("io")
      .to(req.user.orgId._id.toString())
      .emit("incident.created", incident);

    res.json(incident);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const getIncidentById = async (req, res) => {
  try {
    const incident = await incidentModel
      .findOne({ _id: req.params.id, orgId: req.user.orgId._id })
      .populate("creator", "name avatar")
      .populate("assignedTo", "name avatar");
    if (!incident)
      return res.status(404).json({ detail: "Incident not found" });
    res.json(incident);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const updateIncident = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      severity,
      assignedTo,
      affectedServices,
    } = req.body;
    const incident = await incidentModel.findOne({
      _id: req.params.id,
      orgId: req.user.orgId._id,
    });

    if (!incident)
      return res.status(404).json({ detail: "Incident not found" });

    if (incident.status === "resolved" && status && status !== "resolved") {
      return res
        .status(400)
        .json({
          detail:
            "Resolved incidents cannot be reopened or moved to another status.",
        });
    }

    // Track changes for timeline
    const updates = [];
    if (status && status !== incident.status) {
      updates.push(`Status changed to ${status}`);
      if (status === "resolved") incident.resolvedAt = Date.now();
    }
    if (severity && severity !== incident.severity)
      updates.push(`Severity changed to ${severity}`);

    // Only update provided fields
    const fields = {
      title,
      description,
      status,
      severity,
      assignedTo,
      affectedServices,
    };
    Object.keys(fields).forEach((key) => {
      if (fields[key] !== undefined) incident[key] = fields[key];
    });

    incident.updatedAt = Date.now();
    await incident.save();

    // Re-populate for frontend
    await incident.populate("creator", "name avatar");
    await incident.populate("assignedTo", "name avatar");

    for (const msg of updates) {
      await new timelineModel({
        incidentId: incident._id,
        message: msg,
        type: "update",
        createdBy: req.user._id,
      }).save();
    }

    // Emit socket event
    req.app
      .get("io")
      .to(req.user.orgId._id.toString())
      .emit("incident.updated", incident);

    // Notify team if status or severity changed
    if (updates.length > 0) {
      const team = await userModel.find({ orgId: req.user.orgId._id });
      const msg = updates.join(", ");
      notifyTeam(
        team,
        req.user.orgId._id,
        `[${incident.title}] ${msg}`,
        "incident_updated",
        req.app.get("io"),
        incident._id,
      );
    }

    res.json(incident);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const deleteIncident = async (req, res) => {
  try {
    const incident = await incidentModel.findOneAndDelete({
      _id: req.params.id,
      orgId: req.user.orgId._id,
    });
    if (!incident)
      return res.status(404).json({ detail: "Incident not found" });

    await timelineModel.deleteMany({ incidentId: req.params.id });

    req.app
      .get("io")
      .to(req.user.orgId._id.toString())
      .emit("incident.deleted", { incident_id: req.params.id });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["investigating", "identified", "monitoring", "resolved"],
    default: "investigating",
  },
  severity: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    default: "medium",
  },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  affectedServices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },

}, { timestamps: true });

const incidentModel = mongoose.model("Incident", incidentSchema);
export default incidentModel;

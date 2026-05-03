import serviceModel from '../models/service.model.js';

export const getServices = async (req, res) => {
  try {
    const services = await serviceModel.find({ orgId: req.user.orgId._id });
    res.json(services);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const createService = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const service = new serviceModel({
      name,
      description,
      status,
      orgId: req.user.orgId._id
    });
    await service.save();

    // Emit socket event
    req.app.get('io').to(req.user.orgId._id.toString()).emit('service.created', service);

    res.json(service);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const service = await serviceModel.findOneAndUpdate(
      { _id: req.params.id, orgId: req.user.orgId._id },
      { name, description, status, updatedAt: Date.now() },
      { new: true }
    );

    if (!service) return res.status(404).json({ detail: "Service not found" });

    // Emit socket event
    req.app.get('io').to(req.user.orgId._id.toString()).emit('service.updated', service);

    res.json(service);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await serviceModel.findOneAndDelete({
      _id: req.params.id,
      orgId: req.user.orgId._id
    });

    if (!service) return res.status(404).json({ detail: "Service not found" });

    // Emit socket event
    req.app.get('io').to(req.user.orgId._id.toString()).emit('service.deleted', { service_id: req.params.id });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

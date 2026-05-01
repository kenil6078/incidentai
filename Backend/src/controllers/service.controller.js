import Service from '../models/service.model.js';

export const getServices = async (req, res) => {
  try {
    const services = await Service.find({ orgId: req.user.orgId._id });
    res.json(services);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

export const createService = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const service = new Service({
      name,
      description,
      status,
      orgId: req.user.orgId._id
    });
    await service.save();
    res.json(service);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
};

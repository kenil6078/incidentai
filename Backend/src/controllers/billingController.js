const Razorpay = require("razorpay");
const crypto = require("crypto");
const Organization = require("../models/Organization");
const Incident = require("../models/Incident");

const getBillingInfo = async (req, res) => {
  try {
    const org = await Organization.findById(req.user.orgId);
    const incidentCount = await Incident.countDocuments({ orgId: req.user.orgId });

    const LIMITS = {
      free: 5,
      pro: 250,
      enterprise: Infinity
    };

    res.json({
      plan: org.plan,
      incidentCount,
      limit: LIMITS[org.plan] || 5
    });
  } catch (error) {
    res.status(500).json({ detail: "Failed to fetch billing info" });
  }
};

const createOrder = async (req, res) => {
  try {
    const { planId, amount } = req.body;

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100, // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    if (!order) return res.status(500).send("Some error occured");

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: "Razorpay order creation failed" });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");

    if (digest !== razorpay_signature) {
      return res.status(400).json({ detail: "Transaction not legitimate!" });
    }

    // Payment is verified, update workspace plan
    const Organization = require("../models/Organization");
    await Organization.findByIdAndUpdate(req.user.orgId, { plan: "pro" });

    res.json({
      msg: "success",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: "Payment verification failed" });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getBillingInfo,
};

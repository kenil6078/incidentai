import Razorpay from 'razorpay';
import crypto from 'crypto';
import organizationModel from '../models/organization.model.js';
import incidentModel from '../models/incident.model.js';
import transactionModel from '../models/transaction.model.js';
import { config } from '../config/config.js';

export const getBillingInfo = async (req, res) => {
  try {
    const org = await organizationModel.findById(req.user.orgId._id || req.user.orgId);
    const incidentCount = await incidentModel.countDocuments({ orgId: req.user.orgId._id || req.user.orgId });

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
    console.error('Billing Info Error:', error);
    res.status(500).json({ detail: "Failed to fetch billing info" });
  }
};

export const createOrder = async (req, res) => {
  try {
    let { planId } = req.body;
    
    // Handle nested payload if it accidentally happens
    if (typeof planId === 'object' && planId.planId) {
      planId = planId.planId;
    }
    
    // As per user request: Pro plan is 4499 INR
    const amounts = {
      pro: 4499,
      enterprise: 9999 // Example
    };

    const amount = amounts[planId];
    if (!amount) return res.status(400).json({ detail: "Invalid plan selected" });

    const instance = new Razorpay({
      key_id: config.RAZORPAY_KEY_ID,
      key_secret: config.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    if (!order) return res.status(500).json({ detail: "Order creation failed" });

    // Store transaction as 'created'
    await transactionModel.create({
      orgId: req.user.orgId._id || req.user.orgId,
      userId: req.user._id,
      razorpayOrderId: order.id,
      amount: amount,
      planId: planId,
      status: 'created'
    });

    res.json({
      ...order,
      key: config.RAZORPAY_KEY_ID // Send key to frontend for convenience
    });
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ detail: "Razorpay order creation failed" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const shasum = crypto.createHmac("sha256", config.RAZORPAY_KEY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");

    if (digest !== razorpay_signature) {
      // Update transaction status to failed
      await transactionModel.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: 'failed' }
      );
      return res.status(400).json({ detail: "Transaction signature mismatch!" });
    }

    // Update transaction to 'captured'
    const transaction = await transactionModel.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { 
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'captured' 
      },
      { new: true }
    );

    if (!transaction) return res.status(404).json({ detail: "Transaction not found" });

    // Update organization's plan
    await organizationModel.findByIdAndUpdate(req.user.orgId._id || req.user.orgId, { 
      plan: transaction.planId 
    });

    res.json({
      msg: "success",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      plan: transaction.planId
    });
  } catch (error) {
    console.error('Verify Payment Error:', error);
    res.status(500).json({ detail: "Payment verification failed" });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await transactionModel.find({ orgId: req.user.orgId._id || req.user.orgId })
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ detail: "Failed to fetch transactions" });
  }
};


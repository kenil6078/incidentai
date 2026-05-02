import express from 'express';
const router = express.Router();
import * as billingController from '../controllers/billing.controller.js';
import { auth  } from '../middleware/auth.middleware.js';

router.get("/info", auth, billingController.getBillingInfo);
router.get("/transactions", auth, billingController.getTransactions);
router.post("/create-order", auth, billingController.createOrder);
router.post("/verify-payment", auth, billingController.verifyPayment);

export default router;

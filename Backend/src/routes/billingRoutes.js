const express = require("express");
const router = express.Router();
const billingController = require("../controllers/billingController");
const { auth } = require("../middleware/authMiddleware");

router.get("/info", auth, billingController.getBillingInfo);
router.post("/create-order", auth, billingController.createOrder);
router.post("/verify-payment", auth, billingController.verifyPayment);

module.exports = router;

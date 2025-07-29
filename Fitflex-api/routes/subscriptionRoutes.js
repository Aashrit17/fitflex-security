const express = require("express");
const router = express.Router();
const {
  createSubscription,
  getSubscription,
} = require("../controllers/subscriptionController");

// POST: Create new subscription
router.post("/", createSubscription);

// GET: Get user subscription
router.get("/:userId", getSubscription);

module.exports = router;

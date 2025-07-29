const asyncHandler = require("../middleware/async");
const Subscription = require("../models/subscription");

// @desc    Create subscription after payment
// @route   POST /api/v1/subscription
// @access  Private
exports.createSubscription = asyncHandler(async (req, res) => {
  const { userId, paymentReference } = req.body;

  if (!userId || !paymentReference) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Check if already subscribed
  const existing = await Subscription.findOne({ userId });
  if (existing && existing.status === "active") {
    return res.status(400).json({ message: "User already has active subscription" });
  }

  const oneMonthLater = new Date();
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

  const subscription = await Subscription.create({
    userId,
    paymentReference,
    endDate: oneMonthLater,
  });

  res.status(201).json({ success: true, data: subscription });
});

// @desc    Get user subscription
// @route   GET /api/v1/subscription/:userId
// @access  Private
exports.getSubscription = asyncHandler(async (req, res) => {
  const subscription = await Subscription.findOne({ userId: req.params.userId });

  if (!subscription) {
    return res.status(404).json({ message: "Subscription not found" });
  }

  res.status(200).json({ success: true, data: subscription });
});

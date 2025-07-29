const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  plan: {
    type: String,
    enum: ["pro"],
    default: "pro",
  },
  status: {
    type: String,
    enum: ["active", "cancelled", "expired"],
    default: "active",
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true,
  },
  paymentReference: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Subscription", subscriptionSchema);

const mongoose = require("mongoose");

const dashboardSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  widgets: { type: Array, default: [] },
  last_login: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Dashboard", dashboardSchema);

const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  progress_data: { type: Object, default: {} }, // Can be JSON structure
  last_updated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Progress", progressSchema);

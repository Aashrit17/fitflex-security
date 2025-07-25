const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  theme: { type: String, default: "light" },
  notifications: { type: Boolean, default: true },
  privacy_settings: { type: Object, default: {} },
});

module.exports = mongoose.model("Settings", settingsSchema);

const asyncHandler = require("../middleware/async");
const Settings = require("../models/settings");

// @desc    Get user settings
// @route   GET /api/v1/settings/:userId
// @access  Private
exports.getSettings = asyncHandler(async (req, res, next) => {
  const settings = await Settings.findOne({ user_id: req.params.userId });

  if (!settings) {
    return res.status(404).json({ message: "Settings not found" });
  }

  res.status(200).json({
    success: true,
    data: settings,
  });
});

// @desc    Update user settings
// @route   PUT /api/v1/settings/:userId
// @access  Private
exports.updateSettings = asyncHandler(async (req, res, next) => {
  const settings = await Settings.findOneAndUpdate(
    { user_id: req.params.userId },
    { 
      theme: req.body.theme,
      notifications: req.body.notifications,
      privacy_settings: req.body.privacy_settings
    },
    { new: true, runValidators: true }
  );

  if (!settings) {
    return res.status(404).json({ message: "Settings not found" });
  }

  res.status(200).json({
    success: true,
    data: settings,
  });
});

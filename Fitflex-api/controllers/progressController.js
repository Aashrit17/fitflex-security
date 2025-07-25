const asyncHandler = require("../middleware/async");
const Progress = require("../models/progress");

// @desc    Get user progress
// @route   GET /api/v1/progress/:userId
// @access  Private
exports.getProgress = asyncHandler(async (req, res, next) => {
  const progress = await Progress.findOne({ user_id: req.params.userId });

  if (!progress) {
    return res.status(404).json({ message: "Progress not found" });
  }

  res.status(200).json({
    success: true,
    data: progress,
  });
});

// @desc    Update user progress
// @route   PUT /api/v1/progress/:userId
// @access  Private
exports.updateProgress = asyncHandler(async (req, res, next) => {
  const progress = await Progress.findOneAndUpdate(
    { user_id: req.params.userId },
    { progress_data: req.body.progress_data, last_updated: Date.now() },
    { new: true, runValidators: true }
  );

  if (!progress) {
    return res.status(404).json({ message: "Progress not found" });
  }

  res.status(200).json({
    success: true,
    data: progress,
  });
});

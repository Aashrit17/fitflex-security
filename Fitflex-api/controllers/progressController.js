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

// @desc    Add or Update exercise progress for a user
// @route   POST /api/v1/progress/:userId
// @access  Private
exports.logOrUpdateExercise = asyncHandler(async (req, res, next) => {
  const { exerciseName, exerciseMinutes, caloriesBurned } = req.body;
  const userId = req.params.userId;

  if (!exerciseName || !exerciseMinutes || !caloriesBurned || !userId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let progress = await Progress.findOne({ user_id: userId });

  if (!progress) {
    progress = await Progress.create({
      user_id: userId,
      progress_data: [
        {
          exerciseName,
          exerciseMinutes,
          caloriesBurned,
          timestamp: new Date(),
        },
      ],
      last_updated: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Exercise logged (new progress created)",
      data: progress,
    });
  } else {
    progress.progress_data.push({
      exerciseName,
      exerciseMinutes,
      caloriesBurned,
      timestamp: new Date(),
    });

    progress.last_updated = new Date();
    await progress.save();

    return res.status(200).json({
      success: true,
      message: "Exercise logged (existing progress updated)",
      data: progress,
    });
  }
});

// @desc    Get user's exercise items
// @route   GET /api/v1/progress/:userId/exercises
exports.getUserExercises = asyncHandler(async (req, res) => {
  const progress = await Progress.findOne({ user_id: req.params.userId });

  if (!progress) {
    return res.status(200).json({ success: true, data: [] }); // Return empty array instead of 404
  }

  res.status(200).json({
    success: true,
    data: progress.exercise_items || [],
  });
});

// @desc    Add new exercise item
// @route   POST /api/v1/progress/:userId/exercises
exports.addUserExercise = asyncHandler(async (req, res) => {
  const { name, caloriesBurnedPerMinute } = req.body;
  let progress = await Progress.findOne({ user_id: req.params.userId });

  if (!progress) {
    // Create new progress with exercise item
    progress = await Progress.create({
      user_id: req.params.userId,
      exercise_items: [{ name, caloriesBurnedPerMinute }],
      progress_data: [],
      last_updated: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Progress created and exercise item added",
      data: progress.exercise_items,
    });
  }

  const exists = progress.exercise_items.find(
    (item) => item.name.toLowerCase() === name.toLowerCase()
  );

  if (exists) {
    return res.status(400).json({ message: "Exercise already exists" });
  }

  progress.exercise_items.push({ name, caloriesBurnedPerMinute });
  await progress.save();

  res.status(201).json({
    success: true,
    message: "Exercise item added to existing progress",
    data: progress.exercise_items,
  });
});

// @desc    Update exercise item
// @route   PUT /api/v1/progress/:userId/exercises/:itemId
exports.updateUserExercise = asyncHandler(async (req, res) => {
  const progress = await Progress.findOne({ user_id: req.params.userId });
  if (!progress) return res.status(404).json({ message: "Progress not found" });

  const item = progress.exercise_items.id(req.params.itemId);
  if (!item) return res.status(404).json({ message: "Exercise item not found" });

  item.name = req.body.name || item.name;
  item.caloriesBurnedPerMinute = req.body.caloriesBurnedPerMinute ?? item.caloriesBurnedPerMinute;

  await progress.save();
  res.status(200).json({ success: true, data: item });
});

// @desc    Delete exercise item
// @route   DELETE /api/v1/progress/:userId/exercises/:itemId
exports.deleteUserExercise = asyncHandler(async (req, res) => {
  const progress = await Progress.findOne({ user_id: req.params.userId });
  if (!progress) return res.status(404).json({ message: "Progress not found" });

  const item = progress.exercise_items.id(req.params.itemId);
  if (!item) return res.status(404).json({ message: "Exercise item not found" });

  item.remove();
  await progress.save();

  res.status(200).json({ success: true, message: "Exercise deleted" });
});
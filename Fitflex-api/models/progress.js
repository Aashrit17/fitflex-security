const mongoose = require("mongoose");

// Sub-schema for individual logged exercise
const ExerciseLogSchema = new mongoose.Schema({
  exerciseName: {
    type: String,
    required: true,
  },
  exerciseMinutes: {
    type: Number,
    required: true,
  },
  caloriesBurned: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Sub-schema for reusable exercise definitions (for dropdown)
const ExerciseItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  caloriesBurnedPerMinute: {
    type: Number,
    required: true,
  },
});

const ProgressSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  progress_data: [ExerciseLogSchema], // Logs for user's activities
  exercise_items: [ExerciseItemSchema], // Reusable exercise types
  last_updated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Progress", ProgressSchema);

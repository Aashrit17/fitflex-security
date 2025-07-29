const express = require("express");
const router = express.Router();
const {
  getProgress,
  logOrUpdateExercise,
  getUserExercises,
  addUserExercise,
  updateUserExercise,
  deleteUserExercise,
} = require("../controllers/progressController");

// 📊 Log-based progress
router.get("/:userId", getProgress);
router.post("/:userId", logOrUpdateExercise);

// ⚙️ Exercise items (stored inside Progress)
router.get("/:userId/exercises", getUserExercises);
router.post("/:userId/exercises", addUserExercise);
router.put("/:userId/exercises/:itemId", updateUserExercise);
router.delete("/:userId/exercises/:itemId", deleteUserExercise);

module.exports = router;

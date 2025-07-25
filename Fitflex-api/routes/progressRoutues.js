const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

const { getProgress, updateProgress } = require("../controllers/progressController");

router.get("/:userId", protect, getProgress);
router.put("/:userId", protect, updateProgress);

module.exports = router;

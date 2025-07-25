const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

const { getDashboard, updateDashboard } = require("./controllers/dashboardController");

router.get("/:userId", protect, getDashboard);
router.put("/:userId", protect, updateDashboard);

module.exports = router;

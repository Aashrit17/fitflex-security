// const express = require("express");
// const router = express.Router();
// const { protect } = require("../middleware/auth");

// const { getSettings, updateSettings } = require("../controllers/settingsController");

// router.get("/:userId", protect, getSettings);
// router.put("/:userId", protect, updateSettings);

// module.exports = router;

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const SettingsValidation = require("../middleware/settingsValidation");

const { getSettings, updateSettings } = require("../controllers/settingsController");

router.get("/:userId", protect, getSettings);
router.put("/:userId", protect, SettingsValidation, updateSettings); // ✅ Add validation

module.exports = router;

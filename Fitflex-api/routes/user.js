// const express = require("express");
// const router = express.Router();
// const { protect } = require("../middleware/auth");

// const upload = require("../middleware/uploads");

// const {
//   register,
//   login,
//   uploadImage,
// } = require("../controllers/user");

// router.post("/uploadImage", upload, uploadImage);
// router.post("/register", register);
// router.post("/login", login);


// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const {
//   register,
//   login,
//   verifyOTP,
//   uploadImage,
// } = require("../controllers/user");

// const upload = require("../middleware/uploads");
// const UserValidation = require("../validation/userValidation");

// router.post("/register", UserValidation, register);
// router.post("/login", login);
// router.post("/verify-otp", verifyOTP);
// router.post("/uploadImage", upload.single("profilePicture"), uploadImage);

// module.exports = router;

const express = require("express");
const router = express.Router();
const {
  register,
  login,
  verifyOTP,
  uploadImage,
  updateUserProfile,
  forgotPassword,
  verifyResetToken,
  resetPassword,
} = require("../controllers/user");

const upload = require("../middleware/uploads"); // multer setup
const UserValidation = require("../validation/userValidation");

// ✅ Registration route with validation and file upload
router.post("/register", upload.single("image"), UserValidation, register);

// ✅ OTP and Login routes
router.post("/login", login);
router.post("/verify-otp", verifyOTP);

// ✅ Standalone image upload route (optional)
router.post("/uploadImage", upload.single("image"), uploadImage);

// ✅ NEW: Update user profile (email passed as route param)
router.put("/updateUser/:email", upload.single("image"), updateUserProfile);

router.post("/forgot-password", forgotPassword);
router.get("/reset-password/:token", verifyResetToken);
router.post("/reset-password/:token", resetPassword);

module.exports = router;



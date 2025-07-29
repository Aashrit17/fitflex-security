const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// ✅ Register with OTP & Profile Picture
const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;
  const image = req.file?.filename || null;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // ✅ Password strength check (INSIDE the handler)
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
  if (!strongPasswordRegex.test(password)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
    });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "User already exists" });

  const newUser = await User.create({ name, email, phone, password, image });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  newUser.otp = otp;
  newUser.otpExpire = Date.now() + 10 * 60 * 1000;
  await newUser.save();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"FITFLEX" <${process.env.EMAIL_USER}>`,
    to: newUser.email,
    subject: "Your OTP Code",
    text: `Your OTP is: ${otp}`,
  });

  res.status(201).json({ success: true, message: "User registered. OTP sent to email." });
});

// ✅ OTP Verification (FIXED COMPARISON)
const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const storedOtp = String(user.otp);
  const receivedOtp = String(otp);

  if (storedOtp !== receivedOtp || user.otpExpire < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// ✅ Login with Fallback OTP
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  if (user.lockUntil && user.lockUntil > Date.now()) {
    return res.status(403).json({ message: "Account locked. Try again later." });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    user.loginAttempts += 1;
    if (user.loginAttempts >= 5) {
      user.lockUntil = Date.now() + 15 * 60 * 1000;
    }
    await user.save();
    return res.status(401).json({ message: "Invalid credentials" });
  }

  user.loginAttempts = 0;
  user.lockUntil = null;

  if (!user.isVerified) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"FITFLEX" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Verify Your Login",
      text: `Your OTP is: ${otp}`,
    });

    return res.status(401).json({ message: "OTP sent to your email" });
  }

  await user.save();
  sendTokenResponse(user, 200, res);
});

// ✅ Upload Image (Standalone)
const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Please upload a file" });

  res.status(200).json({
    success: true,
    data: req.file.filename,
  });
});

// ✅ Update User Profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  const email = req.params.email;
  const image = req.file?.filename || null;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (image) user.image = image;

  await user.save();

 res.status(200).json({
  success: true,
  message: "Profile updated successfully",
  user: {
    ...user.toObject(),
    imageUrl: user.image ? `https://localhost:3001/uploads/${user.image}` : null,
  },
});

});

// ✅ JWT Token Sender
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") options.secure = true;

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};
// auth_controller.js
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone } = req.body;

    const user = await User.findOne({ email: id }); // or by ID if you're using ID

    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.phone = phone || user.phone;

    // ✅ THIS is what you're asking about
    if (req.file) {
      user.image = `/uploads/${req.file.filename}`; // Save relative path
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    console.error("Error updating user:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "No user with that email" });
  }

  const resetToken = user.getResetPasswordToken(); // This method should set and return the token
  await user.save({ validateBeforeSave: false });

  const resetUrl = `https://localhost:5173/reset-password/${resetToken}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"FITFLEX Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset Request",
    html: `<p>Click to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`,
  });

  res.status(200).json({
    success: true,
    message: "Password reset link sent to your email.",
  });
});

// ✅ Verify Reset Token
const verifyResetToken = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
  }

  res.status(200).json({
    success: true,
    message: "Reset token is valid. You can now reset your password.",
    data: { email: user.email },
  });
});

// ✅ Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
  }

  if (!req.body.password) {
    return res.status(400).json({ success: false, message: "Password is required" });
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({ success: true, message: "Password updated successfully" });
});



module.exports = {
  register,
  login,
  verifyOTP,
  uploadImage,
  updateUserProfile,
  forgotPassword,
  verifyResetToken,
  resetPassword,
};

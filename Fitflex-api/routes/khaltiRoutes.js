const express = require("express");
const axios = require("axios");
const router = express.Router();
const User = require("../models/User"); // ✅ import User model

// ✅ Initiate payment via Khalti and embed userId in purchase_order_id
router.post("/initiate", async (req, res) => {
  try {
    const { userId } = req.body;

    const payload = {
      return_url: `https://localhost:3001/api/khalti/success?puid=${userId}`, // ✅ your backend route (not frontend)
      website_url: "https://localhost:5173",
      amount: 20000,
      purchase_order_id: `sub-${userId}-${Date.now()}`,
      purchase_order_name: "VaultDesk Pro Subscription",
      customer_info: {
        name: "Sandbox User",
        email: "test@khalti.com",
        phone: "9800000001",
      },
    };

    const response = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/initiate/",
      payload,
      {
        headers: {
          Authorization: "Key 72043a20d5d2429fa9d4718352796e2b", // ✅ sandbox secret
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("❌ Khalti initiation error:", error.response?.data || error.message);
    res.status(500).json({
      message: "Failed to initiate Khalti payment",
      error: error.response?.data || error.message,
    });
  }
});

// ✅ New route: Automatically mark user as pro after redirect
router.get("/success", async (req, res) => {
  const { puid } = req.query;

  try {
    const user = await User.findByIdAndUpdate(puid, { pro: true }, { new: true });
    if (!user) return res.status(404).send("User not found");

    // ✅ Redirect to dashboard after marking as pro
    res.redirect("https://localhost:5173/dashboard");
  } catch (err) {
    console.error("❌ Error marking user as pro:", err);
    res.status(500).send("Error updating user status.");
  }
});

module.exports = router;

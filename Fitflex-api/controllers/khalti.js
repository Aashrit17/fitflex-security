const axios = require("axios");
const User = require("../models/User");

// Replace with your sandbox secret key
const KHALTI_SECRET_KEY = "Key test_secret_key_72043a20d5d2429fa9d4718352796e2b";

exports.initiatePayment = async (req, res) => {
  try {
    const { userId, amount, name, email, phone } = req.body;

    const payload = {
      return_url: "http://localhost:5173/payment-success", // Your frontend callback
      website_url: "http://localhost:5173",
      amount,
      purchase_order_id: `ORDER_${Date.now()}`,
      purchase_order_name: "Pro Subscription",
      customer_info: {
        name,
        email,
        phone,
      },
    };

    const response = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/initiate/",
      payload,
      {
        headers: {
          Authorization: KHALTI_SECRET_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({ payment_url: response.data.payment_url });
  } catch (error) {
    console.error("❌ Initiate Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to initiate payment", error: error.response?.data });
  }
};

exports.verifyPayment = async (req, res) => {
  const { pidx } = req.query;

  try {
    const response = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      {
        headers: {
          Authorization: KHALTI_SECRET_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const status = response.data.status;
    if (status === "Completed") {
      return res.status(200).json({ message: "Payment successful", details: response.data });
    }

    return res.status(400).json({ message: `Payment status: ${status}`, details: response.data });
  } catch (error) {
    console.error("❌ Lookup Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Payment verification failed", error: error.response?.data });
  }
};


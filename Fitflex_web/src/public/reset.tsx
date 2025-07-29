import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await axios.get(`https://localhost:3001/api/v1/auth/reset-password/${token}`);
        setTokenValid(true);
      } catch (err: any) {
        setTokenValid(false);
        setMessage(err.response?.data?.message || "Invalid or expired token.");
      }
    };

    verifyToken();
  }, [token]);

  const getPasswordStrength = (pwd: string) => {
    const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    const medium = /^((?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,})$/;

    if (strong.test(pwd)) return { label: "Strong", color: "green" };
    if (medium.test(pwd)) return { label: "Medium", color: "yellow" };
    if (pwd.length > 0) return { label: "Weak", color: "red" };
    return null;
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirm) {
      setMessage("Please fill out both fields.");
      setMessageType("error");
      return;
    }

    if (password !== confirm) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `https://localhost:3001/api/v1/auth/reset-password/${token}`,
        { password }
      );
      setMessage(res.data.message);
      setMessageType("success");
      setTimeout(() => navigate("/"), 2000);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Something went wrong.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  if (tokenValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-red-400">
        <div className="bg-gray-900 p-6 rounded-lg text-center shadow-md">
          <p>{message || "Invalid or expired link"}</p>
        </div>
      </div>
    );
  }

  if (tokenValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="bg-gray-900 p-6 rounded-lg shadow-md">Verifying token...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-gray-900 p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-semibold text-white text-center mb-4">
          Reset Your Password
        </h2>

        {message && (
          <p
            className={`text-center mb-4 ${
              messageType === "success" ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}

        <div className="relative mb-2">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-800 text-white p-3 pr-10 rounded-lg outline-none"
          />
          <div
            className="absolute right-3 top-3 text-white cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>

        {strength && (
          <p className={`text-${strength.color}-400 text-sm mb-4`}>
            Password Strength: {strength.label}
          </p>
        )}

        <div className="relative mb-4">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full bg-gray-800 text-white p-3 pr-10 rounded-lg outline-none"
          />
          <div
            className="absolute right-3 top-3 text-white cursor-pointer"
            onClick={() => setShowConfirm((prev) => !prev)}
          >
            {showConfirm ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;

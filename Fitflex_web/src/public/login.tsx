import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "./query";
import axios from "axios";
import { toast } from "react-toastify";

const LoginView: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");

  const loginMutation = useLogin();

  const handleLogin = () => {
    if (!email || !password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (response) => {
  const token = response.data.token;
  const user = response.data.user;

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify({ ...user, id: user._id }));
  localStorage.setItem("userId", user.id);
  setErrorMessage("");
  toast.success("Login Successful!");
  navigate("/dashboard");
},

        onError: (error: any) => {
          const response = error?.response?.data?.message || "";

          if (response.toLowerCase().includes("otp")) {
            localStorage.setItem("emailForOTP", email);
            navigate("/verify-otp");
          } else {
            setErrorMessage("Invalid credentials. Please try again.");
          }
        },
      }
    );
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      setForgotMessage("Please enter your email address.");
      return;
    }

    try {
      const res = await axios.post("https://localhost:3001/api/v1/auth/forgot-password", {
        email: forgotEmail,
      });
      setForgotMessage(res.data.message || "Reset link sent.");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Something went wrong.";
      setForgotMessage(msg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md p-6 bg-gray-900 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-white text-center">Welcome Back!</h2>
        <p className="text-gray-400 text-center mt-2">Log in to your account</p>

        {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}

        {!showForgotPassword && (
          <>
            <div className="mt-6">
              <CustomTextField
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                icon="📧"
              />
              <CustomTextField
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={setPassword}
                icon="🔒"
                isPassword
                toggleVisibility={() => setShowPassword((prev) => !prev)}
                showPassword={showPassword}
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loginMutation.isPending}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-lg mt-6 transition disabled:opacity-50"
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </button>

            <div className="mt-4 text-center">
              <button
                onClick={() => setShowForgotPassword(true)}
                className="text-purple-300 hover:text-purple-400 transition text-sm"
              >
                Forgot Password?
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => navigate("/register")}
                className="text-purple-300 hover:text-purple-400 transition"
              >
                Don't have an account? Register
              </button>
            </div>
          </>
        )}

        {showForgotPassword && (
          <>
            <div className="mt-6">
              <CustomTextField
                label="Enter your email"
                type="email"
                value={forgotEmail}
                onChange={setForgotEmail}
                icon="📧"
              />
            </div>

            <button
              onClick={handleForgotPassword}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg mt-6 transition"
            >
              Send Reset Link
            </button>

            <div className="mt-4 text-center">
              <button
                onClick={() => setShowForgotPassword(false)}
                className="text-purple-300 hover:text-purple-400 transition text-sm"
              >
                Back to Login
              </button>
            </div>

            {forgotMessage && (
              <p className="text-green-400 text-center mt-4">{forgotMessage}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

interface CustomTextFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (val: string) => void;
  icon: string;
  isPassword?: boolean;
  toggleVisibility?: () => void;
  showPassword?: boolean;
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  label,
  type,
  value,
  onChange,
  icon,
  isPassword = false,
  toggleVisibility,
  showPassword,
}) => {
  return (
    <div className="flex items-center border border-gray-700 rounded-lg bg-gray-800 p-3 mt-4 relative">
      <span className="mr-3 text-gray-400">{icon}</span>
      <input
        type={type}
        placeholder={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-white outline-none placeholder-gray-500"
      />
      {isPassword && (
        <span
          className="absolute right-3 text-gray-400 cursor-pointer"
          onClick={toggleVisibility}
        >
          {showPassword ? "🚫" : "👁️"}
        </span>
      )}
    </div>
  );
};

export default LoginView;

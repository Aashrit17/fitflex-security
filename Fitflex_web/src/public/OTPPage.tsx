import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVerifyOTP } from "../public/query"; // ✅ Corrected import
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const OTPPage: React.FC = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const email = localStorage.getItem("userEmail");

  const { mutate: verifyOTP, isPending } = useVerifyOTP();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || !email) {
      toast.error("OTP and email are required.");
      return;
    }

    verifyOTP(
      { email, otp },
      {
        onSuccess: (response) => {
          const token = response.data?.token;
          if (!token) {
            toast.error("Token missing in response");
            return;
          }

          toast.success("OTP verified successfully!");
          localStorage.removeItem("userEmail");
          localStorage.setItem("token", token);

          const decoded: any = jwtDecode(token);
          if (decoded.role === "admin") navigate("/admin/dashboard");
          else navigate("/");
        },
        onError: (error: any) => {
          const message =
            error?.response?.data?.message || "OTP verification failed";
          toast.error(message);
        },
      }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <div className="w-full max-w-md p-6 bg-gray-900 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-purple-400">
          Verify OTP
        </h2>
        <p className="text-sm text-center text-gray-400 mb-4">
          Enter the OTP sent to your email
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full p-3 rounded-md bg-gray-800 text-white placeholder-gray-400 outline-none"
          />

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-md"
            disabled={isPending}
          >
            {isPending ? "Verifying..." : "Verify"}
          </button>
        </form>

        <p className="text-center mt-4">
          <button
            onClick={() => navigate("/")}
            className="text-purple-300 hover:text-purple-400"
          >
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default OTPPage;

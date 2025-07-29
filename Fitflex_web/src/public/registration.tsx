import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useRegister } from "./query";
import { toast } from "react-toastify";

const RegistrationView: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<"" | "weak" | "medium" | "strong">("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const registerMutation = useRegister();
  const navigate = useNavigate();

  const evaluatePasswordStrength = (value: string) => {
    const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    const medium = /^((?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,})$/;
    if (strong.test(value)) setPasswordStrength("strong");
    else if (medium.test(value)) setPasswordStrength("medium");
    else setPasswordStrength("weak");
    if (!value) setPasswordStrength("");
  };

  const onSubmit = (data: any) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("password", data.password);
    if (profilePicture) {
      formData.append("image", profilePicture);
    }

    registerMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Registered successfully! Check your email for OTP.");
        localStorage.setItem("userEmail", data.email);
        navigate("/verify-otp");
      },
      onError: (error: any) => {
        const message = error?.response?.data?.message || "Registration failed";
        toast.error(message);
      },
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setProfilePicture(file);
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case "weak":
        return "text-red-500";
      case "medium":
        return "text-yellow-400";
      case "strong":
        return "text-green-500";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <div className="w-full max-w-md p-6 bg-gray-900 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-purple-400">Create an Account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          {/* Image Upload */}
          <div className="flex justify-center">
            <label className="cursor-pointer">
              {profilePicture ? (
                <img
                  src={URL.createObjectURL(profilePicture)}
                  alt="Preview"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
                  📷
                </div>
              )}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          {/* Inputs */}
          <CustomInput label="Full Name" type="text" icon="👤" {...register("name", { required: true })} />
          {errors.name && <span className="text-red-500 text-sm">Name is required</span>}

          <CustomInput label="Email" type="email" icon="📧" {...register("email", { required: true })} />
          {errors.email && <span className="text-red-500 text-sm">Email is required</span>}

          <CustomInput label="Phone" type="tel" icon="📞" {...register("phone", { required: true })} />
          {errors.phone && <span className="text-red-500 text-sm">Phone is required</span>}

          <div className="relative">
            <CustomInput
              label="Password"
              type={showPassword ? "text" : "password"}
              icon="🔒"
              {...register("password", {
                required: true,
                onChange: (e) => evaluatePasswordStrength(e.target.value),
              })}
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-400"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "🚫" : "👁️"}
            </span>
            {errors.password && <span className="text-red-500 text-sm">Password is required</span>}
            {passwordStrength && (
              <p className={`text-sm mt-1 font-semibold ${getStrengthColor()}`}>
                Password strength: {passwordStrength}
              </p>
            )}
          </div>

          <div className="relative">
            <CustomInput
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              icon="🔒"
              {...register("confirmPassword", { required: true })}
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-400"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? "🚫" : "👁️"}
            </span>
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm">Confirm password</span>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-lg mt-6"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center mt-4">
          <button onClick={() => navigate("/")} className="text-purple-300 hover:text-purple-400">
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
};

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type: string;
  icon: string;
}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ label, type, icon, ...props }, ref) => {
    return (
      <div className="flex items-center border border-gray-700 rounded-lg bg-gray-800 p-3">
        <span className="mr-3 text-gray-400">{icon}</span>
        <input
          type={type}
          placeholder={label}
          className="w-full bg-transparent text-white outline-none placeholder-gray-500"
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
CustomInput.displayName = "CustomInput";

export default RegistrationView;

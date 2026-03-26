import React, { useMemo, useState } from "react";
import api from "../../config/axiosInstance";
import toast from "react-hot-toast";
import { BASE_URL } from "../../../helper";

const ForgotPassword = ({ onBackToLogin }) => {
  const envMobileRequired =
    import.meta.env.VITE_FEATURE_MOBILE_VERIFICATION_ENABLED === "true";

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [mobileOtp, setMobileOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobileRequiredFromApi, setMobileRequiredFromApi] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const mobileRequired = useMemo(() => {
    if (mobileRequiredFromApi !== null) return mobileRequiredFromApi;
    return envMobileRequired;
  }, [envMobileRequired, mobileRequiredFromApi]);

  const handleRequestOtp = async () => {
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const response = await api.post(`${BASE_URL}/auth/forgot-password`, {
        email: email.trim(),
      });
      setMobileRequiredFromApi(
        Boolean(response.data?.mobileVerificationRequired)
      );
      toast.success(response.data?.message || "OTP sent successfully");
      setStep(2);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (typeof err.response?.data === "string" && err.response.data) ||
        "Failed to send OTP";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!emailOtp.trim()) {
      setError("Email OTP is required");
      return;
    }
    if (mobileRequired && !mobileOtp.trim()) {
      setError("Mobile OTP is required");
      return;
    }
    if (!newPassword.trim() || newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setIsLoading(true);
    try {
      const payload = {
        email: email.trim(),
        emailOtp: emailOtp.trim(),
        ...(mobileRequired ? { mobileOtp: mobileOtp.trim() } : {}),
        newPassword,
      };
      const response = await api.post(`${BASE_URL}/auth/reset-password`, payload);
      toast.success(response.data?.message || "Password reset successfully");
      onBackToLogin();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (typeof err.response?.data === "string" && err.response.data) ||
        "Failed to reset password";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-poppins">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-[#275434]">Forgot Password</h3>
        <p className="text-sm text-gray-600 mt-1">
          {step === 1
            ? "Enter your email to receive OTP."
            : "Verify OTP and set your new password."}
        </p>
      </div>

      {error && <p className="mb-3 text-sm text-red-700">{error}</p>}

      {step === 1 ? (
        <div className="space-y-4">
          <div>
            <label className="block text-[#275434] mb-2 font-medium">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#45a25e]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <button
            className="w-full py-3 rounded-md bg-[#45a25e] text-white hover:bg-[#34854a] disabled:bg-gray-300"
            onClick={handleRequestOtp}
            disabled={isLoading}
          >
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-[#275434] mb-2 font-medium">
              Email OTP
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#45a25e]"
              value={emailOtp}
              onChange={(e) => setEmailOtp(e.target.value)}
              placeholder="Enter email OTP"
            />
          </div>

          {mobileRequired && (
            <div>
              <label className="block text-[#275434] mb-2 font-medium">
                Mobile OTP
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#45a25e]"
                value={mobileOtp}
                onChange={(e) => setMobileOtp(e.target.value)}
                placeholder="Enter mobile OTP"
              />
            </div>
          )}

          <div>
            <label className="block text-[#275434] mb-2 font-medium">
              New Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#45a25e]"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
            />
          </div>

          <div>
            <label className="block text-[#275434] mb-2 font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#45a25e]"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
            />
          </div>

          <button
            className="w-full py-3 rounded-md bg-[#45a25e] text-white hover:bg-[#34854a] disabled:bg-gray-300"
            onClick={handleResetPassword}
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={onBackToLogin}
        className="w-full mt-3 py-3 rounded-md border border-[#45a25e] text-[#34854a] hover:bg-[#e3f5e7]"
      >
        Back to Login
      </button>
    </div>
  );
};

export default ForgotPassword;

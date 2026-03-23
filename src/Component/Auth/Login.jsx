import React, { useState } from "react";
import OtpVerification from "./OtpVerification";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BASE_URL } from "../../../helper";

const Login = ({ onNavigateToSignUp }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Validate phone number format
  const validatePhoneNumber = (number) => {
    const cleaned = number.replace(/\D/g, "");
    return cleaned.length === 10;
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    const cleaned = value.replace(/\D/g, "").slice(0, 10);
    setPhoneNumber(cleaned);
    if (error) setError("");
  };

  const jwtRequest = {
    phoneNumber: phoneNumber,
  };

  const handleGetOtp = async () => {
    if (!phoneNumber.trim()) {
      setError("Please enter your phone number");
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, jwtRequest);
      if (response.status === 200) {
        setShowOtp(true);
        toast.success(typeof response.data === 'string' ? response.data : 'OTP sent successfully!');
      }
    } catch (err) {
      let errorMessage = "Failed to send OTP. Please try again.";
      
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isLoading) {
      handleGetOtp();
    }
  };

  const handleLogin = async (otp) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/verify-otp/${phoneNumber}/${otp}`,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        const { jwtToken, role } = response.data;
        if (jwtToken) {
          const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
          document.cookie = `jwt_token=${jwtToken}; path=/; max-age=${maxAge}; SameSite=Lax`;
        }
        setPhoneNumber("");
        setShowOtp(false);
        toast.success("Login successful!");
        navigate("/dashboard");
      }
    } catch (err) {
      let errorMessage = "Failed to verify OTP. Please try again.";
      
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      throw err; // Re-throw so OtpVerification component knows it failed
    }
  };

  const handleBackToLogin = () => {
    setShowOtp(false);
    setError("");
  };

  if (showOtp) {
    return (
      <OtpVerification
        onSubmit={handleLogin}
        onBack={handleBackToLogin}
        buttonText="Login"
        isFromLogin={true}
        error={error}
      />
    );
  }

  return (
    <div className="font-poppins">
      <div className="flex mb-6">
        <button className="flex-1 py-2 text-center bg-[#e3f5e7] text-[#34854a] font-medium rounded-tl-md rounded-bl-md">
          Login
        </button>
        <button
          className="flex-1 py-2 text-center bg-white text-gray-600 font-medium rounded-tr-md rounded-br-md hover:bg-gray-50 transition duration-200"
          onClick={onNavigateToSignUp}
        >
          Sign Up
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
          <svg
            className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-red-700 text-sm">
            {typeof error === 'string' ? error : error?.message || 'An error occurred'}
          </p>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-[#275434] mb-2 font-medium">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          placeholder="Enter 10-digit phone number"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition duration-200 ${
            error
              ? "border-red-300 focus:ring-red-200"
              : "border-gray-300 focus:ring-[#45a25e]"
          }`}
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          onKeyDown={handleKeyDown}
          maxLength="10"
          disabled={isLoading}
          autoComplete="tel"
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter your 10-digit mobile number
        </p>
      </div>

      <button
        className={`w-full py-3 rounded-md transition duration-200 font-medium flex items-center justify-center ${
          isLoading || !phoneNumber
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[#45a25e] text-white hover:bg-[#34854a]"
        }`}
        onClick={handleGetOtp}
        disabled={isLoading || !phoneNumber}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Sending OTP...
          </>
        ) : (
          "Get OTP"
        )}
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        By continuing, you agree to receive OTP via SMS
      </p>
    </div>
  );
};

export default Login;

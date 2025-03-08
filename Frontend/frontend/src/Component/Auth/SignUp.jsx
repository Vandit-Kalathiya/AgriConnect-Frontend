import React, { useState } from "react";
import OtpVerification from "./OtpVerification";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SignUp = ({ onNavigateToLogin }) => {
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGetOtp = async () => {
    try {
      const response = await axios.post(
        "http://localhost:2525/auth/register",
        {
          username,
          address,
          phoneNumber,
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setShowOtp(true);
        setError("");
      }
    } catch (err) {
      setError(err.response?.data || "Failed to send OTP");
    }
  };

  const handleCreateAccount = async (otp) => {
    try {
      const response = await axios.post(
        `http://localhost:2525/auth/r/verify-otp/${phoneNumber}/${otp}`,
        { username, address, phoneNumber },
        { withCredentials: true }
      );

      const jwtRequest = {
        phoneNumber,
      };
      if (response.status === 201) {
        // After successful registration, automatically log in
        const loginResponse = await axios.post(
          "http://localhost:2525/auth/login/after/register",
          jwtRequest,
          { withCredentials: true }
        );
        if (loginResponse.status === 200) {
          console.log(loginResponse.data);
          const token = loginResponse.data.jwtToken;
          setUsername("");
          setAddress("");
          setPhoneNumber("");
          setShowOtp(false);
          toast.success("Registered Successfully")
          navigate("/dashboard");
        }
      }
    } catch (err) {
      setError(err || "Failed to verify OTP or login");
    }
  };

  const handleBackToSignUp = () => {
    setShowOtp(false);
  };

  if (showOtp) {
    return (
      <OtpVerification
        onSubmit={handleCreateAccount}
        onBack={handleBackToSignUp}
        buttonText="Create Account"
        isFromLogin={false}
        error={error}
      />
    );
  }

  // Handle input change
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Allow only digits
    const numericValue = value.replace(/\D/g, "");

    // Restrict to 10 digits max
    if (numericValue.length <= 10) {
      setPhoneNumber(numericValue);
      // Check if less than 10 digits on blur or submission, but not during typing
      if (numericValue.length > 0 && numericValue.length < 10) {
        setError("Phone number must be exactly 10 digits");
      } else {
        setError("");
      }
    }
  };

  // Validate on blur (when user leaves the input)
  const handleBlur = () => {
    if (phoneNumber.length !== 10) {
      setError("Phone number must be exactly 10 digits");
    } else {
      setError("");
    }
  };

  return (
    <div>
      <div className="flex mb-6">
        <button
          className="flex-1 py-2 text-center bg-white text-gray-600 font-medium rounded-tl-md rounded-bl-md"
          onClick={onNavigateToLogin}
        >
          Login
        </button>
        <button className="flex-1 py-2 text-center bg-[#e3f5e7] text-[#34854a] font-medium rounded-tr-md rounded-br-md">
          Sign Up
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <label className="block text-[#275434] mb-2 font-medium">
          Username
        </label>
        <input
          type="text"
          placeholder="Choose a username"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#45a25e]"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-[#275434] mb-2 font-medium">Address</label>
        <input
          type="text"
          placeholder="Enter your address"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#45a25e]"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <label className="block text-[#275434] mb-2 font-medium">
          Phone Number
        </label>
        <input
          type="text"
          placeholder="Enter your phone number"
          className={`w-full px-3 py-2 border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-[#45a25e]`}
          value={phoneNumber}
          onChange={handlePhoneChange}
          onBlur={handleBlur}
          maxLength={10} // HTML attribute to limit input length
          inputMode="numeric" // Suggests numeric keyboard on mobile
          pattern="[0-9]*" // Enforces numeric input for some browsers
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
      <button
        className="w-full bg-[#45a25e] text-white py-3 rounded-md hover:bg-[#34854a] transition duration-200 font-medium"
        onClick={handleGetOtp}
      >
        Get OTP
      </button>
    </div>
  );
};

export default SignUp;

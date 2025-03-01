import React, { useState } from "react";
import OtpVerification from "./OtpVerification";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ onNavigateToSignUp }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const jwtRequest = {
    phoneNumber: phoneNumber,
  };

  const handleGetOtp = async () => {
    try {
      const response = await axios.post("http://localhost:2525/auth/login", jwtRequest);
      if (response.status === 200) {
        setShowOtp(true);
        setError("");
      }
    } catch (err) {
      setError(err.response?.data || "Failed to send OTP");
    }
  };

  const handleLogin = async (otp) => {
    try {
      const response = await axios.post(
        `http://localhost:2525/auth/verify-otp/${phoneNumber}/${otp}`,{}, { withCredentials: true }
      );
      if (response.status === 200) {
        console.log(response.data);
        const { jwtToken, role } = response.data;
        // const token = response.data.split("Login successful.: ")[1];
        // localStorage.setItem("jwtToken", token);
        setPhoneNumber("");
        setShowOtp(false);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data || "Failed to verify OTP");
    }
  };

  const handleBackToLogin = () => {
    setShowOtp(false);
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
    <div>
      <div className="flex mb-6">
        <button className="flex-1 py-2 text-center bg-[#e3f5e7] text-[#34854a] font-medium rounded-tl-md rounded-bl-md">
          Login
        </button>
        <button
          className="flex-1 py-2 text-center bg-white text-gray-600 font-medium rounded-tr-md rounded-br-md"
          onClick={onNavigateToSignUp}
        >
          Sign Up
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <label className="block text-[#275434] mb-2 font-medium">
          Phone Number
        </label>
        <input
          type="text"
          placeholder="Enter your phone number"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#45a25e]"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
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

export default Login;

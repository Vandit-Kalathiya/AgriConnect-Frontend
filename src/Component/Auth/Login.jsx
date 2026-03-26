import React, { useState } from "react";
import api from "../../config/axiosInstance";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BASE_URL } from "../../../helper";
import { Eye, EyeOff } from "lucide-react";

const Login = ({ onNavigateToSignUp, onNavigateToForgotPassword }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handlePhoneNumberChange = (e) => {
    const cleaned = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhoneNumber(cleaned);
    if (error) setError("");
  };

  const validate = () => {
    if (!phoneNumber.trim()) return "Please enter your phone number";
    if (phoneNumber.length !== 10) return "Please enter a valid 10-digit phone number";
    if (!password.trim()) return "Please enter your password";
    return "";
  };

  const handleLogin = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const response = await api.post(`${BASE_URL}/auth/login`, {
        phoneNumber,
        password,
      });
      const { jwtToken } = response.data || {};
      if (jwtToken) {
        localStorage.setItem("jwt_token", jwtToken);
        const maxAge = 7 * 24 * 60 * 60;
        document.cookie = `jwt_token=${jwtToken}; path=/; max-age=${maxAge}; SameSite=Lax`;
      }
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      let errorMessage = "Failed to login. Please try again.";
      if (err.response?.status === 401) {
        errorMessage = "Invalid phone number or password";
      } else if (typeof err.response?.data === "string") {
        errorMessage = err.response.data;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isLoading) handleLogin();
  };

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

      {error && <p className="mb-3 text-sm text-red-700">{error}</p>}

      <div className="mb-4">
        <label className="block text-[#275434] mb-2 font-medium">Phone Number</label>
        <input
          type="tel"
          placeholder="Enter 10-digit phone number"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#45a25e]"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          onKeyDown={handleKeyDown}
          maxLength={10}
          disabled={isLoading}
          autoComplete="tel"
        />
      </div>

      <div className="mb-2">
        <label className="block text-[#275434] mb-2 font-medium">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#45a25e]"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError("");
            }}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <button
          type="button"
          className="text-sm text-[#34854a] hover:underline"
          onClick={onNavigateToForgotPassword}
        >
          Forgot password?
        </button>
      </div>

      <button
        className={`w-full py-3 rounded-md transition duration-200 font-medium ${
          isLoading || !phoneNumber || !password
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[#45a25e] text-white hover:bg-[#34854a]"
        }`}
        onClick={handleLogin}
        disabled={isLoading || !phoneNumber || !password}
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
};

export default Login;

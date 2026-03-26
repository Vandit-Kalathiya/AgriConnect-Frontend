import React, { useState } from "react";
import api from "../../config/axiosInstance";
import toast from "react-hot-toast";
import { BASE_URL } from "../../../helper";

const SignUp = ({ onNavigateToLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    address: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateUsername = (username) => {
    if (!username.trim()) return "Username is required";
    if (username.length < 3) return "Username must be at least 3 characters";
    if (username.length > 30) return "Username must be less than 30 characters";
    if (!/^[a-zA-Z0-9_]+$/.test(username))
      return "Username can only contain letters, numbers, and underscores";
    return "";
  };

  const validateAddress = (address) => {
    if (!address.trim()) return "Address is required";
    if (address.length < 10) return "Please enter a complete address";
    return "";
  };

  const validatePhoneNumber = (number) => {
    const cleaned = number.replace(/\D/g, "");
    if (!cleaned) return "Phone number is required";
    if (cleaned.length !== 10) return "Phone number must be exactly 10 digits";
    return "";
  };

  const validateEmail = (email) => {
    if (!email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email";
    return "";
  };

  const validatePassword = (password) => {
    if (!password.trim()) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    return "";
  };

  const validateForm = () => {
    const newErrors = {
      username: validateUsername(formData.username),
      address: validateAddress(formData.address),
      phoneNumber: validatePhoneNumber(formData.phoneNumber),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
    };
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, "").slice(0, 10);
    handleInputChange("phoneNumber", numericValue);
  };

  const handleBlur = (field) => {
    let error = "";
    if (field === "username") error = validateUsername(formData.username);
    if (field === "address") error = validateAddress(formData.address);
    if (field === "phoneNumber")
      error = validatePhoneNumber(formData.phoneNumber);
    if (field === "email") error = validateEmail(formData.email);
    if (field === "password") error = validatePassword(formData.password);
    if (field === "confirmPassword" && formData.password !== formData.confirmPassword) {
      error = "Passwords do not match";
    }

    if (error) {
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isLoading) {
      handleRegister();
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      toast.error("Please fix all errors before continuing");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        username: formData.username.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        address: formData.address.trim(),
        email: formData.email.trim(),
        password: formData.password,
      };
      const response = await api.post(`${BASE_URL}/auth/register`, payload);
      if (response.status === 201 || response.status === 200) {
        setErrors({});
        toast.success("Registered successfully. Please login.");
        onNavigateToLogin();
      }
    } catch (err) {
      let errorMessage = "Registration failed. Please try again.";
      
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    formData.username &&
    formData.address &&
    formData.phoneNumber.length === 10 &&
    formData.email &&
    formData.password &&
    formData.confirmPassword;

  return (
    <div className="font-poppins">
      <div className="flex mb-6">
        <button
          className="flex-1 py-2 text-center bg-white text-gray-600 font-medium rounded-tl-md rounded-bl-md hover:bg-gray-50 transition duration-200"
          onClick={onNavigateToLogin}
        >
          Login
        </button>
        <button className="flex-1 py-2 text-center bg-[#e3f5e7] text-[#34854a] font-medium rounded-tr-md rounded-br-md">
          Sign Up
        </button>
      </div>

      {errors.general && (
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
            {typeof errors.general === 'string' ? errors.general : errors.general?.message || 'An error occurred'}
          </p>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-[#275434] mb-2 font-medium">
          Username <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Choose a username"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition duration-200 ${
            errors.username
              ? "border-red-300 focus:ring-red-200"
              : "border-gray-300 focus:ring-[#45a25e]"
          }`}
          value={formData.username}
          onChange={(e) => handleInputChange("username", e.target.value)}
          onBlur={() => handleBlur("username")}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          autoComplete="username"
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-500">{errors.username}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          3-30 characters, letters, numbers, and underscores only
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-[#275434] mb-2 font-medium">
          Address <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter your complete address"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition duration-200 ${
            errors.address
              ? "border-red-300 focus:ring-red-200"
              : "border-gray-300 focus:ring-[#45a25e]"
          }`}
          value={formData.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          onBlur={() => handleBlur("address")}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          autoComplete="street-address"
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-500">{errors.address}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Include street, city, and postal code
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-[#275434] mb-2 font-medium">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          placeholder="Enter 10-digit phone number"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition duration-200 ${
            errors.phoneNumber
              ? "border-red-300 focus:ring-red-200"
              : "border-gray-300 focus:ring-[#45a25e]"
          }`}
          value={formData.phoneNumber}
          onChange={handlePhoneChange}
          onBlur={() => handleBlur("phoneNumber")}
          onKeyDown={handleKeyDown}
          maxLength={10}
          disabled={isLoading}
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="tel"
        />
        {errors.phoneNumber && (
          <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Enter your 10-digit mobile number
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-[#275434] mb-2 font-medium">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition duration-200 ${
            errors.email
              ? "border-red-300 focus:ring-red-200"
              : "border-gray-300 focus:ring-[#45a25e]"
          }`}
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          onBlur={() => handleBlur("email")}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          autoComplete="email"
        />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-[#275434] mb-2 font-medium">
          Password <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          placeholder="Create password (min 8 chars)"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition duration-200 ${
            errors.password
              ? "border-red-300 focus:ring-red-200"
              : "border-gray-300 focus:ring-[#45a25e]"
          }`}
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          onBlur={() => handleBlur("password")}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          autoComplete="new-password"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-[#275434] mb-2 font-medium">
          Confirm Password <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          placeholder="Re-enter password"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition duration-200 ${
            errors.confirmPassword
              ? "border-red-300 focus:ring-red-200"
              : "border-gray-300 focus:ring-[#45a25e]"
          }`}
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
          onBlur={() => handleBlur("confirmPassword")}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          autoComplete="new-password"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
        )}
      </div>

      <button
        className={`w-full py-3 rounded-md transition duration-200 font-medium flex items-center justify-center ${
          isLoading || !isFormValid
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[#45a25e] text-white hover:bg-[#34854a]"
        }`}
        onClick={handleRegister}
        disabled={isLoading || !isFormValid}
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
            Creating Account...
          </>
        ) : (
          "Create Account"
        )}
      </button>
    </div>
  );
};

export default SignUp;

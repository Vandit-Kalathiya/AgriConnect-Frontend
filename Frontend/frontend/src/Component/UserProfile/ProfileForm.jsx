import React, { useState } from "react";
import { FaUser, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";
import { BASE_URL, getTokenFromCookie } from "../../../helper";
import toast from "react-hot-toast";

const ProfileForm = ({
  editMode,
  formData,
  errors,
  onInputChange,
  userData,
  onPhoneNumberVerified, // New prop to update phone number after OTP verification
}) => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [tempPhoneNumber, setTempPhoneNumber] = useState("");
  const [otpError, setOtpError] = useState("");

  const handleSendOtp = async () => {
    if (!tempPhoneNumber || !/^\d{10}$/.test(tempPhoneNumber)) {
      setOtpError((prev) => ({
        ...prev,
        phoneNumber: "Phone number must be a 10-digit number",
      }));
      return;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/auth/otp/send?phoneNumber=${tempPhoneNumber}`
        );
        console.log(res);
      setIsOtpSent(true);
      toast.success("OTP sent to your phone number!");
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/otp/verify?phoneNumber=${tempPhoneNumber}&otp=${otpValue}`,
        {
          headers: {
            Authorization: "Bearer " + getTokenFromCookie(),
          },
        }
        );
        console.log(response);
      if (response.data) {
        onPhoneNumberVerified(tempPhoneNumber);
        setIsOtpSent(false);
        setOtpValue("");
        setTempPhoneNumber("");
        setOtpError("");
        toast.success("Phone number updated successfully!");
      } else {
        setOtpError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setOtpError("Failed to verify OTP. Please try again.");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <div className="flex flex-col">
        <label className="text-sm md:text-md font-medium text-green-700 mb-1 md:mb-2 flex items-center">
          <FaUser className="mr-2" /> Username
        </label>
        {editMode ? (
          <input
            type="text"
            name="username"
            value={formData.username || ""}
            onChange={onInputChange}
            className="w-full p-2 md:p-3 text-sm md:text-md rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50 transition"
            placeholder="Enter your username"
          />
        ) : (
          <p className="text-md md:text-lg text-gray-800">
            {userData.username || "Not set"}
          </p>
        )}
        {errors.username && (
          <p className="text-xs md:text-sm text-red-500 mt-1">
            {errors.username}
          </p>
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-sm md:text-md font-medium text-green-700 mb-1 md:mb-2 flex items-center">
          <FaPhone className="mr-2" /> Phone Number
        </label>
        {editMode ? (
          <>
            {!isOtpSent ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempPhoneNumber}
                  onChange={(e) => setTempPhoneNumber(e.target.value)}
                  className="w-full p-2 md:p-3 text-sm md:text-md rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50 transition"
                  placeholder="Enter new phone number"
                  maxLength={10}
                />
                <button
                  onClick={handleSendOtp}
                  className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  Send OTP
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value)}
                    className="w-full p-2 md:p-3 text-sm md:text-md rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50 transition"
                    placeholder="Enter OTP"
                    maxLength={6}
                  />
                  <button
                    onClick={handleVerifyOtp}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  >
                    Verify OTP
                  </button>
                </div>
                {otpError && (
                  <p className="text-xs md:text-sm text-red-500 mt-1">
                    {otpError}
                  </p>
                )}
              </div>
            )}
            <p className="text-sm text-gray-600 mt-1">
              Current: {formData.phoneNumber || "Not set"}
            </p>
          </>
        ) : (
          <p className="text-md md:text-lg text-gray-800">
            {userData.phoneNumber || "Not set"}
          </p>
        )}
        {errors.phoneNumber && !isOtpSent && (
          <p className="text-xs md:text-sm text-red-500 mt-1">
            {errors.phoneNumber}
          </p>
        )}
      </div>

      <div className="flex flex-col md:col-span-2">
        <label className="text-sm md:text-md font-medium text-green-700 mb-1 md:mb-2 flex items-center">
          <FaMapMarkerAlt className="mr-2" /> Address
        </label>
        {editMode ? (
          <textarea
            name="address"
            value={formData.address || ""}
            onChange={onInputChange}
            className="w-full p-2 md:p-3 text-sm md:text-md rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50 resize-none transition"
            rows={3}
            placeholder="Enter your address"
          />
        ) : (
          <p className="text-md md:text-lg text-gray-800">
            {userData.address || "Not set"}
          </p>
        )}
        {errors.address && (
          <p className="text-xs md:text-sm text-red-500 mt-1">
            {errors.address}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileForm;

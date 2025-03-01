import React, { useState } from "react";
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaEnvelope,
  FaCamera,
  FaTractor,
} from "react-icons/fa";
import { format } from "date-fns";
import Loader from "../Loader/Loader";

const UserProfile = () => {
  const [userData, setUserData] = useState({
    username: "FarmerJohn",
    phoneNumber: "1234567890",
    address: "123 Orchard Lane, California, USA",
    email: "farmer.john@example.com",
    profilePicture: "https://via.placeholder.com/150?text=Profile",
    registrationDate: "2024-01-15",
    farmDetails: {
      farmName: "Sunny Acres",
      farmSize: "50 acres",
      farmLocation: "Central Valley, CA",
    },
  });

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...userData });
  const [errors, setErrors] = useState({});
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const handleEditToggle = () => {
    if (editMode) {
      setFormData({ ...userData });
      setErrors({});
      setProfilePicFile(null);
    }
    setEditMode(!editMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("farmDetails.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        farmDetails: { ...formData.farmDetails, [field]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (value.trim() && errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleProfilePicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      setFormData({
        ...formData,
        profilePicture: URL.createObjectURL(file),
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.phoneNumber.trim() || !/^\d{10}$/.test(formData.phoneNumber))
      newErrors.phoneNumber = "Phone number must be a 10-digit number";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Valid email is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true); // Show loader
    try {
      // Simulate API call with delay
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Mock 2-second delay
      console.log("Saving user data:", formData);
      setUserData({ ...formData });
      if (profilePicFile) {
        console.log("Profile picture file:", profilePicFile);
      }
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false); // Hide loader
    }
  };

  return (
    <>
      {isLoading && <Loader message="Saving your profile..." />}
      <div className="bg-gray-50 py-6 md:py-12 px-4 md:px-6 lg:px-8 ml-0 md:ml-20 mt-16 md:mt-20 min-h-screen">
        <div className="max-w-full md:max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-green-900 mb-6 md:mb-10 text-center drop-shadow-md">
            Your Farmer Profile
          </h1>
          <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 border-t-4 border-green-500">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-semibold text-green-800">
                {editMode ? "Edit Your Profile" : "My Profile"}
              </h2>
              <button
                onClick={editMode ? handleSave : handleEditToggle}
                className={`flex items-center space-x-2 px-3 md:px-4 py-1 md:py-2 rounded-lg text-sm md:text-md transition-colors shadow-md ${
                  editMode
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-yellow-500 text-white hover:bg-yellow-600"
                }`}
              >
                {editMode ? (
                  <>
                    <FaSave />
                    <span>Save</span>
                  </>
                ) : (
                  <>
                    <FaEdit />
                    <span>Edit</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-6 md:space-y-8">
              {/* Profile Picture */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img
                    src={formData.profilePicture}
                    alt="Profile"
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-green-300"
                  />
                  {editMode && (
                    <label className="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full cursor-pointer hover:bg-green-600 transition-colors">
                      <FaCamera />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePicUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                {!editMode && (
                  <p className="mt-2 text-sm md:text-md text-gray-600">
                    Registered:{" "}
                    {format(
                      new Date(userData.registrationDate),
                      "MMMM d, yyyy"
                    )}
                  </p>
                )}
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Username */}
                <div className="flex flex-col">
                  <label className="text-sm md:text-md font-medium text-green-700 mb-1 md:mb-2 flex items-center">
                    <FaUser className="mr-2" /> Username
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full p-2 md:p-3 text-sm md:text-md rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50"
                      placeholder="Enter your username"
                    />
                  ) : (
                    <p className="text-md md:text-lg text-gray-800">
                      {userData.username}
                    </p>
                  )}
                  {errors.username && (
                    <p className="text-xs md:text-sm text-red-500 mt-1">
                      {errors.username}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="flex flex-col">
                  <label className="text-sm md:text-md font-medium text-green-700 mb-1 md:mb-2 flex items-center">
                    <FaPhone className="mr-2" /> Phone Number
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full p-2 md:p-3 text-sm md:text-md rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50"
                      placeholder="Enter your phone number"
                      maxLength={10}
                    />
                  ) : (
                    <p className="text-md md:text-lg text-gray-800">
                      {userData.phoneNumber}
                    </p>
                  )}
                  {errors.phoneNumber && (
                    <p className="text-xs md:text-sm text-red-500 mt-1">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="flex flex-col">
                  <label className="text-sm md:text-md font-medium text-green-700 mb-1 md:mb-2 flex items-center">
                    <FaEnvelope className="mr-2" /> Email
                  </label>
                  {editMode ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2 md:p-3 text-sm md:text-md rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50"
                      placeholder="Enter your email"
                    />
                  ) : (
                    <p className="text-md md:text-lg text-gray-800">
                      {userData.email}
                    </p>
                  )}
                  {errors.email && (
                    <p className="text-xs md:text-sm text-red-500 mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className="flex flex-col md:col-span-2">
                  <label className="text-sm md:text-md font-medium text-green-700 mb-1 md:mb-2 flex items-center">
                    <FaMapMarkerAlt className="mr-2" /> Address
                  </label>
                  {editMode ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full p-2 md:p-3 text-sm md:text-md rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50 resize-none"
                      rows={3}
                      placeholder="Enter your address"
                    />
                  ) : (
                    <p className="text-md md:text-lg text-gray-800">
                      {userData.address}
                    </p>
                  )}
                  {errors.address && (
                    <p className="text-xs md:text-sm text-red-500 mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>

              {/* Farm Details */}
              <div className="border-t border-green-200 pt-4 md:pt-6">
                <h3 className="text-lg md:text-xl font-semibold text-green-800 mb-2 md:mb-4 flex items-center">
                  <FaTractor className="mr-2 text-green-600" /> Farm Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="flex flex-col">
                    <label className="text-sm md:text-md font-medium text-green-700 mb-1 md:mb-2">
                      Farm Name (Optional)
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        name="farmDetails.farmName"
                        value={formData.farmDetails.farmName}
                        onChange={handleInputChange}
                        className="w-full p-2 md:p-3 text-sm md:text-md rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50"
                        placeholder="Enter your farm name"
                      />
                    ) : (
                      <p className="text-md md:text-lg text-gray-800">
                        {userData.farmDetails.farmName || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm md:text-md font-medium text-green-700 mb-1 md:mb-2">
                      Farm Size (Optional)
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        name="farmDetails.farmSize"
                        value={formData.farmDetails.farmSize}
                        onChange={handleInputChange}
                        className="w-full p-2 md:p-3 text-sm md:text-md rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50"
                        placeholder="e.g., 50 acres"
                      />
                    ) : (
                      <p className="text-md md:text-lg text-gray-800">
                        {userData.farmDetails.farmSize || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col md:col-span-2">
                    <label className="text-sm md:text-md font-medium text-green-700 mb-1 md:mb-2">
                      Farm Location (Optional)
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        name="farmDetails.farmLocation"
                        value={formData.farmDetails.farmLocation}
                        onChange={handleInputChange}
                        className="w-full p-2 md:p-3 text-sm md:text-md rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50"
                        placeholder="Enter your farm location"
                      />
                    ) : (
                      <p className="text-md md:text-lg text-gray-800">
                        {userData.farmDetails.farmLocation || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {editMode && (
                <div className="flex justify-end">
                  <button
                    onClick={handleEditToggle}
                    className="px-3 md:px-4 py-1 md:py-2 rounded-lg bg-red-500 text-white text-sm md:text-md hover:bg-red-600 transition-colors shadow-md"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;

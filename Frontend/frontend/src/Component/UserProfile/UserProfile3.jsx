import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaCamera,
  FaTractor,
  FaPlus,
  FaSignature,
} from "react-icons/fa";
import Loader from "../Loader/Loader";
import { getCurrentUser, getTokenFromCookie, BASE_URL } from "../../../helper";
import axios from "axios";
import toast from "react-hot-toast";

const UserProfile = () => {
  const [userData, setUserData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [signatureFile, setSignatureFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [signatureUrl, setSignatureUrl] = useState(null);

  const fetchUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUserData(userData);
      setFormData(userData);

      if (userData?.id) {
        const profileResponse = await axios.get(
          `${BASE_URL}/users/profile-image/${userData.id}`,
          {
            responseType: "arraybuffer",
            headers: {
              Authorization: "Bearer " + getTokenFromCookie(),
            },
          }
        );
        const profileBlob = new Blob([profileResponse.data], {
          type: "image/jpeg",
        });
        setProfilePictureUrl(URL.createObjectURL(profileBlob));

        const signatureResponse = await axios.get(
          `${BASE_URL}/users/signature-image/${userData.id}`,
          {
            responseType: "arraybuffer",
            headers: {
              Authorization: "Bearer " + getTokenFromCookie(),
            },
          }
        );
        const signatureBlob = new Blob([signatureResponse.data], {
          type: "image/jpeg",
        });
        setSignatureUrl(URL.createObjectURL(signatureBlob));
      }
    } catch (error) {
      console.error("Error fetching user or images:", error);
      toast.error("Failed to load user data or images");
    }
  };

  useEffect(() => {
    fetchUser();

    return () => {
      if (profilePictureUrl) URL.revokeObjectURL(profilePictureUrl);
      if (signatureUrl) URL.revokeObjectURL(signatureUrl);
    };
  }, []);

  const handleEditToggle = () => {
    if (editMode) {
      setFormData({ ...userData });
      setErrors({});
      setProfilePicFile(null);
      setSignatureFile(null);
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
      setProfilePictureUrl(URL.createObjectURL(file));
    }
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSignatureFile(file);
      setSignatureUrl(URL.createObjectURL(file));
    }
  };

  const addFarmDetails = () => {
    setFormData({
      ...formData,
      farmDetails: { farmName: "", farmSize: "", farmLocation: "" },
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username?.trim()) newErrors.username = "Username is required";
    if (!formData.phoneNumber?.trim() || !/^\d{10}$/.test(formData.phoneNumber))
      newErrors.phoneNumber = "Phone number must be a 10-digit number";
    if (!formData.address?.trim()) newErrors.address = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Function to check if any changes were made
  const hasChanges = () => {
    // Check text fields
    const textFieldsChanged =
      formData.username !== userData.username ||
      formData.address !== userData.address ||
      formData.phoneNumber !== userData.phoneNumber ||
      JSON.stringify(formData.farmDetails || {}) !==
        JSON.stringify(userData.farmDetails || {});

    // Check file uploads
    const filesChanged = profilePicFile !== null || signatureFile !== null;

    return textFieldsChanged || filesChanged;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    // Check if any changes were made
    if (!hasChanges()) {
      toast.error("No changes made to your profile");
      setEditMode(false);
      return;
    }

    setIsLoading(true);
    try {
      const userUpdateRequest = {
        username: formData.username || "",
        address: formData.address || "",
        phoneNumber: formData.phoneNumber || "",
        farmDetails: formData.farmDetails || {},
      };

      const formDataToSend = new FormData();
      formDataToSend.append(
        "userUpdateRequest",
        new Blob([JSON.stringify(userUpdateRequest)], {
          type: "application/json",
        })
      );

      if (profilePicFile) {
        formDataToSend.append("profilePicture", profilePicFile);
      }
      if (signatureFile) {
        formDataToSend.append("signatureImage", signatureFile);
      }

      const response = await axios.put(
        `${BASE_URL}/users/update/${userData.id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + getTokenFromCookie(),
          },
        }
      );

      setUserData(response.data);
      setFormData(response.data);
      setEditMode(false);
      toast.success("Profile updated successfully!");

      await fetchUser();
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error(
        `Failed to update profile: ${error.response?.data || "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader message="Saving your profile..." />}
      <div className="bg-gray-50 py-6 md:py-12 px-4 md:px-6 lg:px-8 ml-0 md:ml-20 mt-16 md:mt-20 min-h-screen">
        <div className="max-w-full md:max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-green-900 mb-6 md:mb-10 text-center drop-shadow-md">
            Your Profile
          </h1>
          <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 border-t-4 border-green-500">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-semibold text-green-800">
                {editMode ? "Edit Your Profile" : "My Profile"}
              </h2>
              <button
                onClick={editMode ? handleSave : handleEditToggle}
                className={`flex items-center space-x-2 px-3 md:px-4 py-1 md:py-2 rounded-lg text-sm md:text-md transition-all shadow-md ${
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
                    src={
                      profilePictureUrl ||
                      "https://via.placeholder.com/150?text=Profile"
                    }
                    alt="Profile"
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-green-300 shadow-sm"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/150?text=Profile";
                    }}
                  />
                  {editMode && (
                    <label className="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full cursor-pointer hover:bg-green-600 transition-all">
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
              </div>

              {/* Signature Image */}
              <div className="flex flex-col items-center">
                <label className="text-sm md:text-md font-medium text-green-700 mb-1 md:mb-2 flex items-center">
                  <FaSignature className="mr-2" /> Signature
                </label>
                <div className="relative">
                  {signatureUrl ? (
                    <img
                      src={signatureUrl}
                      alt="Signature"
                      className="w-40 h-20 md:w-48 md:h-24 object-contain border border-gray-300 rounded-lg shadow-sm"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/150?text=No+Signature";
                      }}
                    />
                  ) : (
                    <div className="w-40 h-20 md:w-48 md:h-24 flex items-center justify-center border border-dashed border-gray-300 rounded-lg text-gray-500">
                      No signature uploaded
                    </div>
                  )}
                  {editMode && (
                    <label className="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full cursor-pointer hover:bg-green-600 transition-all">
                      <FaCamera />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSignatureUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Rest of the form remains the same */}
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
                      onChange={handleInputChange}
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
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 md:p-3 text-sm md:text-md rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50 transition"
                      placeholder="Enter your phone number"
                      maxLength={10}
                    />
                  ) : (
                    <p className="text-md md:text-lg text-gray-800">
                      {userData.phoneNumber || "Not set"}
                    </p>
                  )}
                  {errors.phoneNumber && (
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
                      onChange={handleInputChange}
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

              <div className="border-t border-green-200 pt-4 md:pt-6">
                <div className="flex justify-between items-center mb-2 md:mb-4">
                  <h3 className="text-lg md:text-xl font-semibold text-green-800 flex items-center">
                    <FaTractor className="mr-2 text-green-600" /> Farm Details
                  </h3>
                  {editMode && !formData.farmDetails && (
                    <button
                      onClick={addFarmDetails}
                      className="flex items-center space-x-2 px-3 md:px-4 py-1 md:py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-all shadow-md"
                    >
                      <FaPlus />
                      <span>Add Farm Details</span>
                    </button>
                  )}
                </div>
                {formData.farmDetails ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="flex flex-col">
                      <label className="text-sm md:text-md font-medium text-green-700 mb-1 md:mb-2">
                        Farm Name (Optional)
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          name="farmDetails.farmName"
                          value={formData.farmDetails.farmName || ""}
                          onChange={handleInputChange}
                          className="w-full p-2 md:p-3 text-sm md:text-md rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50 transition"
                          placeholder="Enter your farm name"
                        />
                      ) : (
                        <p className="text-md md:text-lg text-gray-800">
                          {userData.farmDetails?.farmName || "Not provided"}
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
                          value={formData.farmDetails.farmSize || ""}
                          onChange={handleInputChange}
                          className="w-full p-2 md:p-3 text-sm md:text-md rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50 transition"
                          placeholder="e.g., 50 acres"
                        />
                      ) : (
                        <p className="text-md md:text-lg text-gray-800">
                          {userData.farmDetails?.farmSize || "Not provided"}
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
                          value={formData.farmDetails.farmLocation || ""}
                          onChange={handleInputChange}
                          className="w-full p-2 md:p-3 text-sm md:text-md rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50 transition"
                          placeholder="Enter your farm location"
                        />
                      ) : (
                        <p className="text-md md:text-lg text-gray-800">
                          {userData.farmDetails?.farmLocation || "Not provided"}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-md md:text-lg text-gray-600 italic">
                    No farm details available
                  </p>
                )}
              </div>

              {editMode && (
                <div className="flex justify-end gap-4">
                  <button
                    onClick={handleEditToggle}
                    className="px-3 md:px-4 py-1 md:py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all shadow-md"
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

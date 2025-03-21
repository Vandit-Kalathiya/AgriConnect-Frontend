import React, { useState, useEffect } from "react";
import Loader from "../Loader/Loader";
import { getCurrentUser, getTokenFromCookie, BASE_URL } from "../../../helper";
import axios from "axios";
import toast from "react-hot-toast";
import ProfileHeader from "./ProfileHeader";
import ProfilePicture from "./ProfilePicture";
import SignatureSection from "./SignatureSection";
import ProfileForm from "./ProfileForm";
import FarmDetailsSection from "./FarmDetailsSection";

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
    } else if (name !== "phoneNumber") {
      // Skip phoneNumber updates here
      setFormData({ ...formData, [name]: value });
    }
    if (value.trim() && errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePhoneNumberVerified = (newPhoneNumber) => {
    setFormData({ ...formData, phoneNumber: newPhoneNumber });
    setErrors((prev) => ({ ...prev, phoneNumber: "" }));
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

  const hasChanges = () => {
    const textFieldsChanged =
      formData.username !== userData.username ||
      formData.address !== userData.address ||
      formData.phoneNumber !== userData.phoneNumber ||
      JSON.stringify(formData.farmDetails || {}) !==
        JSON.stringify(userData.farmDetails || {});
    const filesChanged = profilePicFile !== null || signatureFile !== null;
    return textFieldsChanged || filesChanged;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

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
            <ProfileHeader
              editMode={editMode}
              onEditToggle={handleEditToggle}
              onSave={handleSave}
            />
            <div className="space-y-6 md:space-y-8">
              <ProfilePicture
                editMode={editMode}
                profilePictureUrl={profilePictureUrl}
                onProfilePicUpload={handleProfilePicUpload}
              />
              <SignatureSection
                editMode={editMode}
                signatureUrl={signatureUrl}
                onSignatureUpload={handleSignatureUpload}
              />
              <ProfileForm
                editMode={editMode}
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
                userData={userData}
                onPhoneNumberVerified={handlePhoneNumberVerified} // Pass callback
              />
              <FarmDetailsSection
                editMode={editMode}
                formData={formData}
                userData={userData}
                onInputChange={handleInputChange}
                onAddFarmDetails={addFarmDetails}
              />
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

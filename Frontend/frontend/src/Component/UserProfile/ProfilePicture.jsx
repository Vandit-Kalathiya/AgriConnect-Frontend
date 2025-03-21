import React from "react";
import { FaCamera } from "react-icons/fa";

const ProfilePicture = ({
  editMode,
  profilePictureUrl,
  onProfilePicUpload,
}) => (
  <div className="flex flex-col items-center">
    <div className="relative">
      <img
        src={
          profilePictureUrl || "https://via.placeholder.com/150?text=Profile"
        }
        alt="Profile"
        className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-green-300 shadow-sm"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/150?text=Profile";
        }}
      />
      {editMode && (
        <label className="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full cursor-pointer hover:bg-green-600 transition-all">
          <FaCamera />
          <input
            type="file"
            accept="image/*"
            onChange={onProfilePicUpload}
            className="hidden"
          />
        </label>
      )}
    </div>
  </div>
);

export default ProfilePicture;

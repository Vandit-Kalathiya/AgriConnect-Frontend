import React from "react";
import { FaCamera } from "react-icons/fa";

const PROFILE_FALLBACK =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150'><rect width='100%25' height='100%25' fill='%23e5e7eb'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%236b7280' font-family='Arial' font-size='18'>Profile</text></svg>";

const ProfilePicture = ({
  editMode,
  profilePictureUrl,
  onProfilePicUpload,
}) => (
  <div className="flex flex-col items-center">
    <div className="relative">
      <img
        src={profilePictureUrl || PROFILE_FALLBACK}
        alt="Profile"
        className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-green-300 shadow-sm"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = PROFILE_FALLBACK;
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

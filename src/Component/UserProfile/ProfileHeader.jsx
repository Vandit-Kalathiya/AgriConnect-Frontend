import React from "react";
import { FaEdit, FaSave } from "react-icons/fa";

const ProfileHeader = ({ editMode, onEditToggle, onSave }) => (
  <div className="flex justify-between items-center mb-4 md:mb-6">
    <h2 className="text-xl md:text-2xl font-semibold text-green-800">
      {editMode ? "Edit Your Profile" : "My Profile"}
    </h2>
    <button
      onClick={editMode ? onSave : onEditToggle}
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
);

export default ProfileHeader;

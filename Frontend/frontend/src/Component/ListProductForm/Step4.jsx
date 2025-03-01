import React from "react";
import { FaPhone } from "react-icons/fa"; // For contact info icon

const Step4 = ({ formData, errors, handleBack, handleSubmit }) => {
  const isStep4Valid = true; // No additional validation needed for preview

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <label className="block font-medium text-gray-800 mb-2">
          Product Photos
        </label>
        <div className="grid grid-cols-3 gap-4">
          {formData.productPhotos.map((photo, index) => (
            <img
              key={index}
              src={photo.preview}
              alt={`Preview ${index}`}
              className="h-32 w-full object-cover rounded-xl shadow-sm"
            />
          ))}
        </div>
      </div>

      {/* Product Name */}
      <div className="mb-6">
        <label className="block font-medium text-gray-800 mb-1">
          Product Name
        </label>
        <input
          type="text"
          name="productName"
          value={formData.productName}
          className="p-2 block w-full border-gray-300 rounded-lg shadow-sm bg-gray-50 text-gray-900 sm"
          readOnly
        />
      </div>

      {/* Crop Type */}
      <div className="mb-6">
        <label className="block font-medium text-gray-800 mb-1">
          Crop Type
        </label>
        <input
          type="text"
          name="cropType"
          value={formData.cropType}
          className="p-2 block w-full border-gray-300 rounded-lg shadow-sm bg-gray-50 text-gray-900 sm"
          readOnly
        />
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="block font-medium text-gray-800 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          className="p-2 block w-full border-gray-300 rounded-lg shadow-sm bg-gray-50 text-gray-900 sm h-24"
          readOnly
        />
      </div>

      {/* Quantity */}
      <div className="mb-6">
        <label className="block font-medium text-gray-800 mb-1">Quantity</label>
        <input
          type="text"
          name="quantity"
          value={`${formData.quantity} ${formData.unitOfQuantity}`}
          className="p-2 block w-full border-gray-300 rounded-lg shadow-sm bg-gray-50 text-gray-900 sm"
          readOnly
        />
      </div>

      {/* Quality Grade */}
      <div className="mb-6">
        <label className="block font-medium text-gray-800 mb-1">
          Quality Grade
        </label>
        <input
          type="text"
          name="qualityGrade"
          value={formData.qualityGrade}
          className="p-2 block w-full border-gray-300 rounded-lg shadow-sm bg-gray-50 text-gray-900 sm"
          readOnly
        />
      </div>

      {/* Harvest Date or Availability Date */}
      <div className="mb-6">
        <label className="block font-medium text-gray-800 mb-1">
          {formData.harvestDate ? "Harvest Date" : "Availability Date"}
        </label>
        <input
          type="text"
          name={formData.harvestDate ? "harvestDate" : "availabilityDate"}
          value={formData.harvestDate || formData.availabilityDate}
          className="p-2 block w-full border-gray-300 rounded-lg shadow-sm bg-gray-50 text-gray-900 sm"
          readOnly
        />
      </div>

      {/* Storage Conditions */}
      <div className="mb-6">
        <label className="block font-medium text-gray-800 mb-1">
          Storage Conditions
        </label>
        <input
          type="text"
          name="storageConditions"
          value={formData.storageConditions}
          className="p-2 block w-full border-gray-300 rounded-lg shadow-sm bg-gray-50 text-gray-900 sm"
          readOnly
        />
      </div>

      {/* Certifications */}
      <div className="mb-6">
        <label className="block font-medium text-gray-800 mb-1">
          Certifications
        </label>
        <input
          type="text"
          name="certifications"
          value={formData.certifications}
          className="p-2 block w-full border-gray-300 rounded-lg shadow-sm bg-gray-50 text-gray-900 sm"
          readOnly
        />
      </div>

      {/* Shelf Life */}
      <div className="mb-6">
        <label className="block font-medium text-gray-800 mb-1">
          Shelf Life (days)
        </label>
        <input
          type="text"
          name="shelfLife"
          value={formData.shelfLife}
          className="p-2 block w-full border-gray-300 rounded-lg shadow-sm bg-gray-50 text-gray-900 sm"
          readOnly
        />
      </div>

      {/* Location */}
      <div className="mb-6">
        <label className="block font-medium text-gray-800 mb-1">Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          className="p-2 block w-full border-gray-300 rounded-lg shadow-sm bg-gray-50 text-gray-900 sm"
          readOnly
        />
      </div>

      {/* Contact Info (Mobile No.) */}
      <div className="mb-6">
        <label className="block font-medium text-gray-800 mb-1">
          Contact Info (Mobile No.)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="tel"
            name="contactInfo"
            value={formData.contactInfo}
            className="flex-1 p-2 block w-full border-gray-300 rounded-lg shadow-sm bg-gray-50 text-gray-900 sm"
            readOnly
          />
        </div>
      </div>

      {/* AI-Generated Price */}
      <div className="mb-6">
        <label className="block font-medium text-gray-800 mb-1">
          AI-Generated Price (per kg)
        </label>
        <input
          type="text"
          name="aiGenPrice"
          value={formData.aiGenPrice}
          className="p-2 block w-full border-gray-300 rounded-lg shadow-sm bg-gray-50 text-gray-900 sm"
          readOnly
        />
      </div>

      {/* Final Price */}
      <div className="mb-6">
        <label className="block font-medium text-gray-800 mb-1">
          Final Price (per kg)
        </label>
        <input
          type="text"
          name="finalPrice"
          value={formData.finalPrice}
          className="p-2 block w-full border-gray-300 rounded-lg shadow-sm bg-gray-50 text-gray-900 sm"
          readOnly
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSubmit}
          disabled={!isStep4Valid}
          className={`px-4 py-2 rounded-lg text-white font-medium ${
            isStep4Valid
              ? "bg-jewel-500 hover:bg-jewel-600"
              : "bg-gray-400 cursor-not-allowed"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jewel-500 transition-colors`}
        >
          Submit Listing
        </button>
      </div>
    </div>
  );
};

export default Step4;

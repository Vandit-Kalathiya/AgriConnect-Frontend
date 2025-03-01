import React from "react";
import PhotoUpload from "./PhotoUpload";

const Step2 = ({
  formData,
  errors,
  handleInputChange,
  handlePhotoUpload,
  removePhoto,
  handleNext,
  handleBack,
  maxPhotos,
}) => {
  const isStep2Valid =
    formData.productPhotos.length > 0 &&
    formData.qualityGrade.trim() &&
    (formData.harvestDate || formData.availabilityDate) &&
    formData.storageConditions.trim() &&
    formData.certifications.trim() &&
    formData.shelfLife.trim() &&
    !isNaN(formData.shelfLife) &&
    Number(formData.shelfLife) > 0;

  return (
    <div className="space-y-6">
      {/* Product Photos */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
        </label>
        <PhotoUpload
          productPhotos={formData.productPhotos}
          handlePhotoUpload={handlePhotoUpload}
          removePhoto={removePhoto}
          maxPhotos={maxPhotos}
        />
        {errors.productPhotos && (
          <p className="mt-1 text-sm text-red-600">{errors.productPhotos}</p>
        )}
      </div>

      {/* Quality Grade */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Quality Grade
        </label>
        <select
          name="qualityGrade"
          value={formData.qualityGrade}
          onChange={handleInputChange}
          className={`mt-1 p-2 block w-full border rounded-lg shadow-sm focus:ring-jewel-500 focus:border-jewel-500 sm:text-sm ${
            errors.qualityGrade
              ? "border-red-500 bg-red-50"
              : "border-gray-300 bg-gray-50"
          }`}
        >
          <option value="Grade A">Grade A</option>
          <option value="Grade B">Grade B</option>
          <option value="Grade C">Grade C</option>
        </select>
        {errors.qualityGrade && (
          <p className="mt-1 text-sm text-red-600">{errors.qualityGrade}</p>
        )}
      </div>

      {/* Harvest Date or Availability Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Harvest Date (if available)
        </label>
        <input
          type="date"
          name="harvestDate"
          value={formData.harvestDate}
          onChange={handleInputChange}
          className={`mt-1 p-2 block w-full border rounded-lg shadow-sm focus:ring-jewel-500 focus:border-jewel-500 sm:text-sm ${
            errors.harvestDate
              ? "border-red-500 bg-red-50"
              : "border-gray-300 bg-gray-50"
          }`}
        />
        {errors.harvestDate && (
          <p className="mt-1 text-sm text-red-600">{errors.harvestDate}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Availability Date (if harvest date not available)
        </label>
        <input
          type="date"
          name="availabilityDate"
          value={formData.availabilityDate}
          onChange={handleInputChange}
          className={`mt-1 p-2 block w-full border rounded-lg shadow-sm focus:ring-jewel-500 focus:border-jewel-500 sm:text-sm ${
            errors.harvestDate
              ? "border-red-500 bg-red-50"
              : "border-gray-300 bg-gray-50"
          }`}
        />
      </div>

      {/* Storage Conditions */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Storage Conditions
        </label>
        <input
          type="text"
          name="storageConditions"
          value={formData.storageConditions}
          onChange={handleInputChange}
          className={`mt-1 p-2 block w-full border rounded-lg shadow-sm focus:ring-jewel-500 focus:border-jewel-500 sm:text-sm ${
            errors.storageConditions
              ? "border-red-500 bg-red-50"
              : "border-gray-300 bg-gray-50"
          }`}
          placeholder="e.g., Temperature controlled, Dry storage"
        />
        {errors.storageConditions && (
          <p className="mt-1 text-sm text-red-600">
            {errors.storageConditions}
          </p>
        )}
      </div>

      {/* Certifications */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Certifications (if any)
        </label>
        <input
          type="text"
          name="certifications"
          value={formData.certifications}
          onChange={handleInputChange}
          className={`mt-1 p-2 block w-full border rounded-lg shadow-sm focus:ring-jewel-500 focus:border-jewel-500 sm:text-sm ${
            errors.certifications
              ? "border-red-500 bg-red-50"
              : "border-gray-300 bg-gray-50"
          }`}
          placeholder="e.g., Organic, Non-GMO"
        />
        {errors.certifications && (
          <p className="mt-1 text-sm text-red-600">{errors.certifications}</p>
        )}
      </div>

      {/* Shelf Life */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Shelf Life (days)
        </label>
        <input
          type="number"
          name="shelfLife"
          value={formData.shelfLife}
          onChange={handleInputChange}
          step="1"
          className={`mt-1 p-2 block w-full border rounded-lg shadow-sm focus:ring-jewel-500 focus:border-jewel-500 sm:text-sm ${
            errors.shelfLife
              ? "border-red-500 bg-red-50"
              : "border-gray-300 bg-gray-50"
          }`}
          placeholder="e.g., 30"
        />
        {errors.shelfLife && (
          <p className="mt-1 text-sm text-red-600">{errors.shelfLife}</p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!isStep2Valid}
          className={`px-4 py-2 rounded-lg text-white font-medium ${
            isStep2Valid
              ? "bg-jewel-500 hover:bg-jewel-600"
              : "bg-gray-400 cursor-not-allowed"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jewel-500 transition-colors`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step2;

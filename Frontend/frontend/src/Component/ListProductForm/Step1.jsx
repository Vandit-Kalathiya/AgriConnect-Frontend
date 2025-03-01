import React from "react";
import PhotoUpload from "./PhotoUpload";

const Step1 = ({
  formData,
  errors,
  handleInputChange,
  handlePhotoUpload,
  removePhoto,
  handleNext,
  maxPhotos,
}) => {
  const isStep1Valid =
    formData.productName.trim() &&
    formData.description.trim() &&
    formData.quantity.trim() &&
    !isNaN(formData.quantity) &&
    Number(formData.quantity) > 0 &&
    formData.unitOfQuantity.trim();

  return (
    <div className="space-y-6">
      {/* Product Name */}
      <div>
        <label
          htmlFor="productName"
          className="block text-sm font-medium text-gray-700"
        >
          Product Name
        </label>
        <input
          type="text"
          id="productName"
          name="productName"
          value={formData.productName}
          onChange={handleInputChange}
          className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-jewel-500 focus:border-jewel-500 sm:text-sm ${
            errors.productName
              ? "border-red-500 bg-red-50"
              : "border-gray-300 bg-gray-50"
          }`}
          placeholder="Enter product name"
        />
        {errors.productName && (
          <p className="mt-1 text-sm text-red-600">{errors.productName}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows="4"
          className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-jewel-500 focus:border-jewel-500 sm:text-sm ${
            errors.description
              ? "border-red-500 bg-red-50"
              : "border-gray-300 bg-gray-50"
          }`}
          placeholder="Describe your product"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      {/* Quantity */}
      <div>
        <label
          htmlFor="quantity"
          className="block text-sm font-medium text-gray-700"
        >
          Quantity
        </label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          value={formData.quantity}
          onChange={handleInputChange}
          step="1"
          className={`mt-1 p-2 block w-full border rounded-lg shadow-sm focus:ring-jewel-500 focus:border-jewel-500 sm:text-sm ${
            errors.quantity
              ? "border-red-500 bg-red-50"
              : "border-gray-300 bg-gray-50"
          }`}
          placeholder="e.g., 500"
        />
        {errors.quantity && (
          <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
        )}
      </div>

      {/* Unit of Quantity */}
      <div>
        <label
          htmlFor="unitOfQuantity"
          className="block text-sm font-medium text-gray-700"
        >
          Unit of Quantity
        </label>
        <select
          id="unitOfQuantity"
          name="unitOfQuantity"
          value={formData.unitOfQuantity}
          onChange={handleInputChange}
          className={`mt-1 p-2 block w-full border rounded-lg shadow-sm focus:ring-jewel-500 focus:border-jewel-500 sm:text-sm ${
            errors.unitOfQuantity
              ? "border-red-500 bg-red-50"
              : "border-gray-300 bg-gray-50"
          }`}
        >
          <option value="kg">kg</option>
          <option value="ton">ton</option>
          <option value="quintal">quintal</option>
          <option value="per 20 kg">per 20 kg</option>
        </select>
        {errors.unitOfQuantity && (
          <p className="mt-1 text-sm text-red-600">{errors.unitOfQuantity}</p>
        )}
      </div>

      {/* Next Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleNext}
          disabled={!isStep1Valid}
          className={`px-4 py-2 rounded-lg text-white font-medium ${
            isStep1Valid
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

export default Step1;

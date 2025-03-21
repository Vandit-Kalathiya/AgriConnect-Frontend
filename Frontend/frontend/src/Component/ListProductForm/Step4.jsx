import React from "react";
import {
  FaPhone,
  FaCalendarAlt,
  FaLeaf,
  FaWarehouse,
  FaClock,
  FaMapMarkerAlt,
  FaMoneyBillWave,
} from "react-icons/fa";

const Step4 = ({ formData, errors, handleBack, handleSubmit }) => {
  const isStep4Valid = true;

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-sm w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Preview Your Listing
      </h2>

      <div className="grid grid-cols-12 gap-6 h-full">
        {/* Left Column - Images */}
        <div className="col-span-5 space-y-4">
          {/* Product Photos - All photos visible in a gallery */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Product Photos
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {formData.productPhotos.map((photo, index) => (
                <img
                  key={index}
                  src={photo.preview}
                  alt={`Preview ${index + 1}`}
                  className="h-36 w-full object-cover rounded-lg shadow-sm"
                />
              ))}
              {/* Add empty placeholders if less than 5 photos */}
              {Array.from({
                length: Math.max(0, 5 - formData.productPhotos.length),
              }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="h-36 w-full rounded-lg bg-gray-100 flex items-center justify-center border border-dashed border-gray-300"
                >
                  <span className="text-gray-400 text-sm">
                    Photo {formData.productPhotos.length + index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="col-span-7">
          {/* Product Name and Description */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              {formData.productName}
            </h3>
            <div className="flex items-center mt-1 text-sm text-gray-600">
              <FaLeaf className="mr-1" />
              <span>{formData.cropType}</span>
            </div>
            <p className="mt-2 text-gray-700">{formData.description}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Product Details
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {/* Quantity */}
              <div className="flex items-start">
                <div className="w-8 h-8 bg-jewel-100 rounded-full flex items-center justify-center mr-3">
                  <FaWarehouse className="text-jewel-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Quantity</div>
                  <div className="font-medium">{`${formData.quantity} ${formData.unitOfQuantity}`}</div>
                </div>
              </div>

              {/* Harvest/Availability Date */}
              <div className="flex items-start">
                <div className="w-8 h-8 bg-jewel-100 rounded-full flex items-center justify-center mr-3">
                  <FaCalendarAlt className="text-jewel-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">
                    {formData.harvestDate
                      ? "Harvest Date"
                      : "Availability Date"}
                  </div>
                  <div className="font-medium">
                    {formData.harvestDate || formData.availabilityDate}
                  </div>
                </div>
              </div>

              {/* Storage Conditions */}
              <div className="flex items-start">
                <div className="w-8 h-8 bg-jewel-100 rounded-full flex items-center justify-center mr-3">
                  <FaWarehouse className="text-jewel-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Storage</div>
                  <div className="font-medium">
                    {formData.storageConditions}
                  </div>
                </div>
              </div>

              {/* Shelf Life */}
              <div className="flex items-start">
                <div className="w-8 h-8 bg-jewel-100 rounded-full flex items-center justify-center mr-3">
                  <FaClock className="text-jewel-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Shelf Life</div>
                  <div className="font-medium">{formData.shelfLife} days</div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start">
                <div className="w-8 h-8 bg-jewel-100 rounded-full flex items-center justify-center mr-3">
                  <FaMapMarkerAlt className="text-jewel-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Location</div>
                  <div className="font-medium">{formData.location}</div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex items-start">
                <div className="w-8 h-8 bg-jewel-100 rounded-full flex items-center justify-center mr-3">
                  <FaPhone className="text-jewel-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Contact</div>
                  <div className="font-medium">{formData.contactInfo}</div>
                </div>
              </div>
            </div>

            {/* Pricing Panel */}
            <div className="bg-jewel-50 p-4 rounded-lg shadow-sm border border-jewel-100 mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Pricing
              </h3>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-600">
                    AI-Suggested Price
                  </div>
                  <div className="text-lg font-semibold text-jewel-700">
                    {formData.aiGeneratedPrice}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Your Price</div>
                  <div className="text-xl font-bold text-jewel-800">
                    {formData.finalPrice}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handleBack}
          className="px-5 py-2 rounded-lg border border-jewel-300 bg-white text-jewel-700 hover:bg-jewel-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!isStep4Valid}
          className="px-6 py-2 rounded-lg text-white font-medium bg-jewel-500 hover:bg-jewel-600 transition-colors shadow-sm"
        >
          List Product
        </button>
      </div>
    </div>
  );
};

export default Step4;

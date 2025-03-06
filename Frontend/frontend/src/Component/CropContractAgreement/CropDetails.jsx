import React from "react";

const CropDetails = ({ formData, userType, setFormData }) => {
  return (
    <div className="space-y-6 max-w-2xl mx-auto bg-white p-6">
      <div className="border-b pb-2 mb-4">
        <h2 className="text-lg font-semibold text-jewel-700 flex items-center gap-x-2">
          <span className="bg-jewel-100 h-6 w-6 flex items-center justify-center rounded-full text-sm">
            2
          </span>
          Crop Details
        </h2>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block font-medium text-sm mb-1 text-gray-700">
            Crop Type
          </label>
          <div className="relative">
            <select
              className="w-full p-2 pl-3 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none appearance-none transition-all duration-200 bg-white"
              value={formData.cropDetails.type}
              disabled={userType === "buyer"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  cropDetails: {
                    ...formData.cropDetails,
                    type: e.target.value,
                  },
                })
              }
            >
              <option value="Organic Tomatoes">Organic Tomatoes</option>
              <option value="Organic Potatoes">Organic Potatoes</option>
              <option value="Organic Lettuce">Organic Lettuce</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-jewel-500">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-sm mb-1 text-gray-700">
              Variety/Grade
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
              value={formData.cropDetails.variety}
              disabled={userType === "buyer"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  cropDetails: {
                    ...formData.cropDetails,
                    variety: e.target.value,
                  },
                })
              }
              placeholder="e.g., Roma, Cherry, Beefsteak"
            />
          </div>
          <div>
            <label className="block font-medium text-sm mb-1 text-gray-700">
              Quantity
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
              value={formData.cropDetails.quantity}
              disabled={userType === "buyer"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  cropDetails: {
                    ...formData.cropDetails,
                    quantity: e.target.value,
                  },
                })
              }
              placeholder="e.g., 500 kg, 2 tons"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium text-sm mb-1 text-gray-700">
            Price per Unit
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <input
              type="text"
              className="w-full p-2 pl-8 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
              value={formData.cropDetails.pricePerUnit}
              disabled={userType === "buyer"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  cropDetails: {
                    ...formData.cropDetails,
                    pricePerUnit: e.target.value,
                  },
                })
              }
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="bg-jewel-50 p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              Total Value:
            </span>
            <span className="font-semibold text-jewel-700">
              $
              {(
                parseFloat(formData.cropDetails.pricePerUnit || 0) *
                parseFloat(formData.cropDetails.quantity || 0)
              ).toFixed(2)}
            </span>
          </div>
        </div>

        <div>
          <label className="block font-medium text-sm mb-1 text-gray-700">
            Quality Standards & Specifications
          </label>
          <div className="border rounded-lg p-3 max-h-36 overflow-y-auto bg-gray-50">
            {formData.cropDetails.qualityStandards.length > 0 ? (
              formData.cropDetails.qualityStandards.map((standard, index) => (
                <div key={index} className="mb-2 flex items-start">
                  <div className="h-5 w-5 text-jewel-500 mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">{standard}</span>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-sm italic">
                No quality standards specified
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropDetails;

import React from "react";

const DeliveryTerms = ({ formData, userType, setFormData }) => {
  return (
    <div className="space-y-6 max-w-2xl mx-auto bg-white p-6">
      <div className="border-b pb-2 mb-4">
        <h2 className="text-lg font-semibold text-jewel-700 flex items-center gap-x-2">
          <span className="bg-jewel-100 h-6 w-6 flex items-center justify-center rounded-full text-sm">
            3
          </span>
          Delivery Terms
        </h2>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-sm mb-1 text-gray-700">
              Delivery Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-4 w-4 text-jewel-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <input
                type="date"
                className="w-full p-2 pl-10 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
                value={formData.deliveryTerms.date}
                disabled={userType === "buyer"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    deliveryTerms: {
                      ...formData.deliveryTerms,
                      date: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">46 days from today</div>
          </div>

          <div>
            <label className="block font-medium text-sm mb-1 text-gray-700">
              Delivery Location
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-4 w-4 text-jewel-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                className="w-full p-2 pl-10 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
                value={formData.deliveryTerms.location}
                disabled={userType === "buyer"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    deliveryTerms: {
                      ...formData.deliveryTerms,
                      location: e.target.value,
                    },
                  })
                }
                placeholder="Enter delivery address"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block font-medium text-sm mb-2 text-gray-700">
            Transportation Responsibility
          </label>
          <div className="grid grid-cols-3 gap-2">
            {["Farmer", "Buyer", "Shared"].map((option) => (
              <div
                key={option}
                className={`
                  border rounded-lg p-3 text-center cursor-pointer transition-all duration-200
                  ${
                    formData.deliveryTerms.transportation === option
                      ? "bg-jewel-50 border-jewel-300 text-jewel-700"
                      : "bg-white hover:bg-gray-50"
                  }
                  ${
                    userType === "buyer" ? "opacity-80 pointer-events-none" : ""
                  }
                `}
                onClick={() => {
                  if (userType !== "buyer") {
                    setFormData({
                      ...formData,
                      deliveryTerms: {
                        ...formData.deliveryTerms,
                        transportation: option,
                      },
                    });
                  }
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <div
                    className={`h-4 w-4 rounded-full border ${
                      formData.deliveryTerms.transportation === option
                        ? "border-jewel-500 bg-jewel-500"
                        : "border-gray-400"
                    }`}
                  >
                    {formData.deliveryTerms.transportation === option && (
                      <div className="h-2 w-2 rounded-full bg-white m-auto mt-0.5"></div>
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-medium text-sm mb-1 text-gray-700">
            Packaging Requirements
          </label>
          <textarea
            className="w-full p-3 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200 min-h-24"
            value={formData.deliveryTerms.packaging}
            disabled={userType === "buyer"}
            onChange={(e) =>
              setFormData({
                ...formData,
                deliveryTerms: {
                  ...formData.deliveryTerms,
                  packaging: e.target.value,
                },
              })
            }
            placeholder="Specify packaging type, materials, weight limits, etc."
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-start gap-3">
            <div className="text-jewel-500 mt-0.5">
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-800">
                Delivery Instructions
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                All deliveries must be scheduled at least 24 hours in advance.
                Upon arrival, please contact the receiving department at the
                provided number.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryTerms;

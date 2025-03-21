import React, { useState, useEffect } from "react";

const DeliveryTerms = ({ formData, userType, setFormData }) => {
  const [dateError, setDateError] = useState("");
  const [warnings, setWarnings] = useState([]);

  // Format today's date as YYYY-MM-DD for the date input min attribute
  const today = new Date().toISOString().split("T")[0];

  // Validate date whenever it changes
  useEffect(() => {
    validateDate(formData.deliveryTerms.date);
    checkWarnings();
  }, [formData.deliveryTerms]);

  const validateDate = (date) => {
    if (!date) {
      setDateError("Delivery date is required");
      return false;
    }

    const selectedDate = new Date(date);
    const currentDate = new Date(today);

    if (selectedDate < currentDate) {
      setDateError("Delivery date cannot be in the past");
      return false;
    }

    setDateError("");
    return true;
  };

  const checkWarnings = () => {
    const newWarnings = [];

    // Add warnings based on form data
    if (!formData.deliveryTerms.location) {
      newWarnings.push("Delivery location is required");
    }

    if (!formData.deliveryTerms.transportation) {
      newWarnings.push("Transportation responsibility must be selected");
    }

    if (!formData.deliveryTerms.packaging) {
      newWarnings.push("Packaging requirements should be specified");
    }

    setWarnings(newWarnings);
  };

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

      {warnings.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="text-red-500 mt-0.5">
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Please address the following issues:
              </h3>
              <ul className="text-xs text-red-700 mt-1 list-disc pl-4">
                {warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-sm mb-1 text-gray-700">
              Delivery Date <span className="text-red-500">*</span>
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
                min={today}
                className={`w-full p-2 pl-10 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200 ${
                  dateError ? "border-red-500" : ""
                }`}
                value={formData.deliveryTerms.date}
                disabled={userType === "buyer"}
                onChange={(e) => {
                  const newDate = e.target.value;
                  setFormData({
                    ...formData,
                    deliveryTerms: {
                      ...formData.deliveryTerms,
                      date: newDate,
                    },
                  });
                }}
              />
            </div>
            {dateError ? (
              <div className="text-xs text-red-500 mt-1">{dateError}</div>
            ) : (
              formData.deliveryTerms.date && (
                <div className="text-xs text-gray-500 mt-1">
                  {Math.ceil(
                    (new Date(formData.deliveryTerms.date) - new Date()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  days from today
                </div>
              )
            )}
          </div>

          <div>
            <label className="block font-medium text-sm mb-1 text-gray-700">
              Delivery Location <span className="text-red-500">*</span>
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
                className={`w-full p-2 pl-10 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200 ${
                  !formData.deliveryTerms.location ? "border-red-300" : ""
                }`}
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
            Transportation Responsibility{" "}
            <span className="text-red-500">*</span>
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
                    !formData.deliveryTerms.transportation
                      ? "border-red-300"
                      : ""
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
            Packaging Requirements <span className="text-red-500">*</span>
          </label>
          <textarea
            className={`w-full p-3 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200 min-h-24 ${
              !formData.deliveryTerms.packaging ? "border-red-300" : ""
            }`}
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

        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-start gap-3">
            <div className="text-red-500 mt-0.5">
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Important Delivery Warnings
              </h3>
              <ul className="text-xs text-red-700 mt-1 list-disc pl-4">
                <li>
                  Late deliveries may result in penalties of up to 5% of the
                  contract value.
                </li>
                <li>
                  All products must pass quality inspection upon delivery -
                  damaged goods will be rejected.
                </li>
                <li>
                  Temperature-sensitive products must maintain the required
                  temperature range during transit.
                </li>
                <li>
                  Delivery vehicles must comply with all sanitation requirements
                  for agricultural products.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryTerms;

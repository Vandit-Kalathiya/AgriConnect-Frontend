import React, { useState } from "react";
import ConfirmationPopup from "./ConfirmationPopup";

const TermsAndConditions = ({
  formData,
  userType,
  setFormData,
  onSaveAndNext,
  handleContractUpload,
  prevStep,
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleSaveAndNext = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleProceedToPayment = () => {
    console.log('in handleProceedToPayment');
    handleContractUpload();
    setIsPopupOpen(false);
    // onSaveAndNext(); // This would be the function that redirects to payment gateway
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Terms & Conditions Section */}
      <div>
        <div className="flex items-center mb-4">
          <div className="bg-jewel-100 text-jewel-700 rounded-full w-10 h-10 flex items-center justify-center mr-3 font-bold shadow-sm">
            5
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Terms & Conditions
          </h2>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden transition-all hover:shadow-lg">
          <div className="p-5 bg-gradient-to-r from-jewel-50 to-gray-50 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-medium text-gray-800 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-jewel-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Contract Terms
            </h3>
            <span className="text-xs bg-jewel-100 text-jewel-600 px-3 py-1 rounded-full font-medium">
              Required
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto p-5 bg-white">
            {formData.termsConditions.map((term, index) => (
              <div
                key={term.id}
                className={`mb-6 pb-6 ${
                  index < formData.termsConditions.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                <div className="font-semibold text-gray-800 mb-2 flex items-start">
                  <span className="bg-jewel-100 text-jewel-700 rounded-full w-7 h-7 flex items-center justify-center text-sm mr-3 flex-shrink-0 shadow-sm">
                    {term.id}
                  </span>
                  <span className="text-lg">{term.title}</span>
                </div>
                <div className="text-gray-600 pl-10 leading-relaxed">
                  {term.content}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-jewel-50 border-t border-gray-200 text-sm text-gray-700 italic flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-jewel-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            By proceeding, you acknowledge that you have read and agree to these
            terms.
          </div>
        </div>
      </div>

      {/* Additional Notes Section */}
      <div>
        <div className="flex items-center mb-4">
          <div className="bg-jewel-100 text-jewel-700 rounded-full w-10 h-10 flex items-center justify-center mr-3 font-bold shadow-sm">
            6
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Additional Notes
          </h2>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden transition-all hover:shadow-lg">
          <div className="p-5 bg-gradient-to-r from-jewel-50 to-gray-50 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-medium text-gray-800 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-jewel-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Special Instructions or Comments
            </h3>
            <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full font-medium">
              Optional
            </span>
          </div>

          <div className="p-5 bg-white">
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg h-36 focus:ring-2 focus:ring-jewel-400 focus:border-jewel-500 focus:outline-none resize-none transition-all"
              value={formData.additionalNotes}
              disabled={userType === "buyer"}
              onChange={(e) =>
                setFormData({ ...formData, additionalNotes: e.target.value })
              }
              placeholder={
                userType === "buyer"
                  ? "No additional notes provided by the farmer"
                  : "Add any special instructions, requirements or information..."
              }
            />
            {userType === "buyer" && (
              <div className="mt-3 text-sm text-gray-600 flex items-center bg-gray-50 p-3 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-gray-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 116 0z"
                    clipRule="evenodd"
                  />
                </svg>
                This field can only be edited by the farmer
              </div>
            )}
            {userType === "farmer" && (
              <div className="mt-3 text-sm text-gray-500 flex justify-between items-center">
                <div>
                  <span
                    className={
                      formData.additionalNotes.length > 450
                        ? "text-amber-600 font-medium"
                        : ""
                    }
                  >
                    {formData.additionalNotes.length}
                  </span>{" "}
                  / 500 characters
                </div>
                {formData.additionalNotes.length > 450 && (
                  <div className="text-amber-600">
                    {500 - formData.additionalNotes.length} characters remaining
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Warning Message */}
      <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-lg shadow-md">
        <div className="flex items-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-red-600 mt-0.5 mr-3 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <h4 className="text-lg font-semibold text-red-700 mb-1">
              Legal Notice
            </h4>
            <p className="text-red-600 font-medium">
              Please read all terms and conditions very carefully. Violation of
              any terms or conditions outlined in this agreement may result in
              legal action being taken against you.
            </p>
          </div>
        </div>
      </div>

      {/* Save & Next Button */}

      <div className="flex justify-between items-center">
        <div>
          <button
            onClick={prevStep}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300"
          >
            Back
          </button>
        </div>
        <button
          onClick={handleSaveAndNext}
          className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-jewel-500 focus:ring-offset-2 transition-colors"
        >
          Save & Next
        </button>
      </div>

      {/* Confirmation Popup */}
      <ConfirmationPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        onProceed={handleProceedToPayment}
        formData={formData}
        handleMakePayment={handleContractUpload}
      />
    </div>
  );
};

export default TermsAndConditions;

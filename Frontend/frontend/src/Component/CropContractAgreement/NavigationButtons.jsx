import React from "react";

const NavigationButtons = ({
  currentStep,
  userType,
  prevStep,
  nextStep,
  handleSaveAndNext,
  handleSubmit,
  loading,
  farmerSignature,
  buyerSignature,
}) => {
  if (userType === "buyer") {
    return (
      <div className="flex justify-between pt-6">
        <div>
          {currentStep > 1 && (
            <button
              onClick={prevStep}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300"
            >
              Back
            </button>
          )}
        </div>

        <div className="flex space-x-3">
          {currentStep === 1 && (
            <button
              onClick={handleSaveAndNext}
              className="bg-jewel-600 text-white px-4 py-2 rounded hover:bg-jewel-700"
            >
              Save and Next
            </button>
          )}

          {currentStep > 1 && currentStep < 6 && (
            <button
              onClick={nextStep}
              className="bg-jewel-600 text-white px-4 py-2 rounded hover:bg-jewel-700"
            >
              Next
            </button>
          )}

          {currentStep === 6 && (
            <button
              onClick={handleSubmit}
              disabled={loading || !farmerSignature || !buyerSignature}
              className={`bg-jewel-600 text-white px-4 py-2 rounded hover:bg-jewel-700 ${
                loading || !farmerSignature || !buyerSignature
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>
      </div>
    );
  } else {
    // Farmer
    return (
      <div className="flex justify-between pt-6">
        <div>
          {currentStep > 1 && (
            <button
              onClick={prevStep}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300"
            >
              Back
            </button>
          )}
        </div>

        <div className="flex space-x-3">
          {currentStep === 1 && (
            <button
              onClick={handleSaveAndNext}
              className="bg-jewel-600 text-white px-4 py-2 rounded hover:bg-jewel-700"
            >
              Save and Next
            </button>
          )}

          {currentStep > 1 && currentStep < 6 && (
            <button
              onClick={handleSaveAndNext}
              className="bg-jewel-600 text-white px-4 py-2 rounded hover:bg-jewel-700"
            >
              Save and Next
            </button>
          )}

          {currentStep === 6 && (
            <div className="flex flex-col space-y-4">
              <button
                onClick={handleSubmit}
                disabled={loading || !farmerSignature || !buyerSignature}
                className={`bg-jewel-600 text-white px-4 py-2 rounded hover:bg-jewel-700 ${
                  loading || !farmerSignature || !buyerSignature
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {loading ? "Submitting..." : "Generate Contract"}
              </button>
            </div>
          )}

          {currentStep === 6 && (
            <button
              onClick={handleSaveAndNext}
              className="bg-jewel-600 text-white px-4 py-2 rounded hover:bg-jewel-700"
            >
              Save and Next
            </button>
          )}
        </div>
      </div>
    );
  }
};

export default NavigationButtons;

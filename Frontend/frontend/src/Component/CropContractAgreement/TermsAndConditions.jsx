import React from "react";

const TermsAndConditions = ({ formData, userType, setFormData }) => {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center mb-4">
          <div className="bg-jewel-100 text-jewel-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 font-bold">
            5
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Terms & Conditions
          </h2>
        </div>

        <div className="bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-medium text-gray-700">Contract Terms</h3>
            <span className="text-xs bg-jewel-100 text-jewel-600 px-2 py-1 rounded-full">
              Required
            </span>
          </div>

          <div className="max-h-72 overflow-y-auto p-4">
            {formData.termsConditions.map((term, index) => (
              <div
                key={term.id}
                className={`mb-4 pb-4 ${
                  index < formData.termsConditions.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                <div className="font-semibold text-gray-800 mb-1 flex items-start">
                  <span className="bg-jewel-50 text-jewel-600 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2 flex-shrink-0">
                    {term.id}
                  </span>
                  <span>{term.title}</span>
                </div>
                <div className="text-gray-600 pl-8">{term.content}</div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-jewel-50 border-t border-gray-200 text-xs text-gray-500 italic">
            By proceeding, you acknowledge that you have read and agree to these
            terms.
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center mb-4">
          <div className="bg-jewel-100 text-jewel-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 font-bold">
            6
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Additional Notes
          </h2>
        </div>

        <div className="bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-medium text-gray-700">
              Special Instructions or Comments
            </h3>
            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
              Optional
            </span>
          </div>

          <div className="p-4">
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none resize-none transition-all"
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
              <div className="mt-2 text-sm text-gray-500 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
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
              <div className="mt-2 text-xs text-gray-500">
                {formData.additionalNotes.length} / 500 characters
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;

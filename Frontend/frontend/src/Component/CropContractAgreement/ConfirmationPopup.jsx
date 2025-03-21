import React, { useState } from "react";

const ConfirmationPopup = ({
  isOpen,
  onClose,
  onProceed,
  formData,
  handleMakePayment,
}) => {
  const [isAgreed, setIsAgreed] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-jewel-50 to-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2 text-jewel-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Confirm Your Order
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-grow">
          {/* Legal Agreement Box */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-5 mb-6">
            <div className="flex items-center mb-4">
              <div className="rounded-full w-8 h-8 flex items-center justify-center mr-3 bg-jewel-100 text-jewel-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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
              </div>
              <h3 className="text-lg font-medium text-gray-800">
                Legal Agreement
              </h3>
            </div>

            <p className="text-gray-700 leading-relaxed">
              By uploading your signature, you confirm that you have read and
              agree to all terms and conditions outlined in this contract. This
              digital signature carries the same legal weight as a physical
              signature.
            </p>
          </div>

          {/* Summary Section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              Order Summary
            </h3>
            <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
              {formData.termsConditions.map((term, index) => (
                <div key={index} className="p-4 flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-jewel-600 mr-3 mt-0.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-800">{term.title}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {term.content.length > 100
                        ? `${term.content.substring(0, 100)}...`
                        : term.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
            <div className="flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0"
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
              <div>
                <h4 className="font-medium text-blue-800 mb-1">
                  Next Steps: Payment
                </h4>
                <p className="text-blue-700 text-sm">
                  After confirming, you'll be directed to our secure payment
                  gateway. We accept credit/debit cards, bank transfers, and
                  digital wallets. Your transaction is protected with
                  industry-standard encryption.
                </p>
              </div>
            </div>
          </div>

          {/* Checkbox confirmation */}
          <div className="flex items-start mb-2">
            <input
              type="checkbox"
              id="terms-agree"
              className="mt-1 h-4 w-4 text-jewel-600 focus:ring-jewel-500 border-gray-300 rounded"
              checked={isAgreed}
              onChange={() => setIsAgreed(!isAgreed)}
            />
            <label htmlFor="terms-agree" className="ml-2 text-sm text-gray-700">
              I confirm that I have read and agree to all terms and conditions
              outlined in this contract. I understand that proceeding
              constitutes a legally binding agreement.
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="p-5 bg-gray-50 border-t border-gray-200 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jewel-500"
          >
            Review Again
          </button>
          <button
            onClick={onProceed}
            disabled={!isAgreed}
            className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jewel-500 ${
              isAgreed
                ? "bg-jewel-600 hover:bg-jewel-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Make Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;

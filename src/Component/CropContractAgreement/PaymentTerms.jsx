import React from "react";

const PaymentTerms = ({ formData, userType, setFormData }) => {
  const isBuyer = userType === "buyer";

  return (
    <div className="bg-white p-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-xl font-semibold text-jewel-700 flex items-center">
          <span className="bg-jewel-100 text-jewel-700 w-8 h-8 rounded-full flex items-center justify-center mr-3">
            4
          </span>
          Payment Terms
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Total Contract Value
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              ₹
            </span>
            <input
              type="text"
              className={`w-full pl-8 p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-colors ${
                isBuyer ? "bg-gray-100 text-gray-700" : "hover:bg-white"
              }`}
              value={formData.paymentTerms.totalValue}
              disabled={isBuyer}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  paymentTerms: {
                    ...formData.paymentTerms,
                    totalValue: e.target.value,
                  },
                })
              }
              placeholder="0.00"
            />
          </div>
          {!isBuyer && (
            <p className="text-xs text-gray-500 mt-1">
              Enter the full contract amount
            </p>
          )}
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <div className="w-full p-3 border rounded-lg bg-gray-50 text-gray-700">
            Bank Transfer (Online)
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Secure online bank transfer only
          </p>
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Advance Payment
          </label>
          <div className="w-full p-3 border rounded-lg bg-gray-50 text-gray-700 relative">
            100%
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
              %
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Full payment required in advance
          </p>
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Balance Payment Due
          </label>
          <div className="w-full p-3 border rounded-lg bg-gray-50 text-gray-700">
            On Delivery
          </div>
          <p className="text-xs text-gray-500 mt-1">
            No remaining balance (paid in full)
          </p>
        </div>
      </div>

      <div className="mt-8 bg-jewel-50 p-4 rounded-lg border border-jewel-100">
        <h3 className="font-medium text-jewel-700 mb-3">
          Payment Terms & Security
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start">
            <svg
              className="h-5 w-5 text-jewel-500 mr-2 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span>
              All transactions are processed through our secure payment gateway
              with encryption
            </span>
          </li>
          <li className="flex items-start">
            <svg
              className="h-5 w-5 text-jewel-500 mr-2 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span>
              Payment confirmation will be sent automatically to your registered
              email
            </span>
          </li>
          <li className="flex items-start">
            <svg
              className="h-5 w-5 text-jewel-500 mr-2 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span>
              Funds are held in escrow until delivery confirmation to protect
              both parties
            </span>
          </li>
          <li className="flex items-start">
            <svg
              className="h-5 w-5 text-jewel-500 mr-2 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span>
              Invoice and payment receipts are automatically generated for
              accounting purposes
            </span>
          </li>
        </ul>
      </div>

      <div className="mt-4 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
        <div className="flex items-start">
          <svg
            className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
              clipRule="evenodd"
            ></path>
          </svg>
          <div>
            <h3 className="font-medium text-yellow-800 mb-1">
              Important Notice
            </h3>
            <p className="text-sm text-yellow-700">
              Never share your bank details outside of our secure payment
              platform. All legitimate payment requests will be processed
              through this system only. If you suspect any fraudulent activity,
              please contact our support team immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTerms;

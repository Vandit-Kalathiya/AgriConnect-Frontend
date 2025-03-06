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
              $
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
          <select
            className={`w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-colors ${
              isBuyer ? "bg-gray-100 text-gray-700" : "hover:bg-white"
            }`}
            value={formData.paymentTerms.method}
            disabled={isBuyer}
            onChange={(e) =>
              setFormData({
                ...formData,
                paymentTerms: {
                  ...formData.paymentTerms,
                  method: e.target.value,
                },
              })
            }
          >
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Check">Check</option>
            <option value="Cash">Cash</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Wire Transfer">Wire Transfer</option>
          </select>
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Advance Payment (%)
          </label>
          <div className="relative">
            <input
              type="text"
              className={`w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-colors ${
                isBuyer ? "bg-gray-100 text-gray-700" : "hover:bg-white"
              }`}
              value={formData.paymentTerms.advancePayment}
              disabled={isBuyer}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  paymentTerms: {
                    ...formData.paymentTerms,
                    advancePayment: e.target.value,
                  },
                })
              }
              placeholder="0"
            />
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
              %
            </span>
          </div>
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Balance Payment Due
          </label>
          <select
            className={`w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-colors ${
              isBuyer ? "bg-gray-100 text-gray-700" : "hover:bg-white"
            }`}
            value={formData.paymentTerms.balanceDue}
            disabled={isBuyer}
            onChange={(e) =>
              setFormData({
                ...formData,
                paymentTerms: {
                  ...formData.paymentTerms,
                  balanceDue: e.target.value,
                },
              })
            }
          >
            <option value="On Delivery">On Delivery</option>
            <option value="Net 15">Net 15 (15 days)</option>
            <option value="Net 30">Net 30 (30 days)</option>
            <option value="Net 45">Net 45 (45 days)</option>
            <option value="Net 60">Net 60 (60 days)</option>
          </select>
        </div>
      </div>

      {!isBuyer && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            type="button"
            className="px-4 py-2 bg-jewel-100 text-jewel-700 rounded-md hover:bg-jewel-200 transition-colors text-sm font-medium"
            onClick={() => {
              /* Add custom payment terms handler */
            }}
          >
            + Add Custom Payment Terms
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentTerms;

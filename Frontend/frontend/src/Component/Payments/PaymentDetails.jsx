import React from "react";

const PaymentDetails = ({ amount }) => {
  return (
    <div className="bg-emerald-50 p-4 rounded-md border border-emerald-200">
      <div className="mb-4">
        <h3 className="font-medium text-emerald-800 mb-2">Order Details</h3>
        <p className="text-sm text-gray-700">
          This is a secure payment for your agricultural order. The funds will
          be held in escrow until you verify the delivery.
        </p>
      </div>

      <label className="block font-medium mb-2">Payment Amount</label>
      <input
        type="text"
        value={`₹ ${amount?.toLocaleString()}`}
        readOnly
        className="w-full px-3 py-2 border border-gray-300 rounded-md font-semibold text-lg text-emerald-700 bg-gray-50"
      />
      <p className="text-xs text-gray-500 mt-1">
        This is the total order value that will be processed through our secure
        payment gateway
      </p>
    </div>
  );
};

export default PaymentDetails;

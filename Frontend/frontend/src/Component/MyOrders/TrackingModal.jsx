import React from "react";
import { FaTruck } from "react-icons/fa";

const TrackingModal = ({
  closeTrackingModal,
  trackingNumber,
  setTrackingNumber,
  selectedOrderId,
  orders,
  handleFarmerAction,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
        <h2 className="text-xl font-bold text-green-800 mb-4">
          Confirm Delivery
        </h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tracking Number
          </label>
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-green-300 focus:border-green-500"
            placeholder="Enter tracking number"
          />
          <p className="text-xs text-gray-500 mt-1">
            Provide the tracking number from your shipping provider.
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={closeTrackingModal}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!trackingNumber.trim()) {
                toast.error("Please enter a tracking number");
                return;
              }
              const order = orders.find((o) => o.id === selectedOrderId);
              handleFarmerAction(order.pdfHash, "delivered", trackingNumber);
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
          >
            <FaTruck className="mr-2" />
            Confirm Delivery
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackingModal;

import React from "react";
import { FaTruck, FaCamera, FaExclamationTriangle } from "react-icons/fa";

const TrackingModal = ({
  closeTrackingModal,
  trackingNumber,
  setTrackingNumber,
  selectedOrderId,
  orders,
  handleFarmerAction,
}) => {
  const [deliveryProof, setDeliveryProof] = React.useState(null);
  const [deliveryNotes, setDeliveryNotes] = React.useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      (file.type.startsWith("image/") || file.type === "application/pdf")
    ) {
      setDeliveryProof(file);
    } else {
      toast.error("Please upload an image or PDF file");
    }
  };

  const handleConfirmDelivery = () => {
    if (!trackingNumber.trim()) {
      toast.error("Tracking number is required");
      return;
    }
    if (!deliveryProof) {
      toast.error("Delivery proof document is required");
      return;
    }
    const order = orders.find((o) => o.id === selectedOrderId);
    const deliveryData = {
      trackingNumber,
      deliveryProof,
      deliveryNotes,
      // timestamp: new Date().toISOString(),
    };
    handleFarmerAction(order.id, "delivered", deliveryData);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-lg w-full shadow-2xl transform transition-all duration-300 scale-100 hover:scale-[1.01]">
        <h2 className="text-2xl font-bold text-green-700 mb-6 flex items-center">
          <FaTruck className="mr-2" /> Confirm Delivery
        </h2>

        {/* Warning Section */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-3 rounded-r-lg">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-yellow-600 mr-2" />
            <p className="text-sm text-yellow-700">
              <span className="font-semibold">Important:</span> Providing
              accurate delivery information is crucial. False confirmations may
              lead to account suspension.
            </p>
          </div>
        </div>

        {/* Tracking Number */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tracking Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            placeholder="Enter tracking number"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the official tracking number from your shipping provider
          </p>
        </div>

        {/* Delivery Proof Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Proof of Delivery <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*,application/pdf"
              className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            <FaCamera className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Upload a photo of the delivered package or shipping receipt
            (Image/PDF)
          </p>
        </div>

        {/* Delivery Notes */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Notes (Optional)
          </label>
          <textarea
            value={deliveryNotes}
            onChange={(e) => setDeliveryNotes(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            placeholder="Add any additional notes (e.g., delivery location, recipient name)"
            rows="3"
          />
        </div>

        {/* Recommendations */}
        <div className="bg-green-50 p-4 rounded-lg mb-6">
          <h3 className="text-sm font-semibold text-green-800 mb-2">
            Recommendations:
          </h3>
          <ul className="text-xs text-green-700 list-disc list-inside">
            <li>Take a clear photo of the package at the delivery location</li>
            <li>Verify tracking number with your shipping provider</li>
            <li>Include recipient's name or signature if possible</li>
            <li>Keep records of all delivery documentation</li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={closeTrackingModal}
            className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDelivery}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center font-medium shadow-md"
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

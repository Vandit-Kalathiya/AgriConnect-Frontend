import React from "react";
// import { FaCheckCircle, ThumbsUp } from "react-feather";
import { FaRegCheckCircle, FaThumbsUp } from "react-icons/fa";

const VerifyModal = ({
  verificationComplete,
  setShowVerifyModal,
  confirmDeliveryVerification,
  selectedOrderId,
  orders,
  handleBuyerRefund,
}) => {
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl">
        {!verificationComplete ? (
          <>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Verify Delivery
            </h3>
            <div className="mb-6">
              <p className="text-gray-700">
                Please confirm that you have received your order and everything
                is in accordance with your purchase.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                className="border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50"
                onClick={() => setShowVerifyModal(false)}
              >
                Close
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
                onClick={confirmDeliveryVerification}
              >
                <FaRegCheckCircle className="mr-2" />
                Confirm Delivery
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center"
                onClick={() => {
                  const order = orders.find((o) => o.id === selectedOrderId);
                  handleBuyerRefund(order.pdfHash);
                }}
              >
                <XCircle className="mr-2" />
                Reject Delivery
              </button>
            </div>
          </>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center">
            <div className="flex flex-col items-center gap-2 mb-4">
              <div className="bg-emerald-100 p-3 rounded-full">
                <FaThumbsUp className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="font-bold text-emerald-900 text-xl mt-2">
                Delivery Verified!
              </h3>
              <p className="text-emerald-700">
                Payment has been released to the farmer. Redirecting...
              </p>
            </div>
            <div className="text-sm text-emerald-600 mt-2">
              Transaction completed on {new Date().toLocaleDateString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyModal;

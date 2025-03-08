import React from "react";
import { XCircle } from "react-feather";

const RejectModal = ({
  handleCloseRejectModal,
  rejectionReason,
  setRejectionReason,
  rejectionComment,
  setRejectionComment,
  handleConfirmRejection,
  selectedOrderId,
}) => {
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Reject Delivery
        </h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason for rejection:
          </label>
          <select
            className="w-full p-2 border rounded-md focus:ring focus:ring-red-300 focus:border-red-500 focus:outline-none"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          >
            <option value="">Select a reason</option>
            <option value="Product quality does not match contract specifications">
              Product quality does not match contract specifications
            </option>
            <option value="Incomplete delivery - missing items">
              Incomplete delivery - missing items
            </option>
            <option value="Damaged goods received">
              Damaged goods received
            </option>
            <option value="Incorrect items delivered">
              Incorrect items delivered
            </option>
            <option value="Delayed delivery beyond acceptable timeframe">
              Delayed delivery beyond acceptable timeframe
            </option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional comments:
          </label>
          <textarea
            className="w-full p-2 border rounded-md h-24 focus:ring focus:ring-red-300 focus:border-red-500 focus:outline-none"
            placeholder="Please provide details about the issue..."
            value={rejectionComment}
            onChange={(e) => setRejectionComment(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-3">
          <button
            className="border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50"
            onClick={handleCloseRejectModal}
          >
            Cancel
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center"
            onClick={handleConfirmRejection}
            disabled={!rejectionReason}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectModal;

import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const ApprovalModal = ({
  isApproveModalOpen,
  setIsApproveModalOpen,
  confirmApproveBooking,
}) => {
  return (
    isApproveModalOpen && (
      <div className="fixed inset-0 bg-opacity-70 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border-t-4 border-green-500">
          <div className="text-center">
            <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Confirm Approval
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to approve this booking? This action will
              notify the farmer and update the status.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setIsApproveModalOpen(false)}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={confirmApproveBooking}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition"
            >
              Approve
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ApprovalModal;

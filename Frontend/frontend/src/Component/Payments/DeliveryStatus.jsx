import React from "react";
import {
  Clock,
  Package,
  CheckCircle2,
  XCircle,
  ThumbsUp,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

const DeliveryStatus = ({
  deliveryStatus,
  rejectionReason,
  rejectionComment,
  redirecting,
  redirectCountdown,
  handleVerifyDelivery,
  handleOpenRejectModal,
  handleNavigateToPayments,
}) => {
  switch (deliveryStatus) {
    case "waiting":
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900">
                Waiting for Delivery
              </h3>
              <p className="text-sm text-blue-700">
                The farmer will confirm when your order is delivered
              </p>
            </div>
          </div>
          <div className="animate-pulse bg-blue-200 h-2 w-24 rounded-full"></div>
        </div>
      );
    case "delivered":
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-yellow-100 p-2 rounded-full">
              <Package className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-medium text-yellow-900">
                Delivery Confirmed by Farmer
              </h3>
              <p className="text-sm text-yellow-700">
                Please verify that you've received the goods as per the contract
              </p>
            </div>
          </div>
          <div className="flex gap-3 mt-2">
            <button
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center justify-center flex-1"
              onClick={handleVerifyDelivery}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Verify Delivery
            </button>
            <button
              className="border border-red-300 text-red-700 hover:bg-red-50 px-4 py-2 rounded-md flex items-center justify-center flex-1"
              onClick={handleOpenRejectModal}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject Delivery
            </button>
          </div>
        </div>
      );
    case "verified":
      return (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center">
          <div className="flex flex-col items-center gap-2 mb-4">
            <div className="bg-emerald-100 p-3 rounded-full">
              <ThumbsUp className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="font-bold text-emerald-900 text-xl mt-2">
              Delivery Verified!
            </h3>
            <p className="text-emerald-700">
              You have successfully verified the delivery. Payment will be
              released to the farmer.
            </p>
          </div>
          <div className="text-sm text-emerald-600 mt-2">
            Transaction completed on {new Date().toLocaleDateString()}
          </div>
          {redirecting && (
            <button
              onClick={handleNavigateToPayments}
              className="bg-emerald-700 mx-auto mt-4 hover:bg-emerald-800 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              Go to Payments ({redirectCountdown}s)
            </button>
          )}
        </div>
      );
    case "rejected":
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-medium text-red-900">Delivery Rejected</h3>
              <p className="text-sm text-red-700">
                Reason: {rejectionReason}{" "}
                {rejectionComment ? `- ${rejectionComment}` : ""}
              </p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            A dispute resolution process will begin. Our team will contact you
            shortly.
          </div>
        </div>
      );
    default:
      return null;
  }
};

export default DeliveryStatus;

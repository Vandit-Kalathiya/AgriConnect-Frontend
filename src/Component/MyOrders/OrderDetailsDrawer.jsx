import React, { useState } from "react";
import {
  FaTimes,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaBarcode,
  FaCreditCard,
  FaShippingFast,
  FaCalendarAlt,
  FaBoxOpen,
  FaRupeeSign,
  FaTruck,
  FaCheckCircle,
  FaMoneyCheckAlt,
  FaUndo,
  FaExclamationTriangle,
  FaUserAstronaut,
} from "react-icons/fa";
import { XCircle, ThumbsUp, Package } from "react-feather";
import OrderStatusBadge from "./OrderStatusBadge";
import api from "../../config/axiosInstance";
import toast from "react-hot-toast";
import { API_CONFIG } from "../../config/apiConfig";
import { useNavigate } from "react-router-dom";

const OrderDetailsDrawer = ({
  order,
  listing,
  image,
  currentUser,
  onClose,
  openTrackingModal,
  handleOpenRejectModal,
  handleBuyerRefund,
  fetchOrders,
  handleFarmerAction,
  farmerDetails,
  loadingFarmer,
}) => {
  const isFarmer = currentUser?.uniqueHexAddress === order.farmerAddress;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Function to approve delivery with loading state
  const approveDelivery = async (orderId) => {
    setLoading(true);
    try {
      const response2 = await api.post(
        `${API_CONFIG.CONTRACT_FARMING}/api/payments/verify-delivery/${orderId}`,
        {},
        { withCredentials: true }
      );

      const agreementId = order.agreementId;

      const fetchResponse = await api.get(
        `${API_CONFIG.CONTRACT_FARMING}/agreements/get/${agreementId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const fetchedAgreementDetails = fetchResponse.data;
      console.log("Fetched agreement details:", fetchedAgreementDetails);

      const contractRequest = {
        farmerInfo: fetchedAgreementDetails.farmerInfo,
        buyerInfo: fetchedAgreementDetails.buyerInfo,
        cropDetails: fetchedAgreementDetails.cropDetails,
        deliveryTerms: fetchedAgreementDetails.deliveryTerms,
        paymentTerms: fetchedAgreementDetails.paymentTerms,
        termsConditions: fetchedAgreementDetails.termsConditions,
        additionalNotes: fetchedAgreementDetails.additionalNotes,
      };

      const response = await api.post(
        `${API_CONFIG.GENERATE_AGREEMENT}/contracts/generate`,
        contractRequest,
        {
          withCredentials: true,
          responseType: "blob",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/pdf",
          },
        }
      );

      const blob = response.data;

      const farmerResponse = await api.get(
        `${API_CONFIG.MAIN_BACKEND}/users/${contractRequest.farmerInfo.farmerContact}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const buyerResponse = await api.get(
        `${API_CONFIG.MAIN_BACKEND}/users/${contractRequest.buyerInfo.buyerContact}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      await handleUploadContract(
        blob,
        farmerResponse.data.uniqueHexAddress,
        buyerResponse.data.uniqueHexAddress
      );
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `AgriConnect_Contract_${contractRequest.farmerInfo.farmerName.replace(
        /\s+/g,
        "_"
      )}_${contractRequest.buyerInfo.buyerName.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      console.log("Contract PDF generated successfully");

      toast.success("Contract PDF Generated Successfully");

      const listingId = order.listingId;
      const quantity = order.quantity;

      const updateListingStatus = await api.put(
        `${API_CONFIG.MARKET_ACCESS}/listings/${listingId}/purchased/${quantity}`
      );

      if (updateListingStatus.status === 200) {
        toast.success("Listing status updated to PURCHASED");
      } else {
        toast.error("Failed to update listing status to PURCHASED");
      }

      toast.success("Delivery successfully approved!");
      fetchOrders();
      onClose();
    } catch (error) {
      console.error("Error approving delivery:", error);
      toast.error("Failed to approve delivery");
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
    }
  };

  const handleUploadContract = async (pdfBlob, farmerAddress, buyerAddress) => {
    try {
      const formData = new FormData();
      formData.append("file", pdfBlob, "contract.pdf");

      const response = await api.post(
        `${API_CONFIG.CONTRACT_FARMING}/upload/${farmerAddress}/${buyerAddress}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Contract uploaded successfully!");
      console.log("Upload response:", response.data);
    } catch (err) {
      toast.error("Failed to upload contract!");
      console.error("Upload error:", err);
    }
  };

  const getButtonConfig = (order) => {
    switch (order.status) {
      case "created":
        return isFarmer
          ? {
              text: "Awaiting Payment",
              disabled: true,
              icon: FaCalendarAlt,
              isFarmerAction: true,
              gradient: "from-gray-400 to-gray-500",
            }
          : {
              text: "Make Payment",
              disabled: false,
              icon: FaCreditCard,
              isFarmerAction: false,
              gradient: "from-blue-600 to-blue-700",
            };
      case "paid_pending_delivery":
        return isFarmer
          ? {
              text: "Confirm Delivery",
              disabled: false,
              icon: FaTruck,
              isFarmerAction: true,
              gradient: "from-green-600 to-green-700",
            }
          : {
              text: "Awaiting Delivery",
              disabled: true,
              icon: FaTruck,
              isFarmerAction: false,
              gradient: "from-gray-400 to-gray-500",
            };
      case "delivered":
        return isFarmer
          ? {
              text: "Delivery Confirmed",
              disabled: true,
              icon: FaCheckCircle,
              isFarmerAction: false,
              gradient: "from-gray-400 to-gray-500",
            }
          : {
              text: "Verify Delivery",
              disabled: true,
              icon: FaCheckCircle,
              isFarmerAction: false,
              gradient: "from-green-600 to-green-700",
            };
      case "completed":
        return {
          text: "Order Completed",
          disabled: true,
          icon: FaCheckCircle,
          isFarmerAction: false,
          gradient: "from-gray-400 to-gray-500",
        };
      case "return_requested":
        return isFarmer
          ? {
              text: "Confirm Return",
              disabled: false,
              icon: FaUndo,
              isFarmerAction: true,
              gradient: "from-orange-600 to-orange-700",
            }
          : {
              text: "Return Requested",
              disabled: true,
              icon: FaUndo,
              isFarmerAction: false,
              gradient: "from-gray-400 to-gray-500",
            };
      case "return_confirmed":
        return isFarmer
          ? {
              text: "Return Confirmed",
              disabled: true,
              icon: FaUndo,
              isFarmerAction: false,
              gradient: "from-gray-400 to-gray-500",
            }
          : {
              text: "Claim Refund",
              disabled: false,
              icon: FaMoneyCheckAlt,
              isFarmerAction: false,
              gradient: "from-purple-600 to-purple-700",
            };
      case "refunded":
        return {
          text: "Refunded",
          disabled: true,
          icon: FaMoneyCheckAlt,
          isFarmerAction: false,
          gradient: "from-gray-400 to-gray-500",
        };
      default:
        return {
          text: "Unknown Status",
          disabled: true,
          icon: FaCalendarAlt,
          isFarmerAction: false,
          gradient: "from-gray-400 to-gray-500",
        };
    }
  };

  const buttonConfig = getButtonConfig(order);

  // Confirmation Modal
  const ConfirmationModal = () => {
    return (
      <div className="fixed inset-0 backdrop-blur-md bg-black/60 z-[100] flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl transform transition-all duration-300 scale-100">
          <div className="flex items-center text-amber-600 mb-4">
            <FaExclamationTriangle size={24} className="mr-2" />
            <h3 className="text-xl font-bold">Confirm Delivery Approval</h3>
          </div>

          <div className="border-t border-b border-gray-200 py-4 my-4">
            <p className="text-gray-700 mb-4 font-medium">
              By approving this delivery, you confirm that:
            </p>
            <ul className="list-disc pl-5 text-gray-600 space-y-2 mb-4">
              <li>You have received the products as described</li>
              <li>The quality and quantity match what you ordered</li>
              <li>The products are in acceptable condition</li>
              <li>This action will release payment to the farmer</li>
              <li>
                This action{" "}
                <span className="font-bold text-red-600">
                  cannot be reversed
                </span>{" "}
                once completed
              </li>
            </ul>
            <p className="text-sm text-gray-500 italic bg-gray-50 p-3 rounded-lg">
              If there are any issues with your order, please reject the
              delivery instead.
            </p>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="px-5 py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => approveDelivery(order.id)}
              disabled={loading}
              className={`px-5 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-green-700 text-white font-medium flex items-center shadow-lg ${
                loading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-200"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Approving...
                </>
              ) : (
                <>
                  <FaCheckCircle className="mr-2" />
                  Confirm Approval
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {showConfirmModal && <ConfirmationModal />}
      
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-[92vw] md:w-[600px] lg:w-[700px] bg-white shadow-2xl z-50 overflow-y-auto animate-slideIn">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white p-4 sm:p-6 flex justify-between items-center z-10 shadow-lg">
          <div>
            <h2 className="text-2xl font-bold">Order Details</h2>
            <p className="text-green-100 text-sm mt-1">
              Order ID: {order.id.slice(0, 8)}...{order.id.slice(-4)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-all duration-200"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Product Image & Info */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-md">
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
              <div className="w-full md:w-48 h-52 sm:h-56 md:h-48 rounded-xl overflow-hidden shadow-lg">
                {!imageError && image ? (
                  <img
                    src={image}
                    alt={listing?.productName || "Product"}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-green-200">
                    <Package className="text-green-400" size={48} />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {listing?.productName || "Loading..."}
                </h3>
                <p className="text-green-600 font-semibold mb-4">
                  {listing?.productType || "Loading..."}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow">
                    <span className="text-gray-600 flex items-center">
                      <FaBoxOpen className="mr-2 text-green-600" />
                      Quantity
                    </span>
                    <span className="font-bold text-gray-800">
                      {order?.quantity} {listing?.unitOfQuantity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow">
                    <span className="text-gray-600 flex items-center">
                      <FaRupeeSign className="mr-2 text-blue-600" />
                      Total Amount
                    </span>
                    <span className="font-bold text-blue-600 text-xl">
                      ₹{order.amount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
            <h4 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
              Order Status
            </h4>
            <OrderStatusBadge status={order.status} />
          </div>

          {/* Order Information */}
          <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
            <h4 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">
              Order Information
            </h4>
            <div className="space-y-3">
              <div className="flex items-start justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600 flex items-center">
                  <FaBarcode className="mr-2 text-gray-400" size={16} />
                  Order ID
                </span>
                <span className="font-mono text-sm text-gray-700 text-right">
                  {order.id.slice(0, 12)}...{order.id.slice(-8)}
                </span>
              </div>
              <div className="flex items-start justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600 flex items-center">
                  <FaCalendarAlt className="mr-2 text-gray-400" size={16} />
                  Order Date
                </span>
                <span className="font-medium text-gray-700">
                  {new Date(order.createdDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              {order.razorpayPaymentId && (
                <div className="flex items-start justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center">
                    <FaCreditCard className="mr-2 text-gray-400" size={16} />
                    Payment ID
                  </span>
                  <span className="font-mono text-sm text-gray-700">
                    {order.razorpayPaymentId.slice(0, 16)}...
                  </span>
                </div>
              )}
              {order.trackingNumber && (
                <div className="flex items-start justify-between py-2">
                  <span className="text-gray-600 flex items-center">
                    <FaShippingFast className="mr-2 text-gray-400" size={16} />
                    Tracking Number
                  </span>
                  <span className="font-mono text-sm text-blue-600">
                    {order.trackingNumber}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Farmer Details (for buyers) */}
          {!isFarmer && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 shadow-md border border-green-200">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-green-100 rounded-full mr-3">
                  <FaUserAstronaut className="text-green-600" size={20} />
                </div>
                <h4 className="text-lg font-bold text-gray-800">
                  Farmer Information
                </h4>
              </div>

              {loadingFarmer ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-500 border-t-transparent"></div>
                  <span className="text-sm text-gray-500">
                    Loading farmer details...
                  </span>
                </div>
              ) : (
                <div className="space-y-3">
                  {farmerDetails?.username && (
                    <div className="flex items-center text-gray-700 bg-white px-4 py-3 rounded-lg">
                      <FaUser className="mr-3 text-green-500" size={16} />
                      <span className="font-medium">{farmerDetails.username}</span>
                    </div>
                  )}
                  {(farmerDetails?.phoneNumber || listing?.contactOfFarmer) && (
                    <div className="flex items-center text-gray-700 bg-white px-4 py-3 rounded-lg">
                      <FaPhone className="mr-3 text-green-500" size={16} />
                      <span>
                        {farmerDetails?.phoneNumber || listing?.contactOfFarmer}
                      </span>
                    </div>
                  )}
                  {farmerDetails?.location && (
                    <div className="flex items-center text-gray-700 bg-white px-4 py-3 rounded-lg">
                      <FaMapMarkerAlt className="mr-3 text-green-500" size={16} />
                      <span>{farmerDetails.location}</span>
                    </div>
                  )}
                  <div className="bg-white px-4 py-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Blockchain Address</div>
                    <div className="font-mono text-sm text-gray-600">
                      {order.farmerAddress.slice(0, 20)}...
                      {order.farmerAddress.slice(-12)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t border-gray-200 -mx-4 sm:-mx-6 px-4 sm:px-6">
            {order.status === "delivered" && !isFarmer ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowConfirmModal(true)}
                  disabled={loading}
                  className={`flex-1 px-6 py-3 font-semibold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center bg-gradient-to-r from-green-600 to-green-700 text-white
                    ${
                      loading
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:from-green-700 hover:to-green-800 transform hover:scale-105 hover:shadow-xl"
                    }`}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <ThumbsUp className="mr-2" size={18} />
                      Approve Delivery
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    handleOpenRejectModal(order.id);
                    onClose();
                  }}
                  disabled={loading}
                  className={`flex-1 px-6 py-3 font-semibold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center bg-gradient-to-r from-red-600 to-red-700 text-white
                    ${
                      loading
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:from-red-700 hover:to-red-800 transform hover:scale-105 hover:shadow-xl"
                    }`}
                >
                  <XCircle className="mr-2" size={18} />
                  Reject Delivery
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  if (order.status === "created" && !isFarmer) {
                    navigate("/payment-process", { state: { order } });
                  } else if (
                    isFarmer &&
                    buttonConfig.isFarmerAction &&
                    order.status === "paid_pending_delivery"
                  ) {
                    openTrackingModal(order.id);
                    onClose();
                  } else if (
                    isFarmer &&
                    buttonConfig.isFarmerAction &&
                    order.status === "return_requested"
                  ) {
                    handleFarmerAction(order.id, "return_confirmed", "abcd");
                  } else if (!isFarmer && order.status === "return_confirmed") {
                    handleBuyerRefund(order.id);
                  }
                }}
                disabled={buttonConfig.disabled || loading}
                className={`w-full px-6 py-3 font-semibold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center text-white bg-gradient-to-r ${
                  buttonConfig.gradient
                }
                  ${
                    buttonConfig.disabled || loading
                      ? "opacity-50 cursor-not-allowed"
                      : "transform hover:scale-105 hover:shadow-xl"
                  }`}
              >
                <buttonConfig.icon className="mr-2" size={18} />
                {buttonConfig.text}
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default OrderDetailsDrawer;


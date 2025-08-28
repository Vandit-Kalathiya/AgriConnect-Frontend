import React, { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaHourglassHalf,
  FaArrowRight,
  FaTruck,
  FaUndo,
  FaMoneyCheckAlt,
  FaExclamationTriangle,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaUserAstronaut,
  FaCalendarAlt,
  FaBoxOpen,
  FaRupeeSign,
  FaBarcode,
  FaCreditCard,
  FaShippingFast,
} from "react-icons/fa";
import { XCircle, ThumbsUp, Package, Clock } from "react-feather";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const OrderItem = ({
  order,
  listing,
  image,
  currentUser,
  openTrackingModal,
  handleVerifyDelivery,
  handleOpenRejectModal,
  handleBuyerRefund,
  fetchOrders,
  handleFarmerAction,
}) => {
  const isFarmer = currentUser?.uniqueHexAddress === order.farmerAddress;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [farmerDetails, setFarmerDetails] = useState(null);
  const [loadingFarmer, setLoadingFarmer] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Fetch farmer details when component mounts (only for buyers)
  useEffect(() => {
    const fetchFarmerDetails = async () => {
      if (!isFarmer && order.farmerAddress) {
        setLoadingFarmer(true);
        try {
          const response = await axios.get(
            `http://localhost:2525/users/unique/${order.farmerAddress}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );
          setFarmerDetails(response.data);
        } catch (error) {
          console.error("Error fetching farmer details:", error);
        } finally {
          setLoadingFarmer(false);
        }
      }
    };

    fetchFarmerDetails();
  }, [order.farmerAddress, isFarmer]);

  // Function to approve delivery with loading state
  const approveDelivery = async (orderId) => {
    setLoading(true);
    try {
      const response2 = await axios.post(
        `http://localhost:2526/api/payments/verify-delivery/${orderId}`,
        {},
        { withCredentials: true }
      );

      const agreementId = order.agreementId;

      const fetchResponse = await axios.get(
        `http://localhost:2526/agreements/get/${agreementId}`,
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

      const response = await fetch("http://localhost:2529/contracts/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf",
        },
        body: JSON.stringify(contractRequest),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to generate PDF: ${response.status} - ${errorText}`
        );
      }

      const blob = await response.blob();

      const farmerResponse = await axios.get(
        `http://localhost:2525/users/${contractRequest.farmerInfo.farmerContact}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const buyerResponse = await axios.get(
        `http://localhost:2525/users/${contractRequest.buyerInfo.buyerContact}`,
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

      toast.success("Delivery successfully approved!");
      fetchOrders();
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

      const response = await axios.post(
        `http://localhost:2526/upload/${farmerAddress}/${buyerAddress}`,
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

  // Get status badge configuration
  const getStatusBadge = (status) => {
    const statusConfigs = {
      created: { bg: "bg-amber-100", text: "text-amber-700", icon: Clock },
      paid_pending_delivery: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        icon: FaCreditCard,
      },
      delivered: {
        bg: "bg-indigo-100",
        text: "text-indigo-700",
        icon: FaShippingFast,
      },
      completed: {
        bg: "bg-green-100",
        text: "text-green-700",
        icon: FaCheckCircle,
      },
      return_requested: {
        bg: "bg-orange-100",
        text: "text-orange-700",
        icon: FaUndo,
      },
      return_confirmed: {
        bg: "bg-purple-100",
        text: "text-purple-700",
        icon: FaUndo,
      },
      refunded: {
        bg: "bg-red-100",
        text: "text-red-700",
        icon: FaMoneyCheckAlt,
      },
    };

    return (
      statusConfigs[status] || {
        bg: "bg-gray-100",
        text: "text-gray-700",
        icon: FaHourglassHalf,
      }
    );
  };

  // Confirmation Modal
  const ConfirmationModal = () => {
    return (
      <div className="fixed inset-0 backdrop-blur-md bg-black/60 z-50 flex items-center justify-center p-4 animate-fadeIn">
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

  const getButtonConfig = (order) => {
    switch (order.status) {
      case "created":
        return isFarmer
          ? {
              text: "Awaiting Payment",
              disabled: true,
              icon: Clock,
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
          icon: FaHourglassHalf,
          isFarmerAction: false,
          gradient: "from-gray-400 to-gray-500",
        };
    }
  };

  const buttonConfig = getButtonConfig(order);
  const statusBadge = getStatusBadge(order.status);
  const StatusIcon = statusBadge.icon;

  return (
    <>
      {showConfirmModal && <ConfirmationModal />}

      <li className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
        <div className="flex flex-col lg:flex-row">
          {/* Enhanced Image Section */}
          <div className="relative w-full lg:w-64 h-48 lg:h-auto bg-gradient-to-br from-green-50 to-green-100 overflow-hidden">
            {!imageError && image ? (
              <img
                src={image}
                alt={listing?.productName || "Product"}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <Package className="mx-auto text-green-300 mb-2" size={48} />
                  <p className="text-green-600 font-medium text-sm">
                    {listing?.productType || "Agricultural Product"}
                  </p>
                </div>
              </div>
            )}

            {/* Status Badge Overlay */}
            <div
              className={`absolute top-3 left-3 ${statusBadge.bg} ${statusBadge.text} px-3 py-1.5 rounded-full text-xs font-bold flex items-center shadow-md backdrop-blur-sm bg-opacity-90`}
            >
              <StatusIcon className="mr-1.5" size={14} />
              {order.status.replace(/_/g, " ").toUpperCase()}
            </div>
          </div>

          <div className="flex-1 p-6">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-1">
                  {listing?.productName || "Loading..."}
                </h3>
                <p className="text-green-600 font-medium mb-3">
                  {listing?.productType || "Loading..."}
                </p>

                {/* Price and Quantity Pills */}
                <div className="flex flex-wrap gap-3">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg flex items-center shadow-md">
                    <FaBoxOpen className="mr-2" size={16} />
                    <span className="font-bold">
                      {order?.quantity} {listing?.unitOfQuantity}
                    </span>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg flex items-center shadow-md">
                    <FaRupeeSign className="mr-2" size={16} />
                    <span className="font-bold">
                      {order.amount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Date Section */}
              <div className="flex items-center text-gray-500 text-sm mt-3 lg:mt-0">
                <FaCalendarAlt className="mr-2" />
                {new Date(order.createdDate).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>

            {/* Order Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-1 p-2 bg-gray-50 rounded-xl">
              <div className="flex items-start">
                <FaBarcode className="text-gray-400 mr-2 mt-1" size={16} />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Order ID</p>
                  <p className="text-sm font-mono text-gray-700">
                    {order.id.slice(0, 8)}...{order.id.slice(-4)}
                  </p>
                </div>
              </div>

              {order.razorpayPaymentId && (
                <div className="flex items-start">
                  <FaCreditCard className="text-gray-400 mr-2 mt-1" size={16} />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      Payment ID
                    </p>
                    <p className="text-sm font-mono text-gray-700">
                      {order.razorpayPaymentId.slice(0, 12)}...
                    </p>
                  </div>
                </div>
              )}

              {order.trackingNumber && (
                <div className="flex items-start">
                  <FaShippingFast
                    className="text-gray-400 mr-2 mt-1"
                    size={16}
                  />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      Tracking
                    </p>
                    <p className="text-sm font-mono text-blue-600">
                      {order.trackingNumber}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Farmer/Buyer Details Section */}
            {!isFarmer && (
              <div className="mb-2 p-1 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-center mb-1">
                  <div className="p-2 bg-green-100 rounded-full mr-3">
                    <FaUserAstronaut className="text-green-600" size={18} />
                  </div>
                  <span className="font-semibold text-gray-800">
                    Farmer Information
                  </span>
                </div>

                {loadingFarmer ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-500 border-t-transparent"></div>
                    <span className="text-sm text-gray-500">
                      Loading farmer details...
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-1 px-2">
                    {farmerDetails?.username && (
                      <div className="flex items-center text-gray-700">
                        <FaUser className="mr-2 text-green-500" size={14} />
                        <span className="text-sm font-medium">
                          {farmerDetails.username}
                        </span>
                      </div>
                    )}
                    {(farmerDetails?.phoneNumber ||
                      listing?.contactOfFarmer) && (
                      <div className="flex items-center text-gray-700">
                        <FaPhone className="mr-2 text-green-500" size={14} />
                        <span className="text-sm">
                          {farmerDetails?.phoneNumber ||
                            listing?.contactOfFarmer}
                        </span>
                      </div>
                    )}
                    {farmerDetails?.location && (
                      <div className="flex items-center text-gray-700">
                        <FaMapMarkerAlt
                          className="mr-2 text-green-500"
                          size={14}
                        />
                        <span className="text-sm">
                          {farmerDetails.location}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center text-gray-600">
                      <div className="text-xs font-mono bg-white px-2 py-1 rounded">
                        Address: {order.farmerAddress.slice(0, 10)}...
                        {order.farmerAddress.slice(-6)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {order.status === "delivered" && !isFarmer ? (
                <>
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
                    onClick={() => handleOpenRejectModal(order.id)}
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
                </>
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
                    } else if (
                      isFarmer &&
                      buttonConfig.isFarmerAction &&
                      order.status === "return_requested"
                    ) {
                      handleFarmerAction(order.id, "return_confirmed", "abcd");
                    } else if (
                      !isFarmer &&
                      order.status === "return_confirmed"
                    ) {
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
      </li>
    </>
  );
};

export default OrderItem;

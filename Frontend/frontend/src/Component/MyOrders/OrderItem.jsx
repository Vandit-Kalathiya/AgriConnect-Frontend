import React from "react";
import {
  FaCheckCircle,
  FaHourglassHalf,
  FaArrowRight,
  FaTruck,
  FaUndo,
  FaMoneyCheckAlt,
} from "react-icons/fa";
import { XCircle, ThumbsUp } from "react-feather";
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

  // Function to approve delivery
  const approveDelivery = async (pdfHash) => {
    try {
      const response = await axios.post(
        `http://localhost:2526/api/payments/verify-delivery/${pdfHash}`,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        const changeListingStatus = axios.put(
          `'http://localhost:2527/listings/${listing.id}/purchased`
        );
        if (response.status === 200) {
          toast.success(response.data.message);
          fetchOrders();
        }
      }
    } catch (error) {
      console.error("Error approving delivery:", error);
      toast.error("Failed to approve delivery");
    }
  };

  const getButtonConfig = (order) => {
    // console.log(isFarmer);
    switch (order.status) {
      case "created":
        return isFarmer
          ? {
              text: "Wait for buyer to make payment...",
              disabled: true,
              icon: FaArrowRight,
              isFarmerAction: true,
            }
          : {
              text: "Make Payment",
              disabled: false,
              icon: FaArrowRight,
              isFarmerAction: false,
            };
      case "paid_pending_delivery":
        return isFarmer
          ? {
              text: "Confirm Delivery",
              disabled: false,
              icon: FaTruck,
              isFarmerAction: true,
            }
          : {
              text: "Awaiting Delivery",
              disabled: true,
              icon: FaTruck,
              isFarmerAction: false,
            };
      case "delivered":
        return isFarmer
          ? {
              text: "Delivery Verified",
              disabled: true,
              icon: FaCheckCircle,
              isFarmerAction: false,
            }
          : {
              text: "Verify Delivery",
              disabled: true,
              icon: FaCheckCircle,
              isFarmerAction: false,
            };
      case "completed":
        return {
          text: "Completed",
          disabled: true,
          icon: FaCheckCircle,
          isFarmerAction: false,
        };
      case "return_requested":
        return isFarmer
          ? {
              text: "Confirm Return",
              disabled: false,
              icon: FaUndo,
              isFarmerAction: true,
            }
          : {
              text: "Return Requested",
              disabled: true,
              icon: FaUndo,
              isFarmerAction: false,
            };
      case "return_confirmed":
        return isFarmer
          ? {
              text: "Return Confirmed",
              disabled: true,
              icon: FaUndo,
              isFarmerAction: false,
            }
          : {
              text: "Take Refund",
              disabled: false,
              icon: FaMoneyCheckAlt,
              isFarmerAction: false,
            };
      case "refunded":
        return {
          text: "Refunded",
          disabled: true,
          icon: FaMoneyCheckAlt,
          isFarmerAction: false,
        };
      default:
        return {
          text: "Unknown Status",
          disabled: true,
          icon: FaHourglassHalf,
          isFarmerAction: false,
        };
    }
  };

  const buttonConfig = getButtonConfig(order);

  //   console.log(isFarmer);

  return (
    <li className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex flex-col md:flex-row">
        <div className="relative w-full md:w-32 h-32 md:h-full bg-green-100">
          <img
            src={image || "/placeholder-image.jpg"}
            alt={listing?.productType || "Product"}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 p-4 md:p-5 flex flex-col md:flex-row md:items-center">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <span
                className={`flex items-center px-2 py-1 rounded-full text-xs font-semibold mr-2 ${
                  order.status === "completed" || order.status === "refunded"
                    ? "text-green-600 bg-green-50"
                    : order.status === "created" ||
                      order.status === "return_confirmed"
                    ? "text-yellow-600 bg-yellow-50"
                    : "text-blue-600 bg-blue-50"
                }`}
              >
                {order.status === "completed" || order.status === "refunded" ? (
                  <FaCheckCircle className="mr-1" />
                ) : order.status === "created" ||
                  order.status === "return_confirmed" ? (
                  <FaHourglassHalf className="mr-1" />
                ) : (
                  <FaTruck className="mr-1" />
                )}
                {order.status.replace(/_/g, " ")}
              </span>
              <span className="text-gray-500 text-sm">
                {new Date(order.createdDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-green-800 mb-1">
              {listing?.productType || "Loading..."}
            </h3>
            <div className="flex items-center mb-3 md:mb-0">
              <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium mr-3">
                {listing?.quantity} {listing?.unitOfQuantity}
              </div>
              <div className="text-lg font-bold text-green-900">
                ₹{" "}
                {order.amount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            {order.status === "delivered" && !isFarmer ? (
              <>
                <button
                  onClick={() => approveDelivery(order.pdfHash)}
                  className="w-full md:w-auto px-5 py-3 text-sm font-medium rounded-lg shadow-md transition-all duration-300 flex items-center justify-center bg-green-600 text-white hover:bg-green-700 transform hover:-translate-y-1 mb-2"
                >
                  <FaCheckCircle className="mr-2" />
                  Approve Delivery
                </button>
                <button
                  onClick={() => handleOpenRejectModal(order.id)}
                  className="w-full md:w-auto px-5 py-3 text-sm font-medium rounded-lg shadow-md transition-all duration-300 flex items-center justify-center bg-red-600 text-white hover:bg-red-700 transform hover:-translate-y-1"
                >
                  <XCircle className="mr-2" />
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
                    handleFarmerAction(order.pdfHash, "return_confirmed", "");
                  } else if (!isFarmer && order.status === "return_confirmed") {
                    handleBuyerRefund(order.pdfHash);
                  }
                }}
                disabled={buttonConfig.disabled}
                className={`w-full md:w-auto px-5 py-3 text-sm font-medium rounded-lg shadow-md transition-all duration-300 flex items-center justify-center ${
                  buttonConfig.disabled
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700 transform hover:-translate-y-1"
                }`}
              >
                <buttonConfig.icon className="mr-2" />
                {buttonConfig.text}
              </button>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

export default OrderItem;

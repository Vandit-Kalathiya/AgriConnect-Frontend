import React, { useState } from "react";
import {
  FaCheckCircle,
  FaHourglassHalf,
  FaArrowRight,
  FaTruck,
  FaUndo,
  FaMoneyCheckAlt,
  FaExclamationTriangle,
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
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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

      // fetching farmer details
      const farmerResponse = await axios.get(
        `http://localhost:2525/users/${contractRequest.farmerInfo.farmerContact}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // fetching buyer details
      const buyerResponse = await axios.get(
        `http://localhost:2525/users/${contractRequest.buyerInfo.buyerContact}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      
      await handleUploadContract(blob,farmerResponse.data.uniqueHexAddress,buyerResponse.data.uniqueHexAddress);
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
      // setContractGenerated(true);

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
      // Prepare FormData with the generated PDF
      const formData = new FormData();
      formData.append("file", pdfBlob, "contract.pdf");

      // Call the uploadAgreement API
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

  // Confirmation Modal
  const ConfirmationModal = () => {
    return (
      <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
          <div className="flex items-center text-amber-600 mb-4">
            <FaExclamationTriangle size={24} className="mr-2" />
            <h3 className="text-lg font-bold">Confirm Delivery Approval</h3>
          </div>

          <div className="border-t border-b py-4 my-4">
            <p className="text-gray-700 mb-4">
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
            <p className="text-sm text-gray-500 italic">
              If there are any issues with your order, please reject the
              delivery instead.
            </p>
          </div>

          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => approveDelivery(order.id)}
              disabled={loading}
              className={`px-4 py-2 rounded-lg bg-green-600 text-white flex items-center ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:bg-green-700"
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

  return (
    <>
      {showConfirmModal && <ConfirmationModal />}

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
                  {order.status === "completed" ||
                  order.status === "refunded" ? (
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
                  {order?.quantity} {listing?.unitOfQuantity}
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
                    onClick={() => setShowConfirmModal(true)}
                    disabled={loading}
                    className={`w-full md:w-auto px-5 py-3 text-sm font-medium rounded-lg shadow-md transition-all duration-300 flex items-center justify-center 
                      ${
                        loading
                          ? "bg-green-500 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700 transform hover:-translate-y-0.5"
                      } 
                      text-white mb-2`}
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
                        Approving Delivery...
                      </>
                    ) : (
                      <>
                        <FaCheckCircle className="mr-2" />
                        Approve Delivery
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleOpenRejectModal(order.id)}
                    disabled={loading}
                    className={`w-full md:w-auto px-5 py-3 text-sm font-medium rounded-lg shadow-md m-auto transition-all duration-300 flex items-center justify-center 
                      ${
                        loading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700 transform hover:-translate-y-0.5"
                      } 
                      text-white`}
                  >
                    <XCircle className="mr-2" size={16} />
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
                  className={`w-full md:w-auto px-5 py-3 text-sm font-medium rounded-lg shadow-md transition-all duration-300 flex items-center justify-center ${
                    buttonConfig.disabled || loading
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
    </>
  );
};

export default OrderItem;

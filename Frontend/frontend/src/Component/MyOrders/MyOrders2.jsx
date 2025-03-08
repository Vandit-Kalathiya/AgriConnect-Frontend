import React, { useState, useEffect } from "react";
import {
  FaShoppingCart,
  FaCheckCircle,
  FaHourglassHalf,
  FaArrowRight,
  FaTruck,
  FaUndo,
  FaMoneyCheckAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getCurrentUser } from "../../../helper";
import { XCircle, ThumbsUp } from "react-feather";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [listings, setListings] = useState({});
  const [images, setImages] = useState({});
  const [activeTab, setActiveTab] = useState("pending_payment");
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionComment, setRejectionComment] = useState("");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);

  // Fetch orders and related data
  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);

    const user = await getCurrentUser();
    if (!user || !user.id) {
      setError("User not logged in or ID not found");
      setIsLoading(false);
      return;
    }
    setCurrentUser(user);

    try {
      const response = await axios.get(
        `http://localhost:2526/orders/u/${user.uniqueHexAddress}`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const fetchedOrders = response.data;
      setOrders(fetchedOrders);

      const listingPromises = fetchedOrders.map((order) =>
        fetchListingById(order.listingId).then((listing) => ({
          orderId: order.id,
          listing,
        }))
      );

      const listingsData = await Promise.all(listingPromises);
      const newListings = listingsData.reduce((acc, { orderId, listing }) => {
        if (listing) acc[orderId] = listing;
        return acc;
      }, {});

      setListings(newListings);

      const imagePromises = Object.entries(newListings).map(
        ([orderId, listing]) =>
          listing?.images?.[0]?.id
            ? fetchImage(listing.images[0].id).then((blobUrl) => ({
                orderId,
                blobUrl,
              }))
            : Promise.resolve({ orderId, blobUrl: null })
      );

      const imagesData = await Promise.all(imagePromises);
      const newImages = imagesData.reduce((acc, { orderId, blobUrl }) => {
        if (blobUrl) acc[orderId] = blobUrl;
        return acc;
      }, {});

      setImages(newImages);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error.response?.data || "Failed to fetch orders.");
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchImage = async (imageId) => {
    try {
      const res = await axios.get(`http://localhost:2527/image/${imageId}`, {
        responseType: "blob",
      });
      return URL.createObjectURL(res.data);
    } catch (err) {
      console.error("Failed to fetch image:", err);
      return null;
    }
  };

  const fetchListingById = async (listingId) => {
    try {
      const response = await axios.get(
        `http://localhost:2527/listings/get/${listingId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      console.error("Failed to fetch listing:", err);
      return null;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    switch (activeTab) {
      case "pending_payment":
        return order.status === "created";
      case "in_progress":
        return [
          "paid_pending_delivery",
          "delivered",
          "return_requested",
          "return_confirmed",
        ].includes(order.status);
      case "completed":
        return ["completed", "refunded"].includes(order.status);
      default:
        return true;
    }
  });

  const getButtonConfig = (order) => {
    const isFarmer = currentUser?.uniqueHexAddress === order.farmerAddress;
    switch (order.status) {
      case "created":
        return {
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
              text: "Verified",
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

  const handleFarmerAction = async (pdfHash, newStatus, trackingNumber) => {
    try {
      if (newStatus === "delivered") {
        await axios.post(
          `http://localhost:2526/api/payments/confirm-delivery/${pdfHash}/${trackingNumber}`,
          { trackingNumber },
          { withCredentials: true }
        );
        toast.success("Delivery confirmed successfully!");
      } else if (newStatus === "return_confirmed") {
        await axios.post(
          `http://localhost:2526/api/payments/confirm-return/${pdfHash}`,
          {},
          { withCredentials: true }
        );
        toast.success("Return confirmed successfully!");
      }
      setShowTrackingModal(false);
      setTrackingNumber("");
      setSelectedOrderId(null);
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const handleBuyerRefund = async (pdfHash) => {
    try {
      await axios.post(
        `http://localhost:2526/api/payments/reject-delivery/${pdfHash}`,
        {},
        { withCredentials: true }
      );
      toast.success("Refund processed successfully!");
      fetchOrders();
    } catch (error) {
      console.error("Error processing refund:", error);
      toast.error("Failed to process refund");
    }
  };

  const openTrackingModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowTrackingModal(true);
  };

  const closeTrackingModal = () => {
    setShowTrackingModal(false);
    setTrackingNumber("");
    setSelectedOrderId(null);
  };

  const handleOpenRejectModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowRejectModal(true);
  };

  const handleCloseRejectModal = () => {
    setShowRejectModal(false);
    setRejectionReason("");
    setRejectionComment("");
    setSelectedOrderId(null);
  };

  const handleConfirmRejection = async () => {
    if (!rejectionReason) {
      toast.error("Please select a reason for rejection");
      return;
    }

    try {
      const order = orders.find((o) => o.id === selectedOrderId);
      await axios.post(
        `http://localhost:2526/api/payments/request-return/${order.pdfHash}/abcd`,
        { withCredentials: true }
      );
      toast.success("Delivery rejection submitted successfully");
      handleCloseRejectModal();
      fetchOrders();
    } catch (error) {
      console.error("Error rejecting delivery:", error);
      toast.error("Failed to reject delivery");
    }
  };

  const handleVerifyDelivery = (orderId) => {
    setSelectedOrderId(orderId);
    setShowVerifyModal(true);
  };

  const confirmDeliveryVerification = async () => {
    try {
      const order = orders.find((o) => o.id === selectedOrderId);
      const res = await axios.post(
        `http://localhost:2526/api/payments/verify-delivery/${order.pdfHash}`,
        {},
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast.success("Delivery verified successfully");
        setVerificationComplete(true);
        setTimeout(() => {
          setShowVerifyModal(false);
          setVerificationComplete(false);
          navigate("/my-payments");
          fetchOrders();
        }, 2500);
      }
    } catch (error) {
      console.error("Error verifying delivery:", error);
      toast.error("Failed to verify delivery");
    }
  };

  return (
    <div className="bg-gray-50 py-8 md:py-12 px-4 md:px-6 lg:px-8 ml-0 md:ml-20 mt-16 md:mt-20 min-h-screen">
      <div className="max-w-full md:max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-green-800 flex items-center">
            <FaShoppingCart className="mr-3 text-green-600" /> My Orders
          </h1>
          <button
            onClick={() => navigate("/crops")}
            className="text-sm md:text-base bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-full transition-all duration-300 flex items-center shadow-md"
          >
            Browse Marketplace <FaArrowRight className="ml-2" />
          </button>
        </div>

        {isLoading ? (
          <div className="text-center text-gray-600 text-md md:text-lg">
            <Loader />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <FaShoppingCart className="text-red-500 text-5xl mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-red-700 mb-2">Error</h3>
            <p className="text-md text-gray-600 max-w-md mx-auto">{error}</p>
            <button
              onClick={fetchOrders}
              className="mt-4 bg-green-600 text-white py-2 px-4 rounded-full hover:bg-green-700 transition-all"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="flex bg-white rounded-t-xl shadow-md mb-1 border-b border-gray-200">
              <button
                onClick={() => setActiveTab("pending_payment")}
                className={`flex-1 py-3 text-center font-medium ${
                  activeTab === "pending_payment"
                    ? "text-yellow-700 border-b-2 border-yellow-500"
                    : "text-gray-600 hover:text-yellow-600"
                }`}
              >
                Pending Payment (
                {orders.filter((o) => o.status === "created").length})
              </button>
              <button
                onClick={() => setActiveTab("in_progress")}
                className={`flex-1 py-3 text-center font-medium ${
                  activeTab === "in_progress"
                    ? "text-blue-700 border-b-2 border-blue-500"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                In Progress (
                {
                  orders.filter((o) =>
                    [
                      "paid_pending_delivery",
                      "delivered",
                      "return_requested",
                      "return_confirmed",
                    ].includes(o.status)
                  ).length
                }
                )
              </button>
              <button
                onClick={() => setActiveTab("completed")}
                className={`flex-1 py-3 text-center font-medium ${
                  activeTab === "completed"
                    ? "text-green-700 border-b-2 border-green-500"
                    : "text-gray-600 hover:text-green-600"
                }`}
              >
                Completed (
                {
                  orders.filter((o) =>
                    ["completed", "refunded"].includes(o.status)
                  ).length
                }
                )
              </button>
            </div>

            <div className="bg-white rounded-b-xl shadow-lg p-4 md:p-6">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <FaShoppingCart className="text-green-500 text-5xl mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No orders found
                  </h3>
                  <p className="text-md text-gray-600 max-w-md mx-auto">
                    {activeTab === "pending_payment"
                      ? "You haven't placed any orders yet requiring payment."
                      : activeTab === "in_progress"
                      ? "No orders are currently in progress."
                      : "No orders have been completed or refunded."}
                  </p>
                </div>
              ) : (
                <ul className="space-y-5">
                  {filteredOrders.map((order) => {
                    const buttonConfig = getButtonConfig(order);
                    const isFarmer =
                      currentUser?.uniqueHexAddress === order.farmerAddress;
                    const listing = listings[order.id];
                    const image = images[order.id];

                    return (
                      <li
                        key={order.id}
                        className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                      >
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
                                    order.status === "completed" ||
                                    order.status === "refunded"
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
                                  {new Date(
                                    order.createdDate
                                  ).toLocaleDateString("en-US", {
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
                              <button
                                onClick={() => {
                                  if (order.status === "created" && !isFarmer) {
                                    navigate("/payment-process", {
                                      state: { order },
                                    });
                                  } else if (
                                    order.status === "delivered" &&
                                    !isFarmer
                                  ) {
                                    handleVerifyDelivery(order.id);
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
                                    handleFarmerAction(
                                      order.pdfHash,
                                      "return_confirmed",
                                      ""
                                    );
                                  } else if (
                                    !isFarmer &&
                                    order.status === "return_confirmed"
                                  ) {
                                    handleBuyerRefund(order.pdfHash);
                                  }
                                }}
                                disabled={buttonConfig.disabled}
                                className={`w-full md:w-auto px-5 py-3 text-sm font-medium rounded-lg shadow-md transition-all duration-300 flex items-center justify-center ${
                                  buttonConfig.disabled
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-green-600 text-white hover:bg-green-700 transform hover:-translate-y-1"
                                } ${
                                  order.status === "delivered" && !isFarmer
                                    ? "mb-2"
                                    : ""
                                }`}
                              >
                                <buttonConfig.icon className="mr-2" />
                                {buttonConfig.text}
                              </button>
                              {order.status === "delivered" && !isFarmer && (
                                <button
                                  className="border border-red-300 text-sm text-red-700 hover:bg-red-50 px-4 py-2 rounded-md flex items-center justify-center w-full md:w-auto mt-2"
                                  onClick={() =>
                                    handleOpenRejectModal(order.id)
                                  }
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Reject Delivery
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </>
        )}
      </div>

      {showTrackingModal && (
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
                  handleFarmerAction(
                    order.pdfHash,
                    "delivered",
                    trackingNumber
                  );
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
              >
                <FaTruck className="mr-2" />
                Confirm Delivery
              </button>
            </div>
          </div>
        </div>
      )}

      {showRejectModal && (
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
      )}

      {showVerifyModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl">
            {!verificationComplete ? (
              <>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Verify Delivery
                </h3>
                <div className="mb-6">
                  <p className="text-gray-700">
                    Please confirm that you have received your order and
                    everything is in accordance with your purchase.
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
                    <FaCheckCircle className="mr-2" />
                    Confirm Delivery
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center">
                <div className="flex flex-col items-center gap-2 mb-4">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <ThumbsUp className="h-8 w-8 text-emerald-600" />
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
      )}
    </div>
  );
};

export default MyOrders;

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
import { Loader } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import leafImg from "../../assets/leaf.png";
import { getCurrentUser } from "../../../helper";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [listing, setListing] = useState({});
  const [activeTab, setActiveTab] = useState("pending_payment");
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false); // Modal state
  const [trackingNumber, setTrackingNumber] = useState(""); // Tracking number input
  const [selectedOrderId, setSelectedOrderId] = useState(null); // Track which order is being confirmed

  // Fetch orders for the current user
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

    const userId = user.uniqueHexAddress;

    try {
      const response = await axios.get(
        `http://localhost:2526/orders/u/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setOrders(response.data);
      console.log("Fetched orders:", response.data);

      if (response.data.length > 0) {
        const listingRes = await fetchListingById(response.data[0].listingId);
        setListing(listingRes);
        console.log("Listing details:", listingRes);
        fetchImage(listingRes.images[0].id);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(
        error.response?.data ||
          "Failed to fetch orders. Please try again later."
      );
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchImage = async (imageId) => {
    console.log("Image ID:", imageId);
    await axios
      .get(`http://localhost:2527/image/${imageId}`, {
        responseType: "blob",
      })
      .then((res) => {
        setImage(URL.createObjectURL(res.data));
        console.log("Image data:", res.data);
      });
  };

  const fetchListingById = async (listingId) => {
    try {
      const response = await axios.get(
        `http://localhost:2527/listings/get/${listingId}`,
        {
          withCredentials: true,
        }
      );
      console.log("Listing details:", response.data);
      setListing(response.data);
      return response.data;
    } catch (err) {
      console.error("Failed to fetch listing details:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders based on active tab
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

  // Determine button text and disabled state based on order status and user role
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
        return {
          text: "Verify Delivery",
          disabled: false,
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
        return {
          text: "Return Requested",
          disabled: true,
          icon: FaUndo,
          isFarmerAction: false,
        };
      case "return_confirmed":
        return isFarmer
          ? {
              text: "Confirm Return",
              disabled: false,
              icon: FaUndo,
              isFarmerAction: true,
            }
          : {
              text: "Awaiting Refund",
              disabled: true,
              icon: FaHourglassHalf,
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

  // Handle farmer confirming delivery or return
  const handleFarmerAction = async (pdfHash, newStatus, trackingNumber) => {
    try {
      await axios.post(
        `http://localhost:2526/api/payments/confirm-delivery/${pdfHash}/${trackingNumber}`,
        { trackingNumber }, // Include tracking number in the request body
        { withCredentials: true }
      );
      // fetchOrders(); // Refresh orders after update
      alert(
        `${
          newStatus === "delivered" ? "Delivery" : "Return"
        } confirmed successfully!`
      );
      setShowTrackingModal(false); // Close modal
      setTrackingNumber(""); // Reset tracking number
      setSelectedOrderId(null); // Clear selected order
    } catch (error) {
      console.error("Error updating order status:", error);
      setError("Failed to update order status");
    }
  };

  // Open tracking number modal
  const openTrackingModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowTrackingModal(true);
  };

  // Close tracking number modal
  const closeTrackingModal = () => {
    setShowTrackingModal(false);
    setTrackingNumber("");
    setSelectedOrderId(null);
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-gray-50 py-8 md:py-12 px-4 md:px-6 lg:px-8 ml-0 md:ml-20 mt-16 md:mt-20 min-h-screen">
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
          <div className="flex justify-center items-center h-64">
            <Loader color="green" size="xl" />
            <p className="ml-4 text-green-700 font-medium">
              Loading your orders...
            </p>
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
            {/* Tabs */}
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

            {/* Orders List */}
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

                    return (
                      <li
                        key={order.id}
                        className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                      >
                        <div className="flex flex-col md:flex-row">
                          <div className="relative w-full md:w-32 h-32 md:h-full bg-green-100">
                            <img
                              src={image}
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
                                      : order.status === "created"
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
                                  {new Date(order.orderDate).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    }
                                  )}
                                </span>
                              </div>

                              <h3 className="text-lg md:text-xl font-bold text-green-800 mb-1">
                                {listing.productType}{" "}
                                <span className="text-gray-600 font-normal">
                                  ({listing.productType})
                                </span>
                              </h3>

                              <div className="flex items-center mb-3 md:mb-0">
                                <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium mr-3">
                                  {order.quantity} {order.unit}
                                </div>
                                <div className="text-lg font-bold text-green-900">
                                  $
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
                                    navigate("/delivery-verification", {
                                      state: { order },
                                    });
                                  } else if (
                                    isFarmer &&
                                    buttonConfig.isFarmerAction
                                  ) {
                                    if (
                                      order.status === "paid_pending_delivery"
                                    ) {
                                      openTrackingModal(order.id); // Open modal for tracking number
                                    } else {
                                      handleFarmerAction(
                                        order.pdfHash,
                                        "refunded",
                                        ""
                                      ); // No tracking for return
                                    }
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

      {/* Tracking Number Modal */}
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
                Provide the tracking number from your shipping provider to help
                the buyer track the delivery. This ensures transparency and
                updates the order status to 'delivered'.
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
                    alert("Please enter a tracking number");
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
    </div>
  );
};

export default MyOrders;

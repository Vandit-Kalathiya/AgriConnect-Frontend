import React, { useState, useEffect, useMemo } from "react";
import {
  FaShoppingCart,
  FaCheckCircle,
  FaHourglassHalf,
  FaArrowRight,
  FaTruck,
  FaUndo,
  FaMoneyCheckAlt,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaTimes,
  FaSort,
  FaSortUp,
  FaSortDown,
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
  const [activeTab, setActiveTab] = useState("all");
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Modal states
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionComment, setRejectionComment] = useState("");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);

  // Status options for filtering
  const statusOptions = [
    { value: "all", label: "All Orders", count: 0 },
    { value: "created", label: "Pending Payment", count: 0 },
    {
      value: "paid_pending_delivery",
      label: "Paid - Awaiting Delivery",
      count: 0,
    },
    { value: "delivered", label: "Delivered", count: 0 },
    { value: "completed", label: "Completed", count: 0 },
    { value: "return_requested", label: "Return Requested", count: 0 },
    { value: "return_confirmed", label: "Return Confirmed", count: 0 },
    { value: "refunded", label: "Refunded", count: 0 },
  ];

  // Tab configurations
  const tabs = [
    { key: "all", label: "All Orders", color: "gray" },
    { key: "pending_payment", label: "Pending Payment", color: "yellow" },
    { key: "in_progress", label: "In Progress", color: "blue" },
    { key: "completed", label: "Completed", color: "green" },
  ];

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

  useEffect(() => {
    fetchOrders();
  }, []);

  // Memoized filtered and sorted orders
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = [...orders];

    // Tab filter
    if (activeTab !== "all") {
      switch (activeTab) {
        case "pending_payment":
          filtered = filtered.filter((order) => order.status === "created");
          break;
        case "in_progress":
          filtered = filtered.filter((order) =>
            [
              "paid_pending_delivery",
              "delivered",
              "return_requested",
              "return_confirmed",
            ].includes(order.status)
          );
          break;
        case "completed":
          filtered = filtered.filter((order) =>
            ["completed", "refunded"].includes(order.status)
          );
          break;
      }
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((order) => {
        const listing = listings[order.id];
        return (
          listing?.productType?.toLowerCase().includes(term) ||
          order.id.toLowerCase().includes(term) ||
          order.status.toLowerCase().includes(term)
        );
      });
    }

    // Date range filter
    if (dateRange.start) {
      filtered = filtered.filter(
        (order) => new Date(order.createdDate) >= new Date(dateRange.start)
      );
    }
    if (dateRange.end) {
      filtered = filtered.filter(
        (order) => new Date(order.createdDate) <= new Date(dateRange.end)
      );
    }

    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter(
        (order) => order.amount >= parseFloat(priceRange.min)
      );
    }
    if (priceRange.max) {
      filtered = filtered.filter(
        (order) => order.amount <= parseFloat(priceRange.max)
      );
    }

    // Sort orders
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "date":
          aValue = new Date(a.createdDate);
          bValue = new Date(b.createdDate);
          break;
        case "amount":
          aValue = a.amount;
          bValue = b.amount;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "product":
          aValue = listings[a.id]?.productType || "";
          bValue = listings[b.id]?.productType || "";
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [
    orders,
    activeTab,
    statusFilter,
    searchTerm,
    dateRange,
    priceRange,
    sortBy,
    sortOrder,
    listings,
  ]);

  // Calculate status counts
  const statusCounts = useMemo(() => {
    const counts = { all: orders.length };
    orders.forEach((order) => {
      counts[order.status] = (counts[order.status] || 0) + 1;
    });
    return counts;
  }, [orders]);

  // Get tab counts
  const getTabCount = (tabKey) => {
    switch (tabKey) {
      case "all":
        return orders.length;
      case "pending_payment":
        return orders.filter((o) => o.status === "created").length;
      case "in_progress":
        return orders.filter((o) =>
          [
            "paid_pending_delivery",
            "delivered",
            "return_requested",
            "return_confirmed",
          ].includes(o.status)
        ).length;
      case "completed":
        return orders.filter((o) =>
          ["completed", "refunded"].includes(o.status)
        ).length;
      default:
        return 0;
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateRange({ start: "", end: "" });
    setPriceRange({ min: "", max: "" });
    setSortBy("date");
    setSortOrder("desc");
  };

  const hasActiveFilters =
    searchTerm ||
    statusFilter !== "all" ||
    dateRange.start ||
    dateRange.end ||
    priceRange.min ||
    priceRange.max;

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

  const getSortIcon = (field) => {
    if (sortBy !== field) return <FaSort className="ml-1 text-gray-400" />;
    return sortOrder === "asc" ? (
      <FaSortUp className="ml-1 text-green-600" />
    ) : (
      <FaSortDown className="ml-1 text-green-600" />
    );
  };

  return (
    <div className="bg-gray-50 py-8 md:py-12 px-4 md:px-6 lg:px-8 ml-0 md:ml-20 mt-16 md:mt-20 min-h-screen">
      <div className="max-w-full md:max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-green-800 flex items-center">
            <FaShoppingCart className="mr-3 text-green-600" /> My Orders
          </h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-4 py-2 rounded-lg border transition-all duration-300 ${
                showFilters
                  ? "bg-green-100 border-green-300 text-green-700"
                  : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <FaFilter className="mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 bg-green-600 text-white text-xs rounded-full px-2 py-1">
                  {
                    [
                      searchTerm,
                      statusFilter !== "all",
                      dateRange.start,
                      dateRange.end,
                      priceRange.min,
                      priceRange.max,
                    ].filter(Boolean).length
                  }
                </span>
              )}
            </button>
            <button
              onClick={() => navigate("/crops")}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-all duration-300 flex items-center shadow-md"
            >
              Browse Marketplace <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products, order ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">
                    All Statuses ({statusCounts.all || 0})
                  </option>
                  {statusOptions.slice(1).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label} ({statusCounts[option.value] || 0})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date From
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) =>
                      setDateRange((prev) => ({
                        ...prev,
                        start: e.target.value,
                      }))
                    }
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date To
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) =>
                      setDateRange((prev) => ({ ...prev, end: e.target.value }))
                    }
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Amount
                </label>
                <input
                  type="number"
                  placeholder="₹ 0"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, min: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Amount
                </label>
                <input
                  type="number"
                  placeholder="₹ 99999"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, max: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="date">Date</option>
                  <option value="amount">Amount</option>
                  <option value="status">Status</option>
                  <option value="product">Product</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">
                Showing {filteredAndSortedOrders.length} of {orders.length}{" "}
                orders
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-600 hover:text-red-700 flex items-center"
                >
                  <FaTimes className="mr-1" />
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        )}

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
            {/* Tabs */}
            <div className="flex bg-white rounded-t-xl shadow-md mb-1 border-b border-gray-200 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 min-w-max py-3 px-4 text-center font-medium transition-all duration-300 ${
                    activeTab === tab.key
                      ? `text-${tab.color}-700 border-b-2 border-${tab.color}-500 bg-${tab.color}-50`
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  {tab.label} ({getTabCount(tab.key)})
                </button>
              ))}
            </div>

            {/* Results Summary */}
            {!showFilters && hasActiveFilters && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex justify-between items-center">
                <span className="text-blue-800 text-sm">
                  Showing {filteredAndSortedOrders.length} filtered results
                </span>
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                >
                  <FaTimes className="mr-1" />
                  Clear Filters
                </button>
              </div>
            )}

            {/* Orders List */}
            <div className="bg-white rounded-b-xl shadow-lg p-4 md:p-6">
              {/* Sort Controls (Mobile) */}
              <div className="flex justify-between items-center mb-4 md:hidden">
                <span className="text-sm text-gray-600">
                  {filteredAndSortedOrders.length} orders
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setSortBy(sortBy === "date" ? "amount" : "date")
                    }
                    className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full"
                  >
                    Sort by {sortBy === "date" ? "Amount" : "Date"}
                    {getSortIcon(sortBy)}
                  </button>
                </div>
              </div>

              {filteredAndSortedOrders.length === 0 ? (
                <div className="text-center py-12">
                  <FaShoppingCart className="text-green-500 text-5xl mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {hasActiveFilters
                      ? "No matching orders found"
                      : "No orders found"}
                  </h3>
                  <p className="text-md text-gray-600 max-w-md mx-auto">
                    {hasActiveFilters
                      ? "Try adjusting your filters to see more results."
                      : activeTab === "pending_payment"
                      ? "You haven't placed any orders yet requiring payment."
                      : activeTab === "in_progress"
                      ? "No orders are currently in progress."
                      : activeTab === "completed"
                      ? "No orders have been completed or refunded."
                      : "You haven't placed any orders yet."}
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="mt-4 bg-green-600 text-white py-2 px-4 rounded-full hover:bg-green-700 transition-all"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              ) : (
                <ul className="space-y-5">
                  {filteredAndSortedOrders.map((order) => {
                    const buttonConfig = getButtonConfig(order);
                    const isFarmer =
                      currentUser?.uniqueHexAddress === order.farmerAddress;
                    const listing = listings[order.id];
                    const image = images[order.id];

                    return (
                      <li
                        key={order.id}
                        className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <div className="flex flex-col md:flex-row">
                          <div className="relative w-full md:w-32 h-32 md:h-full bg-green-100">
                            <img
                              src={image || "/placeholder-image.jpg"}
                              alt={listing?.productType || "Product"}
                              className="w-full h-full object-cover"
                            />
                            {/* Order ID Badge */}
                            <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                              #{order.id.slice(-6)}
                            </div>
                          </div>
                          <div className="flex-1 p-4 md:p-5 flex flex-col md:flex-row md:items-center">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center mb-2 gap-2">
                                <span
                                  className={`flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                    order.status === "completed" ||
                                    order.status === "refunded"
                                      ? "text-green-700 bg-green-100"
                                      : order.status === "created" ||
                                        order.status === "return_confirmed"
                                      ? "text-yellow-700 bg-yellow-100"
                                      : order.status === "return_requested"
                                      ? "text-red-700 bg-red-100"
                                      : "text-blue-700 bg-blue-100"
                                  }`}
                                >
                                  {order.status === "completed" ||
                                  order.status === "refunded" ? (
                                    <FaCheckCircle className="mr-1" />
                                  ) : order.status === "created" ||
                                    order.status === "return_confirmed" ? (
                                    <FaHourglassHalf className="mr-1" />
                                  ) : order.status === "return_requested" ? (
                                    <FaUndo className="mr-1" />
                                  ) : (
                                    <FaTruck className="mr-1" />
                                  )}
                                  {order.status
                                    .replace(/_/g, " ")
                                    .toUpperCase()}
                                </span>
                                <span className="text-gray-500 text-sm flex items-center">
                                  <FaCalendarAlt className="mr-1" />
                                  {new Date(
                                    order.createdDate
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                                {isFarmer && (
                                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                    Farmer View
                                  </span>
                                )}
                              </div>
                              <h3 className="text-lg md:text-xl font-bold text-green-800 mb-2">
                                {listing?.productType || "Loading..."}
                              </h3>
                              <div className="flex flex-wrap items-center gap-3 mb-3 md:mb-0">
                                <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium text-sm">
                                  {listing?.quantity} {listing?.unitOfQuantity}
                                </div>
                                <div className="text-xl font-bold text-green-900">
                                  ₹{" "}
                                  {order.amount.toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </div>
                                {listing?.location && (
                                  <div className="text-sm text-gray-600">
                                    📍 {listing.location}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="mt-4 md:mt-0 md:ml-4 flex flex-col gap-2">
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
                                    : "bg-green-600 text-white hover:bg-green-700 transform hover:-translate-y-1 hover:shadow-lg"
                                }`}
                              >
                                <buttonConfig.icon className="mr-2" />
                                {buttonConfig.text}
                              </button>
                              {order.status === "delivered" && !isFarmer && (
                                <button
                                  className="border-2 border-red-300 text-sm text-red-700 hover:bg-red-50 hover:border-red-400 px-4 py-2 rounded-lg flex items-center justify-center w-full md:w-auto transition-all duration-300"
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

      {/* Tracking Modal */}
      {showTrackingModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-pulse">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                <FaTruck className="mr-3" />
                Confirm Delivery
              </h2>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Tracking Number *
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  placeholder="Enter tracking number (e.g., TRK123456789)"
                />
                <p className="text-xs text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                  💡 Provide the tracking number from your shipping provider for
                  order verification.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={closeTrackingModal}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium"
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
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center justify-center font-medium shadow-md"
                >
                  <FaTruck className="mr-2" />
                  Confirm Delivery
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <XCircle className="mr-3 h-6 w-6 text-red-600" />
                Reject Delivery
              </h3>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Reason for rejection: *
                </label>
                <select
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-all"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                >
                  <option value="">Select a reason</option>
                  <option value="Product quality does not match contract specifications">
                    Product quality does not match specifications
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
                    Delayed delivery beyond timeframe
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Additional comments:
                </label>
                <textarea
                  className="w-full p-3 border-2 border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-all resize-none"
                  placeholder="Please provide detailed information about the issue..."
                  value={rejectionComment}
                  onChange={(e) => setRejectionComment(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <button
                  className="flex-1 border-2 border-gray-300 rounded-lg px-4 py-3 hover:bg-gray-50 transition-all font-medium"
                  onClick={handleCloseRejectModal}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg flex items-center justify-center transition-all font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleConfirmRejection}
                  disabled={!rejectionReason}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verify Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              {!verificationComplete ? (
                <>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                    <FaCheckCircle className="mr-3 h-6 w-6 text-green-600" />
                    Verify Delivery
                  </h3>
                  <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed">
                      Please confirm that you have received your order and
                      everything is in accordance with your purchase agreement.
                    </p>
                    <div className="mt-3 text-sm text-green-700 font-medium">
                      ⚠️ This action cannot be undone once confirmed.
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      className="flex-1 border-2 border-gray-300 rounded-lg px-4 py-3 hover:bg-gray-50 transition-all font-medium"
                      onClick={() => setShowVerifyModal(false)}
                    >
                      Close
                    </button>
                    <button
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg flex items-center justify-center transition-all font-medium shadow-md"
                      onClick={confirmDeliveryVerification}
                    >
                      <FaCheckCircle className="mr-2" />
                      Confirm Delivery
                    </button>
                  </div>
                </>
              ) : (
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-8 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="bg-emerald-100 p-4 rounded-full animate-bounce">
                      <ThumbsUp className="h-12 w-12 text-emerald-600" />
                    </div>
                    <h3 className="font-bold text-emerald-900 text-2xl">
                      Delivery Verified! 🎉
                    </h3>
                    <p className="text-emerald-700 text-lg">
                      Payment has been released to the farmer.
                    </p>
                    <div className="text-sm text-emerald-600 bg-emerald-100 px-4 py-2 rounded-full">
                      Redirecting to payments page...
                    </div>
                  </div>
                  <div className="text-xs text-emerald-600 mt-4 opacity-75">
                    Transaction completed on {new Date().toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;

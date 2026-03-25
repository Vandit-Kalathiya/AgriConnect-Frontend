import React, { useState, useEffect, useMemo } from "react";
import {
  FaShoppingCart,
  FaArrowRight,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaTimes,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaStore,
  FaShoppingBag,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../config/axiosInstance";
import { getCurrentUser } from "../../../helper";
import { API_CONFIG } from "../../config/apiConfig";
import Loader from "../Loader/Loader";
import OrderList from "./OrderList";
import TrackingModal from "./TrackingModal";
import RejectModal from "./RejectModal";
import VerifyModal from "./VerifyModal";
import toast from "react-hot-toast";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [listings, setListings] = useState({});
  const [images, setImages] = useState({});
  const [activeTab, setActiveTab] = useState("pending_payment");
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  
  // Role filter: 'buyer' or 'seller'
  const [roleFilter, setRoleFilter] = useState("buyer");

  // Modal states
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionComment, setRejectionComment] = useState("");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Status options for filtering
  const statusOptions = [
    { value: "all", label: "All Orders" },
    { value: "created", label: "Pending Payment" },
    { value: "paid_pending_delivery", label: "Paid - Awaiting Delivery" },
    { value: "delivered", label: "Delivered" },
    { value: "completed", label: "Completed" },
    { value: "return_requested", label: "Return Requested" },
    { value: "return_confirmed", label: "Return Confirmed" },
    { value: "refunded", label: "Refunded" },
  ];

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
      const response = await api.get(
        `${API_CONFIG.CONTRACT_FARMING}/orders/u/${user.uniqueHexAddress}`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      const fetchedOrders = response.data;
      setOrders(fetchedOrders);

      const listingPromises = fetchedOrders.map((order) =>
        fetchListingById(order.listingId).then((listing) => ({
          orderId: order.id,
          listing,
        })),
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
            : Promise.resolve({ orderId, blobUrl: null }),
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
      const res = await api.get(
        `${API_CONFIG.MARKET_ACCESS}/image/${imageId}`,
        {
          responseType: "blob",
        },
      );
      return URL.createObjectURL(res.data);
    } catch (err) {
      console.error("Failed to fetch image:", err);
      return null;
    }
  };

  const fetchListingById = async (listingId) => {
    try {
      const response = await api.get(
        `${API_CONFIG.MARKET_ACCESS}/listings/get/${listingId}`,
        { withCredentials: true },
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

  // Memoized filtered and sorted orders
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = [...orders];

    // Role filter - FIRST filter by buyer/seller
    if (currentUser) {
      if (roleFilter === "buyer") {
        // Show orders where user is the buyer (NOT the farmer)
        filtered = filtered.filter(
          (order) => order.farmerAddress !== currentUser.uniqueHexAddress
        );
      } else if (roleFilter === "seller") {
        // Show orders where user is the farmer/seller
        filtered = filtered.filter(
          (order) => order.farmerAddress === currentUser.uniqueHexAddress
        );
      }
    }

    // Tab filter
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
          ].includes(order.status),
        );
        break;
      case "completed":
        filtered = filtered.filter((order) =>
          ["completed", "refunded"].includes(order.status),
        );
        break;
      default:
        break;
    }

    // Status filter (additional to tab filter)
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
        (order) => new Date(order.createdDate) >= new Date(dateRange.start),
      );
    }
    if (dateRange.end) {
      filtered = filtered.filter(
        (order) => new Date(order.createdDate) <= new Date(dateRange.end),
      );
    }

    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter(
        (order) => order.amount >= parseFloat(priceRange.min),
      );
    }
    if (priceRange.max) {
      filtered = filtered.filter(
        (order) => order.amount <= parseFloat(priceRange.max),
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
    roleFilter,
    currentUser,
  ]);

  // Calculate status counts based on role filter
  const statusCounts = useMemo(() => {
    let roleFilteredOrders = orders;
    
    if (currentUser) {
      if (roleFilter === "buyer") {
        roleFilteredOrders = orders.filter(
          (order) => order.farmerAddress !== currentUser.uniqueHexAddress
        );
      } else if (roleFilter === "seller") {
        roleFilteredOrders = orders.filter(
          (order) => order.farmerAddress === currentUser.uniqueHexAddress
        );
      }
    }
    
    const counts = { all: roleFilteredOrders.length };
    roleFilteredOrders.forEach((order) => {
      counts[order.status] = (counts[order.status] || 0) + 1;
    });
    return counts;
  }, [orders, roleFilter, currentUser]);

  // Get tab counts based on role filter
  const getTabCount = (tabKey) => {
    let roleFilteredOrders = orders;
    
    if (currentUser) {
      if (roleFilter === "buyer") {
        roleFilteredOrders = orders.filter(
          (order) => order.farmerAddress !== currentUser.uniqueHexAddress
        );
      } else if (roleFilter === "seller") {
        roleFilteredOrders = orders.filter(
          (order) => order.farmerAddress === currentUser.uniqueHexAddress
        );
      }
    }
    
    switch (tabKey) {
      case "pending_payment":
        return roleFilteredOrders.filter((o) => o.status === "created").length;
      case "in_progress":
        return roleFilteredOrders.filter((o) =>
          [
            "paid_pending_delivery",
            "delivered",
            "return_requested",
            "return_confirmed",
          ].includes(o.status),
        ).length;
      case "completed":
        return roleFilteredOrders.filter((o) =>
          ["completed", "refunded"].includes(o.status),
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

  const handleFarmerAction = async (orderId, newStatus, deliveryData) => {
    setIsProcessingPayment(true);
    try {
      if (newStatus === "delivered") {
        await api.post(
          `${API_CONFIG.CONTRACT_FARMING}/api/payments/confirm-delivery/${orderId}/${deliveryData.trackingNumber}`,
          {},
          { withCredentials: true },
        );
        toast.success("Delivery confirmed successfully!");
      } else if (newStatus === "return_confirmed") {
        await api.post(
          `${API_CONFIG.CONTRACT_FARMING}/api/payments/confirm-return/${orderId}`,
          {},
          { withCredentials: true },
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
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleBuyerRefund = async (orderId) => {
    setIsProcessingPayment(true);
    try {
      await api.post(
        `${API_CONFIG.CONTRACT_FARMING}/api/payments/reject-delivery/${orderId}`,
        {},
        { withCredentials: true },
      );
      toast.success("Refund processed successfully!");
      fetchOrders();
    } catch (error) {
      console.error("Error processing refund:", error);
      toast.error("Failed to process refund");
    } finally {
      setIsProcessingPayment(false);
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

    setIsProcessingPayment(true);
    try {
      const order = orders.find((o) => o.id === selectedOrderId);
      if (!order) {
        toast.error("Order not found");
        return;
      }

      const finalRes = await api.post(
        `${API_CONFIG.CONTRACT_FARMING}/api/payments/request-return/${order.id}/abcd`,
        { withCredentials: true },
      );
      const res = finalRes.data;
      if (res.success) {
        toast.success(res.message);
        handleCloseRejectModal();
        fetchOrders();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error("Error rejecting delivery:", error);
      toast.error("Failed to reject delivery");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleVerifyDelivery = (orderId) => {
    setSelectedOrderId(orderId);
    setShowVerifyModal(true);
  };

  const confirmDeliveryVerification = async () => {
    try {
      const order = orders.find((o) => o.id === selectedOrderId);
      const res = await api.post(
        `${API_CONFIG.CONTRACT_FARMING}/api/payments/verify-delivery/${order.pdfHash}`,
        {},
        { withCredentials: true },
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
    <div className="bg-gray-50 py-8 md:py-12 px-4 md:px-6 lg:px-8 ml-0 md:ml-20 mt-14 sm:mt-16 min-h-screen">
      <div className="max-w-full md:max-w-6xl mx-auto">
        {/* Header with Enhanced Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-green-800 flex items-center">
            <FaShoppingCart className="mr-3 text-green-600" /> Orders
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

        {/* Role Filter Toggle - Buyer vs Seller */}
        <div className="bg-white rounded-xl shadow-lg mb-4 p-2 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600 px-2">
              <FaShoppingCart className="text-gray-400" />
              <span className="hidden sm:inline font-medium">View as:</span>
            </div>
            <div className="flex bg-gray-100 rounded-lg p-1 gap-2">
              <button
                onClick={() => {
                  setRoleFilter("buyer");
                  setActiveTab("pending_payment");
                }}
                className={`flex items-center px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  roleFilter === "buyer"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md transform scale-105"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <FaShoppingBag className="mr-2" size={16} />
                <span>My Purchases</span>
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-white/20 font-bold">
                  {orders.filter(
                    (o) => currentUser && o.farmerAddress !== currentUser.uniqueHexAddress
                  ).length}
                </span>
              </button>
              <button
                onClick={() => {
                  setRoleFilter("seller");
                  setActiveTab("pending_payment");
                }}
                className={`flex items-center px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  roleFilter === "seller"
                    ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md transform scale-105"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <FaStore className="mr-2" size={16} />
                <span>My Sales</span>
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-white/20 font-bold">
                  {orders.filter(
                    (o) => currentUser && o.farmerAddress === currentUser.uniqueHexAddress
                  ).length}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Context Banner */}
        {!isLoading && orders.length > 0 && (
          <div
            className={`mb-6 p-4 rounded-lg border-l-4 ${
              roleFilter === "buyer"
                ? "bg-blue-50 border-blue-500"
                : "bg-green-50 border-green-500"
            }`}
          >
            <div className="flex items-center">
              {roleFilter === "buyer" ? (
                <>
                  <FaShoppingBag className="text-blue-600 mr-3" size={20} />
                  <div>
                    <p className="text-sm font-semibold text-blue-800">
                      Purchase Orders
                    </p>
                    <p className="text-xs text-blue-600 mt-0.5">
                      Viewing products you've bought from farmers
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <FaStore className="text-green-600 mr-3" size={20} />
                  <div>
                    <p className="text-sm font-semibold text-green-800">
                      Sales Orders
                    </p>
                    <p className="text-xs text-green-600 mt-0.5">
                      Viewing products you've sold to buyers
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200 animate-fadeIn">
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
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
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
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
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
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
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
                  className="text-sm text-red-600 hover:text-red-700 flex items-center transition-colors"
                >
                  <FaTimes className="mr-1" />
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Filter Summary (when filters panel is closed) */}
        {!showFilters && hasActiveFilters && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex justify-between items-center">
            <span className="text-blue-800 text-sm">
              Showing {filteredAndSortedOrders.length} filtered results
            </span>
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-700 text-sm flex items-center transition-colors"
            >
              <FaTimes className="mr-1" />
              Clear Filters
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-124">
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
            {isProcessingPayment && <Loader />}
            <OrderList
              orders={filteredAndSortedOrders} // Pass filtered orders instead of filteredOrders
              listings={listings}
              images={images}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              currentUser={currentUser}
              openTrackingModal={openTrackingModal}
              handleVerifyDelivery={handleVerifyDelivery}
              handleOpenRejectModal={handleOpenRejectModal}
              handleBuyerRefund={handleBuyerRefund}
              pendingPaymentCount={getTabCount("pending_payment")}
              inProgressCount={getTabCount("in_progress")}
              completedCount={getTabCount("completed")}
              handleFarmerAction={handleFarmerAction}
              fetchOrders={fetchOrders}
              roleFilter={roleFilter}
              // Additional props for enhanced functionality
              hasActiveFilters={hasActiveFilters}
              totalOrders={orders.length}
              filteredCount={filteredAndSortedOrders.length}
            />
          </>
        )}
      </div>

      {/* Modals */}
      {showTrackingModal && (
        <TrackingModal
          closeTrackingModal={closeTrackingModal}
          trackingNumber={trackingNumber}
          setTrackingNumber={setTrackingNumber}
          selectedOrderId={selectedOrderId}
          orders={orders}
          handleFarmerAction={handleFarmerAction}
        />
      )}

      {showRejectModal && (
        <RejectModal
          handleCloseRejectModal={handleCloseRejectModal}
          rejectionReason={rejectionReason}
          setRejectionReason={setRejectionReason}
          rejectionComment={rejectionComment}
          setRejectionComment={setRejectionComment}
          selectedOrderId={selectedOrderId}
          handleConfirmRejection={handleConfirmRejection}
        />
      )}

      {showVerifyModal && (
        <VerifyModal
          verificationComplete={verificationComplete}
          setShowVerifyModal={setShowVerifyModal}
          confirmDeliveryVerification={confirmDeliveryVerification}
          selectedOrderId={selectedOrderId}
          orders={orders}
          handleBuyerRefund={handleBuyerRefund}
        />
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MyOrders;

import React, { useEffect, useState, useMemo } from "react";
import {
  FaMoneyBillWave,
  FaCheckCircle,
  FaPercentage,
  FaSearch,
  FaShoppingCart,
  FaStore,
  FaShoppingBag,
  FaArrowDown,
  FaArrowUp,
} from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import { getCurrentUser } from "../../../helper";
import Loader from "../Loader/Loader";
import { API_CONFIG } from "../../config/apiConfig";
import { useCursorPagination, buildPaginationParams } from "../../hooks/useCursorPagination";
import PaginationControls from "../Common/PaginationControls";
import LoadMoreButton from "../Common/LoadMoreButton";

const Payments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [paginationMode, setPaginationMode] = useState("paginated");

  // Role filter: 'buyer' or 'seller' - Default to seller (Payments Received)
  const [roleFilter, setRoleFilter] = useState("seller");

  // Fetch function for cursor pagination (changes based on roleFilter)
  const fetchPaymentsPaginated = async (cursor = null, limit = 20) => {
    try {
      const currentUser = user || await getCurrentUser();
      if (!currentUser?.uniqueHexAddress) {
        throw new Error("User not logged in");
      }

      if (!user) {
        setUser(currentUser);
      }

      const params = buildPaginationParams(cursor, limit, "DESC");
      
      // Choose endpoint based on role filter
      const endpoint = roleFilter === "buyer" 
        ? `${API_CONFIG.CONTRACT_FARMING}/orders/buyer/${currentUser.uniqueHexAddress}/paginated?${params}&status=completed`
        : `${API_CONFIG.CONTRACT_FARMING}/orders/farmer/${currentUser.uniqueHexAddress}/paginated?${params}&status=completed`;

      const response = await axios.get(endpoint, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      return response.data; // Returns { data: [...], metadata: {...} }
    } catch (error) {
      console.error("Error fetching payments:", error);
      throw error;
    }
  };

  // Use cursor pagination hook
  const {
    data: payments,
    metadata,
    isLoading,
    error,
    loadFirstPage,
    loadNextPage,
    loadPrevPage,
    loadMore,
    refresh,
    reset,
    hasNextPage,
    hasPrevPage,
    currentPage,
  } = useCursorPagination(fetchPaymentsPaginated, 20);

  // Load first page on mount or when roleFilter changes
  useEffect(() => {
    reset(); // Reset pagination state
    loadFirstPage();
  }, [roleFilter]);

  // Shorten hash for display
  const shortenHash = (hash) => {
    if (!hash || hash.length < 10) return hash || "N/A";
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  // Filter transactions by search query
  const filteredTransactions = useMemo(() => {
    let filtered = payments;

    // Search filter
    filtered = filtered.filter((txn) =>
      `${txn.id || ""} ${txn.buyerAddress || ""} ${txn.farmerAddress || ""}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

    // Sort by timestamp or date
    return filtered.sort((a, b) => {
      const dateA = a.timestamp || new Date(a.createdDate).getTime() || 0;
      const dateB = b.timestamp || new Date(b.createdDate).getTime() || 0;
      return dateB - dateA;
    });
  }, [payments, searchQuery]);

  // Calculate payment overview data based on role
  const calculatePaymentData = () => {
    const totalAmount = filteredTransactions.reduce(
      (sum, payment) => sum + (payment.amount || 0),
      0
    );
    const completedCount = filteredTransactions.filter((payment) =>
      payment.status?.includes("completed")
    ).length;
    const successRate =
      filteredTransactions.length > 0
        ? (completedCount / filteredTransactions.length) * 100
        : 0;

    return {
      totalAmount: totalAmount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      completedCount: completedCount.toLocaleString("en-US"),
      successRate: successRate.toFixed(1),
    };
  };

  const getMaxAmount = () => {
    return filteredTransactions.reduce((max, payment) => {
      return Math.max(max, payment.amount || 0);
    }, 0);
  };

  const paymentData = calculatePaymentData();

  return (
    <div className="min-h-screen bg-gray-50 py-6 md:py-12 px-4 md:px-6 lg:px-8 ml-0 md:ml-20 mt-16 md:mt-18">
      <div className="max-w-full md:max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-green-800 flex items-center">
            <FaMoneyBillWave className="mr-3 text-green-600" /> Payments
          </h1>
          
          {/* Pagination Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setPaginationMode("paginated")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                paginationMode === "paginated"
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
              title="Navigate with Previous/Next buttons"
            >
              Pages
            </button>
            <button
              onClick={() => setPaginationMode("loadMore")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                paginationMode === "loadMore"
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
              title="Load more items infinitely"
            >
              Load More
            </button>
          </div>
        </div>

        {/* Role Filter Toggle - Buyer vs Seller */}
        <div className="bg-white rounded-xl shadow-lg mb-4 p-2 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600 px-2">
              <FaMoneyBillWave className="text-gray-400" />
              <span className="hidden sm:inline font-medium">View as:</span>
            </div>
            <div className="flex bg-gray-100 rounded-lg p-1 gap-2">
              <button
                onClick={() => setRoleFilter("seller")}
                className={`flex items-center px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  roleFilter === "seller"
                    ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md transform scale-105"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <FaArrowDown className="mr-2" size={16} />
                <span>Payments Received</span>
                {roleFilter === "seller" && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-white/20 font-bold">
                    {payments.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setRoleFilter("buyer")}
                className={`flex items-center px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  roleFilter === "buyer"
                    ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md transform scale-105"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <FaArrowUp className="mr-2" size={16} />
                <span>Payments Made</span>
                {roleFilter === "buyer" && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-white/20 font-bold">
                    {payments.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Context Banner */}
        {!isLoading && payments.length > 0 && (
          <div
            className={`mb-6 p-4 rounded-lg border-l-4 ${
              roleFilter === "buyer"
                ? "bg-red-50 border-red-500"
                : "bg-green-50 border-green-500"
            }`}
          >
            <div className="flex items-center">
              {roleFilter === "buyer" ? (
                <>
                  <FaArrowUp className="text-red-600 mr-3" size={20} />
                  <div>
                    <p className="text-sm font-semibold text-red-800">
                      Payments Made (Outgoing)
                    </p>
                    <p className="text-xs text-red-600 mt-0.5">
                      Money you've paid to farmers for purchases
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <FaArrowDown className="text-green-600 mr-3" size={20} />
                  <div>
                    <p className="text-sm font-semibold text-green-800">
                      Payments Received (Incoming)
                    </p>
                    <p className="text-xs text-green-600 mt-0.5">
                      Money you've received from buyers for your sales
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Hero Section - Payments Overview */}
        <div
          className={`bg-gradient-to-r ${
            roleFilter === "buyer"
              ? "from-red-600 to-red-800"
              : "from-green-600 to-green-800"
          } text-white rounded-lg p-4 md:p-6 mb-4 md:mb-8 shadow-lg transition-all duration-300`}
        >
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
            {roleFilter === "buyer"
              ? "Payments Made Overview"
              : "Revenue Overview"}
          </h2>
          {isLoading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              {[
                {
                  icon: FaMoneyBillWave,
                  label:
                    roleFilter === "buyer" ? "Total Paid" : "Total Received",
                  value: `₹${paymentData.totalAmount}`,
                  sub: "All Transactions",
                },
                {
                  icon: FaCheckCircle,
                  label: "Completed Transactions",
                  value: paymentData.completedCount,
                  sub: "Successful",
                },
                {
                  icon: FaPercentage,
                  label: "Success Rate",
                  value: `${paymentData.successRate}%`,
                  sub: "Reliability",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="rounded-md p-3 md:p-4 flex items-center gap-2 md:gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <item.icon
                    className={`text-2xl md:text-3xl ${
                      roleFilter === "buyer" ? "text-red-200" : "text-green-200"
                    }`}
                  />
                  <div>
                    <h3
                      className={`text-xs md:text-sm font-semibold ${
                        roleFilter === "buyer"
                          ? "text-red-100"
                          : "text-green-100"
                      }`}
                    >
                      {item.label}
                    </h3>
                    <p className="text-lg md:text-2xl font-bold">
                      {item.value}
                    </p>
                    <p
                      className={`text-xs ${
                        roleFilter === "buyer"
                          ? "text-red-200"
                          : "text-green-200"
                      }`}
                    >
                      {item.sub}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Transaction Trends */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-4 md:mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 md:mb-4">
            Transaction Trends
          </h2>
          {filteredTransactions.length > 0 ? (
            <div className="flex items-end gap-1 md:gap-2 h-24 md:h-32 overflow-x-auto">
              {filteredTransactions.slice(0, 20).map((payment, index) => (
                <motion.div
                  key={payment.paymentId || index}
                  className={`${
                    roleFilter === "buyer" ? "bg-red-600" : "bg-green-600"
                  } rounded-t w-8 md:w-10 flex-shrink-0`}
                  style={{
                    height: `${Math.min(
                      ((payment.amount || 0) / getMaxAmount()) * 100,
                      100
                    )}%`,
                  }}
                  initial={{ height: 0 }}
                  animate={{
                    height:
                      Math.min(
                        ((payment.amount || 0) / getMaxAmount()) * 100,
                        100
                      ) + "%",
                  }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  title={`₹${payment.amount || 0}`}
                >
                  <span className="text-xs text-white mt-1 block text-center">
                    ₹
                    {(payment.amount || 0) > 999
                      ? `${((payment.amount || 0) / 1000).toFixed(1)}k`
                      : payment.amount || 0}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 italic">
              No transaction data available
            </p>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 md:gap-6 mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">
              Recent Transactions ({filteredTransactions.length})
            </h2>
            <div className="relative w-full sm:w-64">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID or Address"
                className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {isLoading ? (
            <Loader />
          ) : error ? (
            <div className="text-center py-12">
              <FaShoppingCart className="text-red-500 text-5xl mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-red-700 mb-2">Error</h3>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <FaMoneyBillWave className="text-gray-300 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Transactions Found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {searchQuery
                  ? "No transactions match your search."
                  : roleFilter === "buyer"
                  ? "You haven't made any payments yet."
                  : "You haven't received any payments yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <motion.div
                  key={transaction.id || transaction.timestamp}
                  className={`border ${
                    roleFilter === "buyer"
                      ? "border-red-200 bg-red-50"
                      : "border-green-200 bg-green-50"
                  } rounded-md p-4 hover:shadow-lg transition-shadow duration-300`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {roleFilter === "buyer" ? (
                          <FaArrowUp className="text-red-600" size={16} />
                        ) : (
                          <FaArrowDown className="text-green-600" size={16} />
                        )}
                        <h3 className="text-md md:text-lg font-semibold text-gray-800">
                          {shortenHash(transaction.id)}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-700">
                        <strong>
                          {roleFilter === "buyer"
                            ? "Paid to Farmer:"
                            : "Received from Buyer:"}
                        </strong>{" "}
                        {roleFilter === "buyer"
                          ? shortenHash(transaction.farmerAddress)
                          : shortenHash(transaction.buyerAddress)}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Date:</strong> {transaction.createdDate}
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <strong>Time:</strong>{" "}
                        {transaction.createdTime?.toString().substring(0, 5)}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p
                        className={`text-lg font-bold ${
                          roleFilter === "buyer"
                            ? "text-red-700"
                            : "text-green-700"
                        }`}
                      >
                        {roleFilter === "buyer" ? "- " : "+ "}₹
                        {(transaction.amount || 0).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                          transaction.status === "completed"
                            ? "bg-green-200 text-green-800"
                            : transaction.status?.includes("pending")
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {transaction.status?.includes("completed")
                          ? "Completed"
                          : transaction.status || "Unknown"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {!isLoading && filteredTransactions.length > 0 && (
            <div className="mt-6">
              {paginationMode === "paginated" ? (
                <PaginationControls
                  hasNext={hasNextPage}
                  hasPrev={hasPrevPage}
                  onNext={loadNextPage}
                  onPrev={loadPrevPage}
                  onRefresh={refresh}
                  isLoading={isLoading}
                  currentPage={currentPage}
                  returnedCount={metadata.returnedCount || payments.length}
                  pageSize={metadata.pageSize || 20}
                  color={roleFilter === "buyer" ? "red" : "green"}
                />
              ) : (
                <LoadMoreButton
                  onLoadMore={loadMore}
                  hasMore={hasNextPage}
                  isLoading={isLoading}
                  color={roleFilter === "buyer" ? "red" : "green"}
                  loadedCount={payments.length}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payments;

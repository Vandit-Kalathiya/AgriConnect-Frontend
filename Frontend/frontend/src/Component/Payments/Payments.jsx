import React, { useEffect, useState } from "react";
import {
  FaMoneyBillWave,
  FaCheckCircle,
  FaPercentage,
  FaSearch,
  FaShoppingCart,
} from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import { getCurrentUser } from "../../../helper";
import Loader from "../Loader/Loader";

const Payments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [payments, setPayments] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch payments and user data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch current user
        const currentUser = await getCurrentUser();
        if (!currentUser?.uniqueHexAddress) {
          throw new Error("User not logged in or missing uniqueHexAddress");
        }
        setUser(currentUser);

        // Fetch all payments
        const buyerResponse = await axios.get(
          `http://localhost:2526/api/payments/buyer/${currentUser?.uniqueHexAddress}`
        );
        const farmerResponse = await axios.get(
          `http://localhost:2526/api/payments/farmer/${currentUser?.uniqueHexAddress}`
        );
        setPayments([...buyerResponse.data, ...farmerResponse.data]);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "Failed to load payments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Shorten hash for display
  const shortenHash = (hash) => {
    if (!hash || hash.length < 10) return hash || "N/A";
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  // Convert timestamp to IST
  const getISTDateTime = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp * 1000);
    return date
      .toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(/,/, "");
  };

  console.log(payments);

  // Filter and sort transactions
  const filteredTransactions = payments
    .filter(
      (txn) =>
        (txn.buyerAddress === user?.uniqueHexAddress ||
          txn.farmerAddress === user?.uniqueHexAddress) &&
        `${txn.id || ""} ${txn.buyerAddress || ""}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  // Calculate payment overview data
  const calculatePaymentData = () => {
    const totalAmount = filteredTransactions.reduce(
      (sum, payment) => sum + (payment.amount || 0),
      0
    );
    const completedCount = filteredTransactions.filter((payment) =>
      payment.status.includes("completed")
    ).length;
    const successRate =
      payments.length > 0
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
    <div className="min-h-screen bg-gray-50 py-6 md:py-12 px-4 md:px-6 lg:px-8 ml-0 md:ml-20 mt-16 md:mt-20">
      <div className="max-w-full md:max-w-6xl mx-auto">
        {/* Hero Section - Payments Overview */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg p-4 md:p-6 mb-4 md:mb-8 shadow-lg">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
            Payments Overview
          </h1>
          {isLoading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              {[
                {
                  icon: FaMoneyBillWave,
                  label: "Total Amount",
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
                  <item.icon className="text-2xl md:text-3xl text-green-200" />
                  <div>
                    <h2 className="text-xs md:text-sm font-semibold text-green-100">
                      {item.label}
                    </h2>
                    <p className="text-lg md:text-2xl font-bold">
                      {item.value}
                    </p>
                    <p className="text-xs text-green-200">{item.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Transaction Trends */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-4 md:mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-green-900 mb-2 md:mb-4">
            Transaction Trends
          </h2>
          {filteredTransactions.length > 0 ? (
            <div className="flex items-end gap-1 md:gap-2 h-24 md:h-32">
              {filteredTransactions.map((payment, index) => (
                <motion.div
                  key={payment.paymentId || index}
                  className="bg-green-600 rounded-t w-8 md:w-10 flex-shrink-0"
                  style={{
                    // Height in percent for the final rendered div
                    height: `${Math.min(
                      ((payment.amount || 0) / getMaxAmount()) * 100,
                      100
                    )}%`,
                  }}
                  // Numeric values in motion props for smooth animation
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
            <h2 className="text-lg md:text-xl font-semibold text-green-900">
              Recent Transactions
            </h2>
            <div className="relative w-full sm:w-64">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID or Buyer"
                className="w-full pl-10 p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
              <FaShoppingCart className="text-green-500 text-5xl mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Transactions Found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {searchQuery
                  ? "No transactions match your search."
                  : "No payments recorded yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <motion.div
                  key={transaction.id || transaction.timestamp}
                  className="border border-green-200 rounded-md p-4 hover:shadow-lg transition-shadow duration-300 bg-green-50"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="text-md md:text-lg font-semibold text-green-800">
                        {transaction.id || "N/A"}
                      </h3>
                      <p className="text-sm text-gray-700">
                        <strong>Buyer :</strong>{" "}
                        {shortenHash(transaction.buyerAddress)}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Date :</strong> {transaction.createdDate}
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <strong>Time :</strong>{" "}
                        {transaction.createdTime.toString().substring(0, 5)}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-lg font-bold text-green-900">
                        ₹
                        {(transaction.amount || 0).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                          transaction.status === "completed"
                            ? "bg-green-200 text-green-800"
                            : transaction.status.contains("pending")
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {transaction.status.includes("completed")
                          ? "Completed"
                          : transaction.status || "Unknown"}
                      </span>
                      <p className="text-xs text-gray-600 mt-1 font-mono truncate">
                        {shortenHash(transaction.id)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payments;

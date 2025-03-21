import React, { useEffect, useState } from "react";
import {
  FaMoneyBillWave,
  FaCheckCircle,
  FaPercentage,
  FaSearch,
  FaDownload,
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

  const fetchAllPayments = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "http://localhost:2526/api/agreements/all"
      );
      console.log("All Payments: ", response.data);
      setPayments(response.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUser = async () => {
    const user = await getCurrentUser();
    setUser(user);
  };

  useEffect(() => {
    fetchAllPayments();
    fetchUser();
  }, []);

  const shortenHash = (hash) => {
    if (!hash || hash.length < 10) return hash;
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  // Filter transactions for the current user
  const filteredTransactions1 = payments.filter(
    (txn) =>
      txn.buyer === user?.uniqueHexAddress ||
      txn.farmer === user?.uniqueHexAddress
  );

  // Further filter by search query
  const filteredTransactions = filteredTransactions1
    .filter((txn) =>
      `${txn.paymentId} ${txn.buyer}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => b.timestamp - a.timestamp); // Sort by timestamp descending

  function getISTDateTime(timestamp) {
    const date = new Date(timestamp * 1000);
    const options = {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    const formatter = new Intl.DateTimeFormat("en-IN", options);
    const parts = formatter.formatToParts(date);
    const day = parts.find((part) => part.type === "day").value;
    const month = parts.find((part) => part.type === "month").value;
    const year = parts.find((part) => part.type === "year").value;
    const hour = parts.find((part) => part.type === "hour").value;
    const minute = parts.find((part) => part.type === "minute").value;
    return `${day}-${month}-${year} ${hour}:${minute}`;
  }

  const paymentData = {
    totalTransactions: 0,
    completedTransactions: payments.length,
    successRate: 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 md:py-12 px-4 md:px-6 lg:px-8 ml-0 md:ml-20 mt-16 md:mt-20">
      <div className="max-w-full md:max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg p-4 md:p-6 mb-4 md:mb-8 shadow-lg">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
            Payments Overview
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                icon: FaMoneyBillWave,
                label: "Total Transactions",
                value: `₹${paymentData.totalTransactions.toLocaleString(
                  "en-US",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}`,
                sub: "All time",
              },
              {
                icon: FaCheckCircle,
                label: "Completed Transactions",
                value:
                  paymentData.completedTransactions.toLocaleString("en-US"),
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
                className="bg-green-100 bg-opacity-20 rounded-md p-3 md:p-4 flex items-center gap-2 md:gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <item.icon className="text-2xl md:text-3xl text-green-800" />
                <div>
                  <h2 className="text-xs md:text-sm font-semibold text-gray-700">
                    {item.label}
                  </h2>
                  <p className="text-lg md:text-2xl font-bold text-gray-700">
                    {item.value}
                  </p>
                  <p className="text-xs text-gray-600">{item.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mini Chart */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-4 md:mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-green-900 mb-2 md:mb-4">
            Transaction Trends
          </h2>
          {filteredTransactions.length > 0 ? (
            <div className="flex items-end gap-1 md:gap-2 h-24 md:h-32 overflow-x-auto">
              {filteredTransactions.map((payment, index) => (
                <motion.div
                  key={index}
                  className="bg-green-600 rounded-t w-10 md:w-12 flex-shrink-0"
                  style={{ height: `${payment.amount / 1200}%` }} // Cap at 100%
                  initial={{ height: 0 }}
                  animate={{
                    height: `${payment.amount / 1200}%`,
                  }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  title={`$₹{payment.amount}`} // Tooltip for full amount
                >
                  <span className="text-xs text-white mt-1 block text-center">
                    ₹
                    {payment.amount > 999
                      ? `${(payment.amount / 1000).toFixed(1)}k`
                      : payment.amount}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 italic">
              No transaction data available for trends
            </p>
          )}
        </div>

        {/* Transactions Section */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 md:gap-6 mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-green-900">
              Recent Transactions
            </h2>
            <div className="relative w-full sm:w-auto">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID or Buyer"
                className="w-full sm:w-64 pl-10 p-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center text-gray-600 text-md md:text-lg">
              <Loader />
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <FaShoppingCart className="text-green-500 text-5xl mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Transactions Found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {searchQuery
                  ? "No transactions match your search criteria."
                  : "You haven't made or received any payments yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <motion.div
                  key={transaction.paymentId}
                  className="border border-green-200 rounded-md p-4 hover:shadow-lg transition-shadow duration-300 bg-green-50"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="text-md md:text-lg font-semibold text-green-800">
                        {transaction.paymentId}
                      </h3>
                      <p className="text-sm text-gray-700">
                        <strong>Buyer:</strong> {shortenHash(transaction.buyer)}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Date:</strong>{" "}
                        {getISTDateTime(transaction.timestamp)}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-lg font-bold text-green-900">
                        ₹
                        {transaction.amount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                          transaction.status === "Signed"
                            ? "bg-green-200 text-green-800"
                            : transaction.status === "Pending"
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {transaction.status === "Signed"
                          ? "Completed"
                          : transaction.status}
                      </span>
                      <p className="text-xs text-gray-600 mt-1 font-mono truncate">
                        {shortenHash(transaction.paymentId)}
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

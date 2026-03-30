import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../../config/axiosInstance";
import WeatherForecast from "./WeatherForecast";
import StatCard from "./StatCard";
import AlertsPanel from "./AlertsPanel";
import TrendingCrops from "../MarketTrends/components/TrendingCrops";
import CurrentMonthHighlights from "../MarketTrends/components/CurrentMonthHighlights";
import {
  FaShoppingCart,
  FaFileContract,
  FaChartLine,
  FaWarehouse,
  FaPlus,
  FaClock,
  FaCheckCircle,
  FaHourglassHalf,
} from "react-icons/fa";
import { getCurrentUser } from "../../../helper";
import { API_CONFIG } from "../../config/apiConfig";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [orders, setOrders] = useState([]);
  const [activeRole, setActiveRole] = useState("farmer");
  const [farmerStats, setFarmerStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    completedOrders: 0,
    pendingOrders: 0,
    ordersGrowth: 0,
    revenueGrowth: 0,
    completedGrowth: 0,
    pendingGrowth: 0,
  });
  const [buyerStats, setBuyerStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    completedOrders: 0,
    pendingOrders: 0,
    ordersGrowth: 0,
    spentGrowth: 0,
    completedGrowth: 0,
    pendingGrowth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [farmerActivity, setFarmerActivity] = useState([]);
  const [buyerActivity, setBuyerActivity] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const user = await getCurrentUser();
      if (!user || !user.uniqueHexAddress) {
        setLoading(false);
        return;
      }

      const response = await api.get(
        `${API_CONFIG.CONTRACT_FARMING}/orders/u/${user.uniqueHexAddress}`
      );

      if (response.data && Array.isArray(response.data)) {
        setOrders(response.data);
        calculateStats(response.data, user.uniqueHexAddress);
        generateRecentActivity(response.data, user.uniqueHexAddress);
      }
    } catch (error) {
      setFarmerStats({
        totalOrders: 0,
        totalRevenue: 0,
        completedOrders: 0,
        pendingOrders: 0,
      });
      setBuyerStats({
        totalOrders: 0,
        totalSpent: 0,
        completedOrders: 0,
        pendingOrders: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ordersData, userAddress) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const farmerOrders = ordersData.filter(
      (order) => order.farmerAddress === userAddress
    );
    const buyerOrders = ordersData.filter(
      (order) => order.buyerAddress === userAddress
    );

    const filterByMonth = (orders, month, year) => {
      return orders.filter((order) => {
        const orderDate = new Date(order.createdDate || order.orderDate);
        return (
          orderDate.getMonth() === month && orderDate.getFullYear() === year
        );
      });
    };

    const currentFarmerOrders = filterByMonth(
      farmerOrders,
      currentMonth,
      currentYear
    );
    const lastFarmerOrders = filterByMonth(
      farmerOrders,
      lastMonth,
      lastMonthYear
    );

    const currentBuyerOrders = filterByMonth(
      buyerOrders,
      currentMonth,
      currentYear
    );
    const lastBuyerOrders = filterByMonth(
      buyerOrders,
      lastMonth,
      lastMonthYear
    );

    const farmerCompleted = farmerOrders.filter(
      (order) => order.status?.toLowerCase() === "completed"
    );
    const farmerPending = farmerOrders.filter((order) =>
      ["delivered", "paid_pending_delivery", "created"].includes(
        order.status?.toLowerCase()
      )
    );
    const farmerRevenue = farmerCompleted.reduce(
      (sum, order) => sum + (order.amount || 0),
      0
    );

    const currentFarmerCompleted = currentFarmerOrders.filter(
      (order) => order.status?.toLowerCase() === "completed"
    );
    const lastFarmerCompleted = lastFarmerOrders.filter(
      (order) => order.status?.toLowerCase() === "completed"
    );
    const currentFarmerRevenue = currentFarmerCompleted.reduce(
      (sum, order) => sum + (order.amount || 0),
      0
    );
    const lastFarmerRevenue = lastFarmerCompleted.reduce(
      (sum, order) => sum + (order.amount || 0),
      0
    );

    const buyerCompleted = buyerOrders.filter(
      (order) => order.status?.toLowerCase() === "completed"
    );
    const buyerPending = buyerOrders.filter((order) =>
      ["delivered", "paid_pending_delivery", "created"].includes(
        order.status?.toLowerCase()
      )
    );
    const buyerSpent = buyerCompleted.reduce(
      (sum, order) => sum + (order.amount || 0),
      0
    );

    const currentBuyerCompleted = currentBuyerOrders.filter(
      (order) => order.status?.toLowerCase() === "completed"
    );
    const lastBuyerCompleted = lastBuyerOrders.filter(
      (order) => order.status?.toLowerCase() === "completed"
    );
    const currentBuyerSpent = currentBuyerCompleted.reduce(
      (sum, order) => sum + (order.amount || 0),
      0
    );
    const lastBuyerSpent = lastBuyerCompleted.reduce(
      (sum, order) => sum + (order.amount || 0),
      0
    );

    const calculateGrowth = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    setFarmerStats({
      totalOrders: farmerOrders.length,
      totalRevenue: farmerRevenue,
      completedOrders: farmerCompleted.length,
      pendingOrders: farmerPending.length,
      ordersGrowth: calculateGrowth(
        currentFarmerOrders.length,
        lastFarmerOrders.length
      ),
      revenueGrowth: calculateGrowth(currentFarmerRevenue, lastFarmerRevenue),
      completedGrowth: calculateGrowth(
        currentFarmerCompleted.length,
        lastFarmerCompleted.length
      ),
      pendingGrowth: 0,
    });

    setBuyerStats({
      totalOrders: buyerOrders.length,
      totalSpent: buyerSpent,
      completedOrders: buyerCompleted.length,
      pendingOrders: buyerPending.length,
      ordersGrowth: calculateGrowth(
        currentBuyerOrders.length,
        lastBuyerOrders.length
      ),
      spentGrowth: calculateGrowth(currentBuyerSpent, lastBuyerSpent),
      completedGrowth: calculateGrowth(
        currentBuyerCompleted.length,
        lastBuyerCompleted.length
      ),
      pendingGrowth: 0,
    });
  };

  const generateRecentActivity = (ordersData, userAddress) => {
    const farmerOrders = ordersData.filter(
      (order) => order.farmerAddress === userAddress
    );
    const buyerOrders = ordersData.filter(
      (order) => order.buyerAddress === userAddress
    );

    const generateActivities = (orders, role) => {
      return orders
        .sort(
          (a, b) =>
            new Date(b.createdAt || b.orderDate) -
            new Date(a.createdAt || a.orderDate)
        )
        .slice(0, 3)
        .map((order) => {
          const status = order.status?.toLowerCase();
          let message = "";
          let activityStatus = "active";

          if (status === "completed") {
            message = `Order #${order.id.slice(0, 8)} completed successfully`;
            activityStatus = "completed";
          } else if (status === "delivered") {
            message = `Order #${order.id.slice(
              0,
              8
            )} delivered, awaiting approval`;
            activityStatus = "pending";
          } else if (status === "paid_pending_delivery") {
            message = `Order #${order.id.slice(0, 8)} paid, awaiting delivery`;
            activityStatus = "pending";
          } else if (status === "created") {
            message = `Order #${order.id.slice(0, 8)} created, payment pending`;
            activityStatus = "active";
          } else if (status === "refunded") {
            message = `Order #${order.id.slice(0, 8)} refunded`;
            activityStatus = "completed";
          } else {
            message = `Order #${order.id.slice(0, 8)} - ${status}`;
            activityStatus = "active";
          }

          const orderDate = new Date(order.createdAt || order.orderDate);
          const daysDiff = Math.floor(
            (new Date() - orderDate) / (1000 * 60 * 60 * 24)
          );
          const timeAgo =
            daysDiff === 0
              ? "Today"
              : daysDiff === 1
              ? "Yesterday"
              : `${daysDiff} days ago`;

          return {
            id: order.id,
            type: status || "order",
            message,
            time: timeAgo,
            status: activityStatus,
          };
        });
    };

    const farmerActivities = generateActivities(farmerOrders, "farmer");
    const buyerActivities = generateActivities(buyerOrders, "buyer");

    setFarmerActivity(
      farmerActivities.length > 0
        ? farmerActivities
        : [
            {
              id: 1,
              type: "info",
              message: "No recent farmer orders",
              time: "--",
              status: "active",
            },
          ]
    );

    setBuyerActivity(
      buyerActivities.length > 0
        ? buyerActivities
        : [
            {
              id: 1,
              type: "info",
              message: "No recent buyer orders",
              time: "--",
              status: "active",
            },
          ]
    );
  };

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUser();
      setUser(userData);
    };
    fetchUser();
    fetchAllOrders();

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const quickActions = [
    {
      icon: FaPlus,
      label: "List Crop",
      color: "from-green-500 to-emerald-600",
      path: "/list",
    },
    {
      icon: FaShoppingCart,
      label: "Browse Market",
      color: "from-blue-500 to-cyan-600",
      path: "/crops",
    },
    {
      icon: FaFileContract,
      label: "My Contracts",
      color: "from-purple-500 to-pink-600",
      path: "/my-contracts",
    },
    {
      icon: FaWarehouse,
      label: "Cold Storage",
      color: "from-orange-500 to-red-600",
      path: "/cold-storage",
    },
  ];

  return (
    <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 md:ml-14 min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-gray-50 via-green-50 to-blue-50 overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 md:mb-8"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 bg-clip-text text-transparent">
              {getGreeting()}, {user?.username || "Farmer"}! 👋
            </h1>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              <span className="ml-3 font-semibold text-green-600">
                {currentTime.toLocaleTimeString()}
              </span>
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-semibold"
          >
            <FaChartLine /> View Analytics
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-6"
      >
        <div className="bg-white rounded-2xl shadow-lg p-2 inline-flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => setActiveRole("farmer")}
            className={`px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
              activeRole === "farmer"
                ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span className="text-xl">🌾</span>
            Farmer Dashboard
          </button>
          <button
            onClick={() => setActiveRole("buyer")}
            className={`px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
              activeRole === "buyer"
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span className="text-xl">🛒</span>
            Buyer Dashboard
          </button>
        </div>
      </motion.div>

      {activeRole === "farmer" ? (
        <motion.div
          key="farmer"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6"
          >
            <StatCard
              title="Total Sales"
              value={loading ? "..." : farmerStats.totalOrders.toString()}
              icon="📦"
              trend={
                loading
                  ? "--"
                  : `${farmerStats.ordersGrowth > 0 ? "+" : ""}${
                      farmerStats.ordersGrowth
                    }%`
              }
              trendUp={farmerStats.ordersGrowth >= 0}
              gradient="from-green-500 to-emerald-600"
            />
            <StatCard
              title="Total Revenue"
              value={
                loading
                  ? "..."
                  : `₹${farmerStats.totalRevenue.toLocaleString()}`
              }
              icon="💰"
              trend={
                loading
                  ? "--"
                  : `${farmerStats.revenueGrowth > 0 ? "+" : ""}${
                      farmerStats.revenueGrowth
                    }%`
              }
              trendUp={farmerStats.revenueGrowth >= 0}
              gradient="from-blue-500 to-cyan-600"
            />
            <StatCard
              title="Completed Sales"
              value={loading ? "..." : farmerStats.completedOrders.toString()}
              icon="✅"
              trend={
                loading
                  ? "--"
                  : `${farmerStats.completedGrowth > 0 ? "+" : ""}${
                      farmerStats.completedGrowth
                    }%`
              }
              trendUp={farmerStats.completedGrowth >= 0}
              gradient="from-purple-500 to-pink-600"
            />
            <StatCard
              title="Pending Sales"
              value={loading ? "..." : farmerStats.pendingOrders.toString()}
              icon="⏳"
              trend="--"
              trendUp={false}
              gradient="from-orange-500 to-red-600"
            />
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="buyer"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6"
          >
            <StatCard
              title="Total Purchases"
              value={loading ? "..." : buyerStats.totalOrders.toString()}
              icon="🛍️"
              trend={
                loading
                  ? "--"
                  : `${buyerStats.ordersGrowth > 0 ? "+" : ""}${
                      buyerStats.ordersGrowth
                    }%`
              }
              trendUp={buyerStats.ordersGrowth >= 0}
              gradient="from-blue-500 to-cyan-600"
            />
            <StatCard
              title="Total Spent"
              value={
                loading ? "..." : `₹${buyerStats.totalSpent.toLocaleString()}`
              }
              icon="💳"
              trend={
                loading
                  ? "--"
                  : `${buyerStats.spentGrowth > 0 ? "+" : ""}${
                      buyerStats.spentGrowth
                    }%`
              }
              trendUp={buyerStats.spentGrowth >= 0}
              gradient="from-purple-500 to-pink-600"
            />
            <StatCard
              title="Completed Purchases"
              value={loading ? "..." : buyerStats.completedOrders.toString()}
              icon="✅"
              trend={
                loading
                  ? "--"
                  : `${buyerStats.completedGrowth > 0 ? "+" : ""}${
                      buyerStats.completedGrowth
                    }%`
              }
              trendUp={buyerStats.completedGrowth >= 0}
              gradient="from-green-500 to-emerald-600"
            />
            <StatCard
              title="Pending Purchases"
              value={loading ? "..." : buyerStats.pendingOrders.toString()}
              icon="⏳"
              trend="--"
              trendUp
              gradient="from-orange-500 to-red-600"
            />
          </motion.div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 space-y-4"
        >
          <WeatherForecast />

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaClock className="text-green-600" />
                Recent Activity
              </h2>
              <button className="text-sm text-green-600 hover:text-green-700 font-semibold">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {(activeRole === "farmer" ? farmerActivity : buyerActivity).map(
                (activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-0 justify-between p-4 bg-gradient-to-r from-gray-50 to-green-50 rounded-xl hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          activity.status === "completed"
                            ? "bg-green-100"
                            : activity.status === "pending"
                            ? "bg-yellow-100"
                            : "bg-blue-100"
                        }`}
                      >
                        {activity.status === "completed" ? (
                          <FaCheckCircle className="text-green-600" />
                        ) : activity.status === "pending" ? (
                          <FaHourglassHalf className="text-yellow-600" />
                        ) : (
                          <FaPlus className="text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {activity.message}
                        </p>
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        activity.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : activity.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {activity.status}
                    </span>
                  </motion.div>
                )
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <motion.a
                  key={index}
                  href={action.path}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-4 rounded-xl bg-gradient-to-br ${action.color} text-white shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center gap-2 cursor-pointer`}
                >
                  <action.icon className="text-2xl" />
                  <span className="text-xs font-semibold text-center">
                    {action.label}
                  </span>
                </motion.a>
              ))}
            </div>
          </div>

          <AlertsPanel />
        </motion.div>
      </div>
      <CurrentMonthHighlights />
      <TrendingCrops />
    </main>
  );
};

export default Dashboard;

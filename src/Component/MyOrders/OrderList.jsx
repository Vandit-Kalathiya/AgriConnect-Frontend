import React, { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { Package } from "react-feather";
import OrderRow from "./OrderRow";
import OrderDetailsDrawer from "./OrderDetailsDrawer";
import OrderStatusBadge from "./OrderStatusBadge";
import axios from "axios";
import { API_CONFIG } from "../../config/apiConfig";

// Mobile Order Card Component
const MobileOrderCard = ({ order, listing, image, onViewDetails }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors duration-150">
      <div className="flex items-start space-x-3 mb-3">
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-green-50 to-green-100 flex-shrink-0 shadow-sm">
          {!imageError && image ? (
            <img
              src={image}
              alt={listing?.productName || "Product"}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="text-green-300" size={24} />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-800 text-sm truncate">
            {listing?.productName || "Loading..."}
          </h4>
          <p className="text-xs text-gray-500 mb-2">
            {listing?.productType || "—"}
          </p>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs font-semibold text-gray-700">
              {order?.quantity} {listing?.unitOfQuantity}
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-xs font-bold text-blue-600">
              ₹{order.amount.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="mb-3">
            <OrderStatusBadge status={order.status} compact />
          </div>
        </div>
      </div>
      <button
        onClick={() => onViewDetails(order)}
        className="w-full py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-all duration-200"
      >
        View Details
      </button>
    </div>
  );
};

const OrderList = ({
  orders,
  listings,
  images,
  activeTab,
  setActiveTab,
  currentUser,
  openTrackingModal,
  handleVerifyDelivery,
  handleOpenRejectModal,
  handleBuyerRefund,
  pendingPaymentCount,
  inProgressCount,
  completedCount,
  handleFarmerAction,
  fetchOrders,
  roleFilter,
}) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [farmerDetails, setFarmerDetails] = useState(null);
  const [loadingFarmer, setLoadingFarmer] = useState(false);

  // Fetch farmer details when an order is selected
  useEffect(() => {
    const fetchFarmerDetails = async () => {
      if (
        selectedOrder &&
        currentUser?.uniqueHexAddress !== selectedOrder.farmerAddress
      ) {
        setLoadingFarmer(true);
        try {
          const response = await axios.get(
            `${API_CONFIG.IDENTITY_SERVICE}/users/unique/${selectedOrder.farmerAddress}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );
          setFarmerDetails(response.data);
        } catch (error) {
          console.error("Error fetching farmer details:", error);
        } finally {
          setLoadingFarmer(false);
        }
      }
    };

    fetchFarmerDetails();
  }, [selectedOrder, currentUser]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseDrawer = () => {
    setSelectedOrder(null);
    setFarmerDetails(null);
  };

  return (
    <>
      {/* Tabs with Role-Aware Labels */}
      <div className="flex bg-white rounded-t-xl shadow-md mb-0 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("pending_payment")}
          className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 ${
            activeTab === "pending_payment"
              ? "text-amber-700 border-b-2 border-amber-500 bg-amber-50"
              : "text-gray-600 hover:text-amber-600 hover:bg-gray-50"
          }`}
        >
          <span className="hidden sm:inline">
            {roleFilter === "buyer" ? "Awaiting Payment" : "Payment Pending"}
          </span>
          <span className="sm:hidden">Pending</span>
          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-700 font-bold">
            {pendingPaymentCount}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("in_progress")}
          className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 ${
            activeTab === "in_progress"
              ? "text-blue-700 border-b-2 border-blue-500 bg-blue-50"
              : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
          }`}
        >
          <span className="hidden sm:inline">In Progress</span>
          <span className="sm:hidden">Progress</span>
          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 font-bold">
            {inProgressCount}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 ${
            activeTab === "completed"
              ? "text-green-700 border-b-2 border-green-500 bg-green-50"
              : "text-gray-600 hover:text-green-600 hover:bg-gray-50"
          }`}
        >
          <span className="hidden sm:inline">Completed</span>
          <span className="sm:hidden">Done</span>
          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 font-bold">
            {completedCount}
          </span>
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-b-xl shadow-lg overflow-hidden">
        {orders.length === 0 ? (
          <div className="text-center py-16 px-4">
            <FaShoppingCart className="text-gray-300 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No orders found
            </h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              {roleFilter === "buyer"
                ? activeTab === "pending_payment"
                  ? "You haven't placed any purchase orders requiring payment."
                  : activeTab === "in_progress"
                  ? "No purchase orders are currently in progress."
                  : "No purchase orders have been completed or refunded."
                : activeTab === "pending_payment"
                ? "No sales are awaiting payment from buyers."
                : activeTab === "in_progress"
                ? "No sales orders are currently in progress."
                : "No sales have been completed or refunded."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <OrderRow
                      key={order.id}
                      order={order}
                      listing={listings[order.id]}
                      image={images[order.id]}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-100">
              {orders.map((order) => (
                <MobileOrderCard
                  key={order.id}
                  order={order}
                  listing={listings[order.id]}
                  image={images[order.id]}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Order Details Drawer */}
      {selectedOrder && (
        <OrderDetailsDrawer
          order={selectedOrder}
          listing={listings[selectedOrder.id]}
          image={images[selectedOrder.id]}
          currentUser={currentUser}
          onClose={handleCloseDrawer}
          openTrackingModal={openTrackingModal}
          handleOpenRejectModal={handleOpenRejectModal}
          handleBuyerRefund={handleBuyerRefund}
          fetchOrders={fetchOrders}
          handleFarmerAction={handleFarmerAction}
          farmerDetails={farmerDetails}
          loadingFarmer={loadingFarmer}
        />
      )}
    </>
  );
};

export default OrderList;

import React from "react";
import OrderItem from "./OrderItem";
import { FaShoppingCart } from "react-icons/fa";

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
}) => {
  return (
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
          Pending Payment ({pendingPaymentCount})
        </button>
        <button
          onClick={() => setActiveTab("in_progress")}
          className={`flex-1 py-3 text-center font-medium ${
            activeTab === "in_progress"
              ? "text-blue-700 border-b-2 border-blue-500"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          In Progress ({inProgressCount})
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`flex-1 py-3 text-center font-medium ${
            activeTab === "completed"
              ? "text-green-700 border-b-2 border-green-500"
              : "text-gray-600 hover:text-green-600"
          }`}
        >
          Completed ({completedCount})
        </button>
      </div>

      <div className="bg-white rounded-b-xl shadow-lg p-4 md:p-6">
        {orders.length === 0 ? (
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
            {orders.map((order) => (
              <OrderItem
                key={order.id}
                order={order}
                listing={listings[order.id]}
                image={images[order.id]}
                currentUser={currentUser}
                openTrackingModal={openTrackingModal}
                handleVerifyDelivery={handleVerifyDelivery}
                handleOpenRejectModal={handleOpenRejectModal}
                handleBuyerRefund={handleBuyerRefund}
                handleFarmerAction={handleFarmerAction}
                fetchOrders={fetchOrders}
              />
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default OrderList;

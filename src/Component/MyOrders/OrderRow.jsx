import React, { useState } from "react";
import { FaRupeeSign, FaEye, FaCalendarAlt } from "react-icons/fa";
import { Package } from "react-feather";
import OrderStatusBadge from "./OrderStatusBadge";

const OrderRow = ({ order, listing, image, onViewDetails }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
      {/* Product Image & Name */}
      <td className="px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-green-50 to-green-100 flex-shrink-0 shadow-sm">
            {!imageError && image ? (
              <img
                src={image}
                alt={listing?.productName || "Product"}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="text-green-300" size={20} />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-800 truncate text-sm">
              {listing?.productName || "Loading..."}
            </p>
            <p className="text-xs text-gray-500 truncate">
              ID: {order.id.slice(0, 8)}...
            </p>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="px-4 py-3">
        <span className="text-sm text-gray-700 font-medium">
          {listing?.productType || "—"}
        </span>
      </td>

      {/* Quantity */}
      <td className="px-4 py-3">
        <span className="text-sm font-semibold text-gray-800">
          {order?.quantity} {listing?.unitOfQuantity || "units"}
        </span>
      </td>

      {/* Amount */}
      <td className="px-4 py-3">
        <div className="flex items-center text-blue-600 font-bold text-sm">
          <FaRupeeSign className="mr-1" size={12} />
          {order.amount.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <OrderStatusBadge status={order.status} compact />
      </td>

      {/* Date */}
      <td className="px-4 py-3">
        <div className="flex items-center text-gray-600 text-xs">
          <FaCalendarAlt className="mr-2 text-gray-400" size={12} />
          {new Date(order.createdDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </td>

      {/* Action */}
      <td className="px-4 py-3">
        <button
          onClick={() => onViewDetails(order)}
          className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <FaEye size={12} />
          <span>View</span>
        </button>
      </td>
    </tr>
  );
};

export default OrderRow;


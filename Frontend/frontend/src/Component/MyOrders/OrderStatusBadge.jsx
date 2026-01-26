import React from "react";
import {
  FaCheckCircle,
  FaCreditCard,
  FaShippingFast,
  FaUndo,
  FaMoneyCheckAlt,
  FaClock,
  FaTruck,
} from "react-icons/fa";

const OrderStatusBadge = ({ status, compact = false }) => {
  const statusConfigs = {
    created: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
      icon: FaClock,
      label: "Pending Payment",
    },
    paid_pending_delivery: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      icon: FaTruck,
      label: "Awaiting Delivery",
    },
    delivered: {
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      text: "text-indigo-700",
      icon: FaShippingFast,
      label: "Delivered",
    },
    completed: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      icon: FaCheckCircle,
      label: "Completed",
    },
    return_requested: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-700",
      icon: FaUndo,
      label: "Return Requested",
    },
    return_confirmed: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-700",
      icon: FaUndo,
      label: "Return Confirmed",
    },
    refunded: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      icon: FaMoneyCheckAlt,
      label: "Refunded",
    },
  };

  const config =
    statusConfigs[status] || {
      bg: "bg-gray-50",
      border: "border-gray-200",
      text: "text-gray-700",
      icon: FaClock,
      label: status || "Unknown",
    };

  const Icon = config.icon;

  if (compact) {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.border} ${config.text}`}
      >
        <Icon className="mr-1" size={10} />
        {config.label}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold border ${config.bg} ${config.border} ${config.text}`}
    >
      <Icon className="mr-2" size={14} />
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;


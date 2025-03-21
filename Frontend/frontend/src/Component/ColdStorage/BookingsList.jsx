import React from "react";
import {
  FaWarehouse,
  FaCheckCircle,
  FaHourglassHalf,
  FaArrowRight,
} from "react-icons/fa";

const BookingsList = ({
  bookings,
  isLoading,
  searchTerm,
  activeTab,
  handleApproveBooking,
}) => {
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.cropName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.cropType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.coldStorageName?.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "approved")
      return matchesSearch && booking.status === "Approved";
    if (activeTab === "pending")
      return matchesSearch && booking.status === "Pending";
    return matchesSearch;
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 animate-slideUp">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <FaWarehouse className="mr-2 text-green-600" /> My Storage Spaces
      </h2>
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="p-5 border border-gray-200 rounded-xl bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FaWarehouse className="text-green-600 text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {booking.cropName}
                  </h3>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
                    booking.status === "Approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {booking.status === "Approved" ? (
                    <FaCheckCircle className="mr-1" />
                  ) : (
                    <FaHourglassHalf className="mr-1" />
                  )}
                  {booking.status}
                </span>
              </div>
              <div className="space-y-2 text-gray-600 text-sm">
                <p>
                  <span className="font-medium">Type:</span> {booking.cropType}
                </p>
                <p>
                  <span className="font-medium">Quantity:</span>{" "}
                  {booking.cropQuantity} tons
                </p>
                <p>
                  <span className="font-medium">Duration:</span>{" "}
                  {booking.storageDuration} days
                </p>
                <p>
                  <span className="font-medium">Storage:</span>{" "}
                  {booking.coldStorageName}
                </p>
              </div>
              {booking.status === "Pending" && (
                <div className="flex justify-center mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleApproveBooking(booking.id)}
                    className="flex items-center gap-1 text-green-600 hover:text-green-800 transition"
                  >
                    Approve <FaArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <FaWarehouse className="mx-auto text-gray-300 text-5xl mb-4" />
          <p className="text-gray-500 mb-2 text-lg">No storage bookings yet</p>
          <p className="text-gray-400 text-sm mb-6">
            Book a storage space to get started
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Book Now
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingsList;

import React from "react";
import { FaTimes, FaCheckCircle } from "react-icons/fa";

const BookingModal = ({
  isModalOpen,
  setIsModalOpen,
  bookingForm,
  setBookingForm,
  handleBookingSubmit,
  bookingStatus,
  liveLocation,
  coldStorages, // New prop
}) => {
  const handleFormChange = (e) => {
    setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });
  };

  // Sort cold storages by distance if available
  const sortedColdStorages =
    coldStorages.length > 0
      ? [...coldStorages].sort((a, b) => a.distance - b.distance)
      : [];

  return (
    isModalOpen && (
      <div className="fixed inset-0 bg-opacity-60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl border border-gray-100">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-10 right-10 text-gray-500 hover:text-gray-700 transition"
          >
            <FaTimes size={24} />
          </button>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Book Cold Storage
          </h2>
          <p className="text-gray-600 mb-6">
            Secure a spot for your crops with ease
          </p>
          <form onSubmit={handleBookingSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Crop Name
                </label>
                <input
                  type="text"
                  name="cropName"
                  value={bookingForm.cropName}
                  onChange={handleFormChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  placeholder="e.g., Mango"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Crop Type
                </label>
                <select
                  name="cropType"
                  value={bookingForm.cropType}
                  onChange={handleFormChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Fruit">Fruit</option>
                  <option value="Vegetable">Vegetable</option>
                  <option value="Grain">Grain</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Crop Quantity (tons)
                </label>
                <input
                  type="number"
                  name="cropQuantity"
                  value={bookingForm.cropQuantity}
                  onChange={handleFormChange}
                  min="0.1"
                  step="0.1"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  placeholder="e.g., 5"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Storage Duration (days)
                </label>
                <input
                  type="number"
                  name="storageDuration"
                  value={bookingForm.storageDuration}
                  onChange={handleFormChange}
                  min="1"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  placeholder="e.g., 30"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Cold Storage
              </label>
              <select
                name="coldStorageName"
                value={bookingForm.coldStorageName}
                onChange={handleFormChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                required
              >
                <option value="">Select Nearest Storage</option>
                {sortedColdStorages.map((storage) => (
                  <option key={storage.id} value={storage.name}>
                    {storage.name} - {storage.specialty} (
                    {liveLocation && storage.distance !== undefined
                      ? `${Math.round(storage.distance)} km`
                      : storage.location}
                    )
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition shadow-md"
              >
                Book Now
              </button>
            </div>
            {bookingStatus && (
              <div
                className={`mt-4 p-4 rounded-lg flex items-center ${
                  bookingStatus.type === "success"
                    ? "bg-green-50 text-green-800"
                    : bookingStatus.type === "error"
                    ? "bg-red-50 text-red-800"
                    : "bg-blue-50 text-blue-800"
                }`}
              >
                {bookingStatus.type === "loading" && (
                  <div className="animate-spin h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                )}
                {bookingStatus.type === "success" && (
                  <FaCheckCircle className="mr-2" />
                )}
                {bookingStatus.type === "error" && <FaTimes className="mr-2" />}
                {bookingStatus.message}
              </div>
            )}
          </form>
        </div>
      </div>
    )
  );
};

export default BookingModal;

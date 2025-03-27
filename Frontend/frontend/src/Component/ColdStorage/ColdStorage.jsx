// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { FaWarehouse, FaPlus, FaTimes, FaCheckCircle, FaHourglassHalf, FaArrowRight, FaSearch, FaMapMarkerAlt } from "react-icons/fa";
// import { getCurrentUser } from "../../../helper";
// // import NearbyColdStorages from "./NearbyColdStorages";
// import Loader from "../Loader/Loader"

// const ColdStoragePage = () => {
//   const [bookings, setBookings] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
//   const [selectedBookingId, setSelectedBookingId] = useState(null);
//   const [user, setUser] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [locationMode, setLocationMode] = useState("live"); // "live" or "manual"
//   const [liveLocation, setLiveLocation] = useState(null); // { lat, lon }
//   const [manualLocation, setManualLocation] = useState({ district: "", state: "" });
//   const [district, setDistrict] = useState("");
//   const [state, setState] = useState("");
//   const [bookingForm, setBookingForm] = useState({
//     cropQuantity: "",
//     storageDuration: "",
//     cropType: "",
//     cropName: "",
//     coldStorageName: "",
//   });
//   const [bookingStatus, setBookingStatus] = useState(null);
//   const [activeTab, setActiveTab] = useState("all");
//   const [loading, setLoading] = useState(false);

//   // Static cold storages with coordinates for proximity sorting
//   const staticColdStorages = [
//     {
//       id: "1",
//       name: "RADHA KISHAN COLD SOTRAGE",
//       phoneNumber: "98253 64071",
//       lat: 19.076,
//       lon: 72.8777,
//       location: "Kanjari, Gujarat",
//       temperature: "-5°C",
//       specialty: "Fruits",
//       capacity: "85% available",
//     },
//     {
//       id: "2",
//       name: "Amar Cold Storage",
//       phoneNumber: "90999 08522",
//       lat: 28.7041,
//       lon: 77.1025,
//       location: "N H No 228, Nadiad-Anand Rd",
//       temperature: "-10°C",
//       specialty: "Vegetables",
//       capacity: "60% available",
//     },
//     {
//       id: "3",
//       name: "Vrundavan Cold Storage",
//       phoneNumber: "94260 61878",
//       lat: 12.9716,
//       lon: 77.5946,
//       location: "Boriavi, Gujarat",
//       temperature: "-2°C",
//       specialty: "Mixed",
//       capacity: "75% available",
//     },
//   ];

//   // Get current user (farmer)
//   const fetchUser = async () => {
//     try {
//       const userData = await getCurrentUser();
//       setUser(userData);
//     } catch (error) {
//       console.error("Error fetching user:", error);
//     }
//   };

//   useEffect(() => {
//     fetchUser();
//   }, []);

//   // Fetch bookings when user is loaded
//   useEffect(() => {
//     if (user && user.id) {
//       fetchBookings(user.id);
//       if (locationMode === "live") {
//         fetchLiveLocation();
//       }
//     }
//   }, [user, locationMode]);

//   // Fetch live location
//   const fetchLiveLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           const { latitude, longitude } = position.coords;
//           setLiveLocation({ lat: latitude, lon: longitude });
//           const locationData = await reverseGeocode(latitude, longitude);
//           setDistrict(locationData.district || "Unknown District");
//           setState(locationData.state || "Unknown State");
//         },
//         (error) => {
//           console.error("Location error:", error);
//           setDistrict("Unable to fetch");
//           setState("Unable to fetch");
//         }
//       );
//     }
//   };

//   // Reverse geocode using Nominatim OpenStreetMap API
//   const reverseGeocode = async (lat, lon) => {
//     try {
//       const response = await axios.get(
//         `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
//       );
//       setLoading(true);
//       const address = response.data.address;
//       return {
//         district: address.county || address.city_district || "N/A",
//         state: address.state || "N/A",
//       };
//     } catch (error) {
//       console.error("Error reverse geocoding:", error);
//       return { district: "N/A", state: "N/A" };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch bookings from backend
//   const fetchBookings = async (farmerId) => {
//     setIsLoading(true);
//     try {
//       const response = await axios.get(`http://localhost:2529/coldstorage/bookings?farmerId=${farmerId}`);
//       setBookings(response.data);
//     } catch (error) {
//       console.error("Error fetching bookings:", error);
//       setBookings([{ id: 0, message: "Failed to fetch bookings.", status: "N/A" }]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle form input changes
//   const handleFormChange = (e) => {
//     setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });
//   };

//   // Manually set location
//   const handleManualLocationChange = (e) => {
//     const { name, value } = e.target;
//     setManualLocation((prev) => ({ ...prev, [name]: value }));
//     setDistrict(name === "district" ? value : manualLocation.district);
//     setState(name === "state" ? value : manualLocation.state);
//   };

//   // Handle booking submission
//   const handleBookingSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setBookingStatus({ type: "loading", message: "Submitting your booking..." });
//       const bookingData = {
//         farmerId: user.id,
//         cropQuantity: parseFloat(bookingForm.cropQuantity),
//         storageDuration: parseInt(bookingForm.storageDuration),
//         cropType: bookingForm.cropType,
//         cropName: bookingForm.cropName,
//         coldStorageName: bookingForm.coldStorageName,
//       };
//       const response = await axios.post("http://localhost:2529/coldstorage/book", bookingData);
//       setBookingStatus({
//         type: "success",
//         message: `Booking submitted! Booking ID: ${response.data.id} (Pending approval)`,
//       });
//       setTimeout(() => {
//         setBookingForm({ cropQuantity: "", storageDuration: "", cropType: "", cropName: "", coldStorageName: "" });
//         setIsModalOpen(false);
//         fetchBookings(user.id);
//       }, 1500);
//     } catch (error) {
//       setBookingStatus({
//         type: "error",
//         message: "Booking failed: " + (error.response?.data?.message || "Unknown error"),
//       });
//     }
//   };

//   // Approve booking with confirmation
//   const handleApproveBooking = async (bookingId) => {
//     setSelectedBookingId(bookingId);
//     setIsApproveModalOpen(true);
//   };

//   const confirmApproveBooking = async () => {
//     try {
//       await axios.put(`http://localhost:2529/coldstorage/approve/${selectedBookingId}`);
//       setIsApproveModalOpen(false);
//       fetchBookings(user.id);
//     } catch (error) {
//       console.error("Approval failed:", error);
//     }
//   };

//   // Filter bookings based on search and active tab
//   const filteredBookings = bookings.filter((booking) => {
//     const matchesSearch =
//       booking.cropName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       booking.cropType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       booking.coldStorageName?.toLowerCase().includes(searchTerm.toLowerCase());
//     if (activeTab === "all") return matchesSearch;
//     if (activeTab === "approved") return matchesSearch && booking.status === "Approved";
//     if (activeTab === "pending") return matchesSearch && booking.status === "Pending";
//     return matchesSearch;
//   });

//   // Haversine formula for distance calculation
//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371; // Earth's radius in km
//     const dLat = (lat2 - lat1) * (Math.PI / 180);
//     const dLon = (lon2 - lon1) * (Math.PI / 180);
//     const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c; // Distance in km
//   };

//   // Sort cold storages by proximity (simulated distance calculation)
//   const sortedColdStorages = liveLocation
//     ? staticColdStorages
//         .map((storage) => {
//           const distance = calculateDistance(liveLocation.lat, liveLocation.lon, storage.lat, storage.lon);
//           return { ...storage, distance };
//         })
//         .sort((a, b) => a.distance - b.distance)
//     : staticColdStorages;

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-8 md:ml-20 mt-16">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-center mb-8 animate-fadeIn">
//         <div className="px-8 pt-4">
//           {loading && (
//             <div className="text-center text-gray-600 text-md md:text-lg">
//               <Loader />
//             </div>
//           )}
//           <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2 tracking-tight">
//             Cold Storage
//           </h1>
//           <p className="text-gray-600 max-w-2xl text-lg">
//             Secure your harvest with ease and precision
//           </p>
//         </div>
//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="mt-4 md:mt-0 flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-lg transform hover:scale-105"
//         >
//           <FaPlus /> Book Storage
//         </button>
//       </div>

//       {/* Location Control */}
//       <div className="bg-white rounded-xl shadow-md p-6 mb-6 animate-slideUp">
//         <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//           <div className="flex items-center gap-2">
//             <FaMapMarkerAlt className="text-green-600" />
//             <span className="text-lg font-semibold text-gray-800">
//               Your Location:
//             </span>
//             <span className="text-gray-600">
//               {district}, {state}
//             </span>
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={() => {
//                 setLocationMode("live");
//                 fetchLiveLocation();
//                 setManualLocation({ district: "", state: "" });
//               }}
//               className={`px-4 py-2 rounded-lg ${
//                 locationMode === "live"
//                   ? "bg-green-600 text-white"
//                   : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//               } transition`}
//             >
//               Live Tracking
//             </button>
//             <button
//               onClick={() => setLocationMode("manual")}
//               className={`px-4 py-2 rounded-lg ${
//                 locationMode === "manual"
//                   ? "bg-green-600 text-white"
//                   : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//               } transition`}
//             >
//               Manual Entry
//             </button>
//           </div>
//         </div>
//         {locationMode === "manual" && (
//           <div className="mt-4 grid md:grid-cols-2 gap-4 animate-fadeIn">
//             <input
//               type="text"
//               name="district"
//               value={manualLocation.district}
//               onChange={handleManualLocationChange}
//               placeholder="Enter District"
//               className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//             />
//             <input
//               type="text"
//               name="state"
//               value={manualLocation.state}
//               onChange={handleManualLocationChange}
//               placeholder="Enter State"
//               className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//             />
//           </div>
//         )}
//       </div>

//       {/* Search and Filter */}
//       <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-col md:flex-row justify-between items-center animate-slideUp">
//         <div className="relative w-full md:w-72 mb-4 md:mb-0">
//           <input
//             type="text"
//             placeholder="Search bookings..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
//           />
//           <FaSearch className="absolute left-3 top-3 text-gray-400" />
//         </div>
//         <div className="flex gap-2">
//           {["all", "approved", "pending"].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
//                 activeTab === tab
//                   ? "bg-green-600 text-white shadow-md"
//                   : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//               }`}
//             >
//               {tab.charAt(0).toUpperCase() + tab.slice(1)}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Bookings List */}
//       <div className="bg-white rounded-xl shadow-lg p-6 animate-slideUp">
//         <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
//           <FaWarehouse className="mr-2 text-green-600" /> My Storage Spaces
//         </h2>
//         {isLoading ? (
//           <div className="flex justify-center items-center py-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
//           </div>
//         ) : filteredBookings.length > 0 ? (
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredBookings.map((booking) => (
//               <div
//                 key={booking.id}
//                 className="p-5 border border-gray-200 rounded-xl bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
//               >
//                 <div className="flex justify-between items-start mb-4">
//                   <div className="flex items-center gap-3">
//                     <div className="p-2 bg-green-100 rounded-lg">
//                       <FaWarehouse className="text-green-600 text-xl" />
//                     </div>
//                     <h3 className="text-lg font-semibold text-gray-800">
//                       {booking.cropName}
//                     </h3>
//                   </div>
//                   <span
//                     className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
//                       booking.status === "Approved"
//                         ? "bg-green-100 text-green-800"
//                         : "bg-yellow-100 text-yellow-800"
//                     }`}
//                   >
//                     {booking.status === "Approved" ? (
//                       <FaCheckCircle className="mr-1" />
//                     ) : (
//                       <FaHourglassHalf className="mr-1" />
//                     )}
//                     {booking.status}
//                   </span>
//                 </div>
//                 <div className="space-y-2 text-gray-600 text-sm">
//                   <p>
//                     <span className="font-medium">Type:</span>{" "}
//                     {booking.cropType}
//                   </p>
//                   <p>
//                     <span className="font-medium">Quantity:</span>{" "}
//                     {booking.cropQuantity} tons
//                   </p>
//                   <p>
//                     <span className="font-medium">Duration:</span>{" "}
//                     {booking.storageDuration} days
//                   </p>
//                   <p>
//                     <span className="font-medium">Storage:</span>{" "}
//                     {booking.coldStorageName}
//                   </p>
//                 </div>
//                 {booking.status === "Pending" && (
//                   <div className="flex justify-center mt-4 pt-4 border-t border-gray-100">
//                     <button
//                       onClick={() => handleApproveBooking(booking.id)}
//                       className="flex items-center gap-1 text-green-600 hover:text-green-800 transition"
//                     >
//                       Approve <FaArrowRight size={14} />
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-16 bg-gray-50 rounded-lg">
//             <FaWarehouse className="mx-auto text-gray-300 text-5xl mb-4" />
//             <p className="text-gray-500 mb-2 text-lg">
//               No storage bookings yet
//             </p>
//             <p className="text-gray-400 text-sm mb-6">
//               Book a storage space to get started
//             </p>
//             <button
//               onClick={() => setIsModalOpen(true)}
//               className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
//             >
//               <FaPlus /> Book Now
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Booking Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-opacity-60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fadeIn">
//           <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl border border-gray-100">
//             <button
//               onClick={() => setIsModalOpen(false)}
//               className="absolute top-10 right-10 text-gray-500 hover:text-gray-700 transition"
//             >
//               <FaTimes size={24} />
//             </button>
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">
//               Book Cold Storage
//             </h2>
//             <p className="text-gray-600 mb-6">
//               Secure a spot for your crops with ease
//             </p>
//             <form onSubmit={handleBookingSubmit} className="space-y-6">
//               <div className="grid md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Crop Name
//                   </label>
//                   <input
//                     type="text"
//                     name="cropName"
//                     value={bookingForm.cropName}
//                     onChange={handleFormChange}
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
//                     placeholder="e.g., Mango"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Crop Type
//                   </label>
//                   <select
//                     name="cropType"
//                     value={bookingForm.cropType}
//                     onChange={handleFormChange}
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
//                     required
//                   >
//                     <option value="">Select Type</option>
//                     <option value="Fruit">Fruit</option>
//                     <option value="Vegetable">Vegetable</option>
//                     <option value="Grain">Grain</option>
//                     <option value="Dairy">Dairy</option>
//                     <option value="Other">Other</option>
//                   </select>
//                 </div>
//               </div>
//               <div className="grid md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Crop Quantity (tons)
//                   </label>
//                   <input
//                     type="number"
//                     name="cropQuantity"
//                     value={bookingForm.cropQuantity}
//                     onChange={handleFormChange}
//                     min="0.1"
//                     step="0.1"
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
//                     placeholder="e.g., 5"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Storage Duration (days)
//                   </label>
//                   <input
//                     type="number"
//                     name="storageDuration"
//                     value={bookingForm.storageDuration}
//                     onChange={handleFormChange}
//                     min="1"
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
//                     placeholder="e.g., 30"
//                     required
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Select Cold Storage
//                 </label>
//                 <select
//                   name="coldStorageName"
//                   value={bookingForm.coldStorageName}
//                   onChange={handleFormChange}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
//                   required
//                 >
//                   <option value="">Select Nearest Storage</option>
//                   {sortedColdStorages.map((storage) => (
//                     <option key={storage.id} value={storage.name}>
//                       {storage.name} - {storage.specialty} (
//                       {liveLocation
//                         ? `${Math.round(storage.distance)} km`
//                         : storage.location}
//                       )
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="flex justify-end gap-4 mt-8">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition shadow-md"
//                 >
//                   Book Now
//                 </button>
//               </div>
//               {bookingStatus && (
//                 <div
//                   className={`mt-4 p-4 rounded-lg flex items-center ${
//                     bookingStatus.type === "success"
//                       ? "bg-green-50 text-green-800"
//                       : bookingStatus.type === "error"
//                       ? "bg-red-50 text-red-800"
//                       : "bg-blue-50 text-blue-800"
//                   }`}
//                 >
//                   {bookingStatus.type === "loading" && (
//                     <div className="animate-spin h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
//                   )}
//                   {bookingStatus.type === "success" && (
//                     <FaCheckCircle className="mr-2" />
//                   )}
//                   {bookingStatus.type === "error" && (
//                     <FaTimes className="mr-2" />
//                   )}
//                   {bookingStatus.message}
//                 </div>
//               )}
//             </form>
//           </div>
//         </div>
//       )}

//       {/* {locationMode === "live" && liveLocation ? (
//   <NearbyColdStorages
//     userLocation={liveLocation}
//     onSelectStorage={handleSelectStorage}
//   />
// ) : (
//   <div className="bg-white rounded-xl shadow-md p-6 mb-6">
//     <div className="flex items-center justify-center py-8 text-gray-500">
//       <FaMapMarkerAlt className="mr-2" />
//       <p>Enable live location to see nearby cold storage facilities</p>
//     </div>
//   </div>
// )} */}

//       {/* Approval Confirmation Modal */}
//       {isApproveModalOpen && (
//         <div className="fixed inset-0 bg-opacity-70 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fadeIn">
//           <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border-t-4 border-green-500">
//             <div className="text-center">
//               <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4 animate-bounce" />
//               <h2 className="text-2xl font-bold text-gray-800 mb-2">
//                 Confirm Approval
//               </h2>
//               <p className="text-gray-600 mb-6">
//                 Are you sure you want to approve this booking? This action will
//                 notify the farmer and update the status.
//               </p>
//             </div>
//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={() => setIsApproveModalOpen(false)}
//                 className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmApproveBooking}
//                 className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition"
//               >
//                 Approve
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ColdStoragePage;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCurrentUser } from "../../../helper";
import Loader from "../Loader/Loader";
import LocationControl from "./LocationControl";
import SearchAndFilter from "./SearchAndFilter";
import BookingsList from "./BookingsList";
import BookingModal from "./BookingModal";
import ApprovalModal from "./ApprovalModal";
import NearbyColdStoragesMap from "./NearbyColdStoragesMap";

const ColdStoragePage = () => {
  const [bookings, setBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [locationMode, setLocationMode] = useState("live");
  const [liveLocation, setLiveLocation] = useState(null);
  const [manualLocation, setManualLocation] = useState({
    lat: null,
    lon: null,
  });
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [bookingForm, setBookingForm] = useState({
    cropQuantity: "",
    storageDuration: "",
    cropType: "",
    cropName: "",
    coldStorageName: "",
  });
  const [bookingStatus, setBookingStatus] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(false);
  const [coldStorages, setColdStorages] = useState([]); // New state for cold storages

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (user && user.id) {
      fetchBookings(user.id);
    }
  }, [user]);

  const fetchBookings = async (farmerId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:2529/coldStorage/bookings?farmerId=${farmerId}`
      );
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      setBookingStatus({
        type: "loading",
        message: "Submitting your booking...",
      });
      const bookingData = {
        farmerId: user.id,
        cropQuantity: parseFloat(bookingForm.cropQuantity),
        storageDuration: parseInt(bookingForm.storageDuration),
        cropType: bookingForm.cropType,
        cropName: bookingForm.cropName,
        coldStorageName: bookingForm.coldStorageName,
      };
      const response = await axios.post(
        "http://localhost:2529/coldStorage/book",
        bookingData
      );
      setBookingStatus({
        type: "success",
        message: `Booking submitted! Booking ID: ${response.data.id} (Pending approval)`,
      });
      setTimeout(() => {
        setBookingForm({
          cropQuantity: "",
          storageDuration: "",
          cropType: "",
          cropName: "",
          coldStorageName: "",
        });
        setIsModalOpen(false);
        fetchBookings(user.id);
      }, 1500);
    } catch (error) {
      setBookingStatus({
        type: "error",
        message:
          "Booking failed: " +  
          (error.response?.data?.message || "Unknown error"),
      });
    }
  };

  const handleApproveBooking = async (bookingId) => {
    setSelectedBookingId(bookingId);
    setIsApproveModalOpen(true);
  };

  const confirmApproveBooking = async () => {
    try {
      await axios.put(
        `http://localhost:2529/coldStorage/approve/${selectedBookingId}`
      );
      setIsApproveModalOpen(false);
      fetchBookings(user.id);
    } catch (error) {
      console.error("Approval failed:", error);
    }
  };

  console.log(coldStorages);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 md:ml-20 mt-16">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="px-8 pt-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2">
            Cold Storage
          </h1>
          <p className="text-gray-600 max-w-2xl text-lg">
            Secure your harvest with ease and precision
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 md:mt-0 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-lg transform hover:scale-105"
        >
          Book Storage
        </button>
      </div>

      <LocationControl
        locationMode={locationMode}
        setLocationMode={setLocationMode}
        liveLocation={liveLocation}
        setLiveLocation={setLiveLocation}
        manualLocation={manualLocation}
        setManualLocation={setManualLocation}
        district={district}
        setDistrict={setDistrict}
        state={state}
        setState={setState}
        loading={loading}
        setLoading={setLoading}
      />

      <SearchAndFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <BookingsList
        bookings={bookings}
        isLoading={isLoading}
        searchTerm={searchTerm}
        activeTab={activeTab}
        handleApproveBooking={handleApproveBooking}
      />

      <BookingModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        bookingForm={bookingForm}
        setBookingForm={setBookingForm}
        handleBookingSubmit={handleBookingSubmit}
        bookingStatus={bookingStatus}
        liveLocation={liveLocation}
        coldStorages={coldStorages} // Pass cold storages to BookingModal
      />

      <ApprovalModal
        isApproveModalOpen={isApproveModalOpen}
        setIsApproveModalOpen={setIsApproveModalOpen}
        confirmApproveBooking={confirmApproveBooking}
      />

      {liveLocation && (
        <NearbyColdStoragesMap
          liveLocation={liveLocation}
          onSelectStorage={(storage) =>
            setBookingForm((prev) => ({
              ...prev,
              coldStorageName: storage.name,
            }))
          }
          setColdStorages={setColdStorages}
        />
      )}
    </div>
  );
};

export default ColdStoragePage;

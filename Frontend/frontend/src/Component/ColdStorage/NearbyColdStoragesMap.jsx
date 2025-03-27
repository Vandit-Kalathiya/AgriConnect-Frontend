// import React, { useEffect, useState, useRef } from "react";
// import Map, { Marker, Popup } from "react-map-gl/mapbox";
// import "mapbox-gl/dist/mapbox-gl.css";
// import Loader from "../Loader/Loader";
// import { FaLocationDot } from "react-icons/fa6";
// import {
//   FaRegStar,
//   FaStar,
//   FaPhoneAlt,
//   FaTemperatureLow,
//   FaWarehouse,
// } from "react-icons/fa";
// import { IoIosTimer } from "react-icons/io";
// import { MdLocationOn } from "react-icons/md";
// import axios from "axios";

// const MAPBOX_API_KEY =
//   "pk.eyJ1IjoidmFuZGl0MTgiLCJhIjoiY204MDk3eWt4MHZlNjJqcjZma2xrcnVhciJ9.0tAvX_Ii5qtbAGDiyxfT_w";
// const CUSTOM_API_URL = "http://localhost:2529/coldStorage/nearby/d/s";
// const GOOGLE_MAPS_API_KEY = "AIzaSyBipDUAGdtYGXbH5NyqYLnvI9TopPmfP1M";

// const NearbyColdStoragesMap = ({
//   liveLocation,
//   onSelectStorage,
//   setColdStorages,
// }) => {
//   const [localColdStorages, setLocalColdStorages] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedStorage, setSelectedStorage] = useState(null);
//   const mapRef = useRef(null);

//   const fetchNearbyColdStorages = async () => {
//     if (!liveLocation) return;
//     setIsLoading(true);
//     try {
//       const res = await axios.get(
//         `https://nominatim.openstreetmap.org/reverse?lat=${liveLocation.lat}&lon=${liveLocation.lon}&format=json`
//       );
//       const address = res.data.address;
//       console.log(address);
//       const district = address.state_district;
//       const state = address.state;

//       const response = await axios.get(CUSTOM_API_URL, {
//         params: {
//           district,
//           state,
//           lat: liveLocation.lat,
//           lon: liveLocation.lon,
//         },
//       });
//       const storages = response.data;
//       if (storages.length === 0) {
//         console.log("No cold storages found nearby.");
//         setLocalColdStorages([]);
//         setColdStorages([]);
//       } else {
//         setLocalColdStorages(storages);
//         setColdStorages(storages);
//       }
//     } catch (error) {
//       console.error("Error fetching cold storages:", error);
//       setError("Failed to fetch cold storages: " + error.message);
//       setLocalColdStorages([]);
//       setColdStorages([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371; // Earth's radius in km
//     const dLat = (lat2 - lat1) * (Math.PI / 180);
//     const dLon = (lon2 - lon1) * (Math.PI / 180);
//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos(lat1 * (Math.PI / 180)) *
//         Math.cos(lat2 * (Math.PI / 180)) *
//         Math.sin(dLon / 2) *
//         Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c;
//   };

//   useEffect(() => {
//     fetchNearbyColdStorages();
//   }, [liveLocation]);

//   const handleMapLoad = () => {
//     if (liveLocation && mapRef.current) {
//       mapRef.current.flyTo({
//         center: [liveLocation.lon, liveLocation.lat],
//         zoom: 10,
//         duration: 2000,
//       });
//     }
//   };

//   const handleMapError = (event) => {
//     console.error("Mapbox error:", event);
//     setError(
//       `Map loading failed: ${
//         event.error?.status === 403
//           ? "Invalid Mapbox token or style permissions"
//           : event.error?.message || "Failed to fetch map tiles"
//       }`
//     );
//   };

//   // Generate star rating display
//   const renderRating = (rating) => {
//     if (!rating) return "N/A";

//     const stars = [];
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 >= 0.5;

//     for (let i = 0; i < 5; i++) {
//       if (i < fullStars) {
//         stars.push(<FaStar key={i} className="text-yellow-400 inline" />);
//       } else if (i === fullStars && hasHalfStar) {
//         stars.push(<FaStar key={i} className="text-yellow-400 inline" />);
//       } else {
//         stars.push(<FaRegStar key={i} className="text-gray-300 inline" />);
//       }
//     }

//     return (
//       <span className="flex items-center">
//         {stars} <span className="ml-1 text-sm text-gray-600">({rating})</span>
//       </span>
//     );
//   };

//   return (
//     <div className="relative w-full h-[600px] rounded-xl shadow-lg mt-12 mb-12 overflow-hidden">
//       {isLoading && (
//         <div className="absolute inset-0 flex items-center justify-center bg-gray-200/80 z-10">
//           <Loader />
//         </div>
//       )}

//       {error && (
//         <div className="absolute top-4 left-4 bg-red-100 p-2 rounded-lg text-red-600 z-10 shadow-md">
//           {error}
//         </div>
//       )}

//       <Map
//         ref={mapRef}
//         mapboxAccessToken={MAPBOX_API_KEY}
//         initialViewState={{
//           longitude: liveLocation?.lon || 78.9629,
//           latitude: liveLocation?.lat || 20.5937,
//           zoom: 10,
//         }}
//         onLoad={handleMapLoad}
//         onError={handleMapError}
//         style={{ width: "100%", height: "100%" }}
//         mapStyle="mapbox://styles/mapbox/streets-v11"
//       >
//         {liveLocation && (
//           <Marker longitude={liveLocation.lon} latitude={liveLocation.lat}>
//             <div className="w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow-md pulse-animation" />
//           </Marker>
//         )}

//         {localColdStorages.map((storage) => (
//           <Marker
//             key={storage.id}
//             longitude={storage.lon}
//             latitude={storage.lat}
//             onClick={(e) => {
//               e.originalEvent.stopPropagation();
//               setSelectedStorage(storage);
//             }}
//           >
//             <FaLocationDot
//               size={30}
//               color={selectedStorage?.id === storage.id ? "#e74c3c" : "#2ecc71"}
//               className="drop-shadow-md hover:scale-125 cursor-pointer transition-transform duration-200"
//             />
//           </Marker>
//         ))}

//         {selectedStorage && (
//           <Popup
//             longitude={selectedStorage.lon}
//             latitude={selectedStorage.lat}
//             onClose={() => setSelectedStorage(null)}
//             closeOnClick={false}
//             anchor="top"
//             maxWidth="320px"
//             className="custom-popup"
//           >
//             <div className="p-4 bg-white rounded-lg shadow-md w-full max-w-xs">
//               {/* Header with photo if available */}
//               {selectedStorage.photos && (
//                 <div className="relative mb-3 w-full h-32 rounded-md overflow-hidden">
//                   <img
//                     src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${
//                       JSON.parse(selectedStorage.photos)[0]?.photo_reference
//                     }&key=${GOOGLE_MAPS_API_KEY}`}
//                     alt={selectedStorage.name}
//                     className="w-full h-full object-cover"
//                     onError={(e) => {
//                       e.target.style.display = "none";
//                       console.error("Failed to load photo:", e);
//                     }}
//                   />
//                   <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2">
//                     <h3 className="text-lg font-bold truncate">
//                       {selectedStorage.name}
//                     </h3>
//                   </div>
//                 </div>
//               )}

//               {/* If no photo, just show the name */}
//               {!selectedStorage.photos && (
//                 <h3 className="text-lg font-bold text-gray-800 mb-3 truncate">
//                   {selectedStorage.name}
//                 </h3>
//               )}

//               {/* Key details */}
//               <div className="space-y-2 mb-3">
//                 <div className="flex items-center text-sm">
//                   <div className="w-6 text-green-600">
//                     <MdLocationOn size={16} />
//                   </div>
//                   <span className="text-gray-700 font-medium">
//                     {selectedStorage.vicinity || "N/A"}
//                   </span>
//                 </div>

//                 <div className="flex items-center text-sm">
//                   <div className="w-6 text-green-600">
//                     <FaPhoneAlt size={14} />
//                   </div>
//                   <span className="text-gray-700">
//                     {selectedStorage.phoneNumber || "No phone number available"}
//                   </span>
//                 </div>

//                 <div className="flex items-center text-sm">
//                   <div className="w-6 text-green-600">
//                     <IoIosTimer size={16} />
//                   </div>
//                   <span className="text-gray-700">
//                     {selectedStorage.openNow ? "Open Now" : "Closed"}
//                   </span>
//                 </div>

//                 <div className="flex items-center text-sm">
//                   <div className="w-6 text-green-600">
//                     <FaTemperatureLow size={14} />
//                   </div>
//                   <span className="text-gray-700">
//                     {selectedStorage.temperature || "Temperature not specified"}
//                   </span>
//                 </div>

//                 <div className="flex items-center text-sm">
//                   <div className="w-6 text-green-600">
//                     <FaWarehouse size={14} />
//                   </div>
//                   <span className="text-gray-700">
//                     {selectedStorage.capacity || "Capacity not specified"}
//                   </span>
//                 </div>

//                 <div className="flex items-center text-sm">
//                   <div className="w-6 text-yellow-500">
//                     {renderRating(selectedStorage.rating)}
//                   </div>
//                   <span className="text-gray-500 ml-1">
//                     ({selectedStorage.userRatingsTotal || 0} reviews)
//                   </span>
//                 </div>

//                 <div className="flex items-center text-sm">
//                   <div className="w-6">
//                     <span className="font-bold text-blue-600">≈</span>
//                   </div>
//                   <span className="text-gray-700 font-medium">
//                     {Math.round(
//                       calculateDistance(
//                         liveLocation.lat,
//                         liveLocation.lon,
//                         selectedStorage.lat,
//                         selectedStorage.lon
//                       )
//                     )}{" "}
//                     km away
//                   </span>
//                 </div>
//               </div>

//               {/* Additional Details Section */}
//               <div className="mt-3 pt-3 border-t border-gray-200">
//                 <p className="text-xs text-gray-500 mb-1">
//                   <strong>Status:</strong>{" "}
//                   {selectedStorage.businessStatus || "N/A"}
//                 </p>
//                 <p className="text-xs text-gray-500 mb-1">
//                   <strong>Specialty:</strong>{" "}
//                   {selectedStorage.specialty || "General"}
//                 </p>
//                 {selectedStorage.types && (
//                   <p className="text-xs text-gray-500">
//                     <strong>Types:</strong> {selectedStorage.types}
//                   </p>
//                 )}
//               </div>

//               {/* Action Button */}
//               <button
//                 onClick={() => onSelectStorage(selectedStorage)}
//                 className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors duration-200 font-medium flex items-center justify-center"
//               >
//                 Select This Storage
//               </button>
//             </div>
//           </Popup>
//         )}
//       </Map>

//       {/* Add custom styles for the pulsing effect */}
//       <style jsx>{`
//         .pulse-animation {
//           animation: pulse 1.5s infinite;
//         }

//         @keyframes pulse {
//           0% {
//             transform: scale(1);
//             box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.7);
//           }
//           70% {
//             transform: scale(1.1);
//             box-shadow: 0 0 0 10px rgba(37, 99, 235, 0);
//           }
//           100% {
//             transform: scale(1);
//             box-shadow: 0 0 0 0 rgba(37, 99, 235, 0);
//           }
//         }

//         /* Custom styles for the popup */
//         :global(.mapboxgl-popup-content) {
//           padding: 0;
//           border-radius: 8px;
//           overflow: hidden;
//           box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
//         }

//         :global(.mapboxgl-popup-close-button) {
//           font-size: 16px;
//           color: white;
//           top: 0;
//           right: 0;
//           padding: 8px;
//           z-index: 2;
//           background-color: rgba(0, 0, 0, 0.4);
//           border-radius: 0 0 0 8px;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default NearbyColdStoragesMap;

import React, { useEffect, useState, useRef } from "react";
import Map, {
  Marker,
  Popup,
  NavigationControl,
  ScaleControl,
  // FlyToInterpolator,
} from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import Loader from "../Loader/Loader";
import {
  // FaLocationDot,
  FaDirections,
  FaPhoneAlt,
  FaRegStar,
  FaStar,
  FaRegBookmark,
  FaBookmark,
  FaThermometerHalf,
  FaWarehouse,
} from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosTimer, IoMdInformationCircleOutline } from "react-icons/io";
import { MdLocationOn, MdOutlineLocalOffer } from "react-icons/md";
import { BiCurrentLocation } from "react-icons/bi";
import { BsListUl } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";

const MAPBOX_API_KEY =
  "pk.eyJ1IjoidmFuZGl0MTgiLCJhIjoiY204MDk3eWt4MHZlNjJqcjZma2xrcnVhciJ9.0tAvX_Ii5qtbAGDiyxfT_w";
const CUSTOM_API_URL = "http://localhost:2529/coldStorage/nearby/d/s";
const GOOGLE_MAPS_API_KEY = "AIzaSyBipDUAGdtYGXbH5NyqYLnvI9TopPmfP1M";

const NearbyColdStoragesMap = ({
  liveLocation,
  onSelectStorage,
  setColdStorages,
}) => {
  const [localColdStorages, setLocalColdStorages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [showListView, setShowListView] = useState(false);
  const [favoriteStorages, setFavoriteStorages] = useState([]);
  const [mapBounds, setMapBounds] = useState(null);
  const mapRef = useRef(null);

  const fetchNearbyColdStorages = async () => {
    if (!liveLocation) return;
    setIsLoading(true);
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${liveLocation.lat}&lon=${liveLocation.lon}&format=json`
      );
      const address = res.data.address;
      console.log(address);
      const district = address.city_district;
      const state = address.state;

      const response = await axios.get(CUSTOM_API_URL, {
        params: {
          district,
          state,
          lat: liveLocation.lat,
          lon: liveLocation.lon,
        },
      });
      const storages = response.data;
      if (storages.length === 0) {
        console.log("No cold storages found nearby.");
        setLocalColdStorages([]);
        setColdStorages([]);
      } else {
        setLocalColdStorages(storages);
        setColdStorages(storages);

        // Auto-select the first storage if available
        if (storages.length > 0) {
          setTimeout(() => {
            setSelectedStorage(storages[0]);
          }, 1000);
        }

        // Calculate map bounds to fit all storages
        calculateMapBounds(storages);
      }
    } catch (error) {
      console.error("Error fetching cold storages:", error);
      setError("Failed to fetch cold storages: " + error.message);
      setLocalColdStorages([]);
      setColdStorages([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate map bounds to fit all storages and user location
  const calculateMapBounds = (storages) => {
    if (!storages || storages.length === 0) return;

    let minLat = liveLocation.lat;
    let maxLat = liveLocation.lat;
    let minLng = liveLocation.lon;
    let maxLng = liveLocation.lon;

    storages.forEach((storage) => {
      minLat = Math.min(minLat, storage.lat);
      maxLat = Math.max(maxLat, storage.lat);
      minLng = Math.min(minLng, storage.lon);
      maxLng = Math.max(maxLng, storage.lon);
    });

    // Add padding
    const latPadding = (maxLat - minLat) * 0.2;
    const lngPadding = (maxLng - minLng) * 0.2;

    setMapBounds({
      southWest: [minLng - lngPadding, minLat - latPadding],
      northEast: [maxLng + lngPadding, maxLat + latPadding],
    });
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Toggle favorite status
  const toggleFavorite = (id) => {
    if (favoriteStorages.includes(id)) {
      setFavoriteStorages(favoriteStorages.filter((item) => item !== id));
    } else {
      setFavoriteStorages([...favoriteStorages, id]);
    }
  };

  useEffect(() => {
    fetchNearbyColdStorages();
  }, [liveLocation]);

  useEffect(() => {
    if (mapBounds && mapRef.current) {
      // Fit map to bounds
      mapRef.current.fitBounds([mapBounds.southWest, mapBounds.northEast], {
        padding: 40,
        duration: 2000,
      });
    }
  }, [mapBounds]);

  const handleMapLoad = () => {
    if (liveLocation && mapRef.current) {
      mapRef.current.flyTo({
        center: [liveLocation.lon, liveLocation.lat],
        zoom: 10,
        duration: 1500,
      });
    }
  };

  const handleMapError = (event) => {
    console.error("Mapbox error:", event);
    setError(
      `Map loading failed: ${
        event.error?.status === 403
          ? "Invalid Mapbox token or style permissions"
          : event.error?.message || "Failed to fetch map tiles"
      }`
    );
  };

  // Fly to specific storage
  const flyToStorage = (storage) => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [storage.lon, storage.lat],
        zoom: 14,
        duration: 1000,
      });
      setSelectedStorage(storage);
      setShowListView(false);
    }
  };

  // Center map on user location
  const centerOnUserLocation = () => {
    if (liveLocation && mapRef.current) {
      mapRef.current.flyTo({
        center: [liveLocation.lon, liveLocation.lat],
        zoom: 12,
        duration: 1000,
      });
    }
  };

  // Show all storages
  const showAllStorages = () => {
    if (mapBounds && mapRef.current) {
      mapRef.current.fitBounds([mapBounds.southWest, mapBounds.northEast], {
        padding: 40,
        duration: 1000,
      });
    }
  };

  // Generate star rating display
  const renderRating = (rating) => {
    if (!rating) return <span className="text-gray-400">No rating</span>;

    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300" />);
      }
    }

    return (
      <div className="flex items-center">
        <div className="flex mr-1">{stars}</div>
        <span className="text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  // Get a tag for the storage based on its properties
  const getStorageTag = (storage) => {
    if (storage.specialty && storage.specialty !== "General") {
      return { text: storage.specialty, color: "bg-blue-100 text-blue-800" };
    }
    if (storage.temperature) {
      return {
        text: storage.temperature,
        color: "bg-green-100 text-green-800",
      };
    }
    if (storage.businessStatus === "OPERATIONAL") {
      return { text: "Open", color: "bg-green-100 text-green-800" };
    }
    return { text: "Cold Storage", color: "bg-gray-100 text-gray-800" };
  };

  return (
    <div className="relative w-full h-[650px] rounded-xl shadow-xl mt-12 mb-12 overflow-hidden border border-gray-100">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-20 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <Loader />
            <p className="mt-4 text-gray-600 font-medium">
              Finding nearby cold storages...
            </p>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute top-4 left-4 bg-red-100 p-3 rounded-lg text-red-700 z-10 shadow-lg flex items-center">
          <IoMdInformationCircleOutline className="mr-2 text-xl" />
          {error}
        </div>
      )}

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
        <button
          className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
          onClick={() => setShowListView(!showListView)}
          title="Toggle list view"
        >
          <BsListUl size={20} className="text-gray-700" />
        </button>
        <button
          className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
          onClick={centerOnUserLocation}
          title="Center on your location"
        >
          <BiCurrentLocation size={20} className="text-blue-600" />
        </button>
        <button
          className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
          onClick={showAllStorages}
          title="Show all cold storages"
        >
          <FaWarehouse size={20} className="text-gray-700" />
        </button>
      </div>

      {/* Map */}
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_API_KEY}
        initialViewState={{
          longitude: liveLocation?.lon || 78.9629,
          latitude: liveLocation?.lat || 20.5937,
          zoom: 10,
        }}
        onLoad={handleMapLoad}
        onError={handleMapError}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        {/* Navigation Controls */}
        <NavigationControl position="bottom-right" />
        <ScaleControl position="bottom-left" />

        {/* User Location Marker */}
        {liveLocation && (
          <Marker longitude={liveLocation.lon} latitude={liveLocation.lat}>
            <div className="relative">
              <div className="w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow-md pulse-animation z-10" />
              <div className="absolute top-0 left-0 w-6 h-6 bg-blue-400 rounded-full opacity-50 animate-ping" />
            </div>
          </Marker>
        )}

        {/* Cold Storage Markers */}
        {localColdStorages.map((storage) => (
          <Marker
            key={storage.id}
            longitude={storage.lon}
            latitude={storage.lat}
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedStorage(storage);
            }}
          >
            <div className="relative cursor-pointer transform transition-transform duration-200 hover:scale-110">
              <FaLocationDot
                size={36}
                color={
                  selectedStorage?.id === storage.id ? "#e74c3c" : "#2ecc71"
                }
                className="drop-shadow-lg"
              />
              {/* Custom marker label */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-white px-2 py-0.5 rounded-full text-xs font-bold shadow-md">
                {storage.name.split(" ")[0]}
              </div>
            </div>
          </Marker>
        ))}

        {/* Selected Storage Popup */}
        {selectedStorage && (
          <Popup
            longitude={selectedStorage.lon}
            latitude={selectedStorage.lat}
            onClose={() => setSelectedStorage(null)}
            closeOnClick={false}
            anchor="bottom"
            maxWidth="340px"
            className="custom-popup"
            closeButton={false}
          >
            <div className="p-0 bg-white rounded-lg shadow-lg w-full max-w-xs overflow-hidden">
              {/* Close button */}
              <button
                onClick={() => setSelectedStorage(null)}
                className="absolute top-2 right-2 z-10 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full transition-colors"
              >
                <AiOutlineClose size={16} />
              </button>

              {/* Storage Photo */}
              <div className="relative h-40 w-full bg-gray-100">
                {selectedStorage.photos ? (
                  <img
                    src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${
                      JSON.parse(selectedStorage.photos)[0]?.photo_reference
                    }&key=${GOOGLE_MAPS_API_KEY}`}
                    alt={selectedStorage.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      console.error("Failed to load photo:", e);
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                    <FaWarehouse size={48} className="text-white opacity-80" />
                  </div>
                )}

                {/* Favorites button */}
                <button
                  onClick={() => toggleFavorite(selectedStorage.id)}
                  className="absolute top-2 left-2 z-10 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-colors"
                >
                  {favoriteStorages.includes(selectedStorage.id) ? (
                    <FaBookmark size={16} className="text-yellow-500" />
                  ) : (
                    <FaRegBookmark size={16} />
                  )}
                </button>

                {/* Storage name overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                  <h3 className="text-xl font-bold truncate">
                    {selectedStorage.name}
                  </h3>
                  <div className="flex items-center mt-1">
                    {renderRating(selectedStorage.rating)}
                    <span className="ml-2 text-sm">
                      ({selectedStorage.userRatingsTotal || 0} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Status tag */}
              <div className="px-4 py-2">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                    getStorageTag(selectedStorage).color
                  }`}
                >
                  {getStorageTag(selectedStorage).text}
                </span>
                {selectedStorage.openNow && (
                  <span className="inline-block ml-2 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    Open Now
                  </span>
                )}
              </div>

              {/* Key details */}
              <div className="px-4 py-2 space-y-3">
                <div className="flex items-start">
                  <div className="w-6 text-gray-500 mt-1">
                    <MdLocationOn />
                  </div>
                  <div className="ml-2 text-sm text-gray-700">
                    {selectedStorage.vicinity || "Address not available"}
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-6 text-gray-500">
                    <FaPhoneAlt size={14} />
                  </div>
                  <div className="ml-2 text-sm text-gray-700">
                    {selectedStorage.phoneNumber ? (
                      <a
                        href={`tel:${selectedStorage.phoneNumber}`}
                        className="text-blue-600 hover:underline"
                      >
                        {selectedStorage.phoneNumber}
                      </a>
                    ) : (
                      "Phone not available"
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-6 text-gray-500">
                    <FaThermometerHalf />
                  </div>
                  <div className="ml-2 text-sm text-gray-700">
                    {selectedStorage.temperature || "Temperature not specified"}
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-6 text-gray-500">
                    <FaWarehouse />
                  </div>
                  <div className="ml-2 text-sm text-gray-700">
                    {selectedStorage.capacity || "Capacity not specified"}
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-6 text-blue-500">
                    <FaDirections />
                  </div>
                  <div className="ml-2 text-sm font-medium">
                    {Math.round(
                      calculateDistance(
                        liveLocation.lat,
                        liveLocation.lon,
                        selectedStorage.lat,
                        selectedStorage.lon
                      )
                    )}{" "}
                    km away
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="px-4 py-3 border-t border-gray-100">
                <button
                  onClick={() => onSelectStorage(selectedStorage)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition-colors duration-200 font-medium flex items-center justify-center"
                >
                  Select This Storage
                </button>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedStorage.lat},${selectedStorage.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors duration-200 font-medium flex items-center justify-center"
                >
                  <FaDirections className="mr-2" /> Get Directions
                </a>
              </div>
            </div>
          </Popup>
        )}
      </Map>

      {/* Side panel with list view */}
      <div
        className={`absolute top-0 left-0 bottom-0 w-80 bg-white shadow-lg z-10 transition-transform duration-300 ${
          showListView ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">
            {localColdStorages.length} Cold Storages Found
          </h3>
          <button
            onClick={() => setShowListView(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <AiOutlineClose size={20} />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-60px)]">
          {localColdStorages.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No cold storages found nearby.
            </div>
          ) : (
            localColdStorages.map((storage) => (
              <div
                key={storage.id}
                className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedStorage?.id === storage.id
                    ? "bg-green-50 border-l-4 border-l-green-500"
                    : ""
                }`}
                onClick={() => flyToStorage(storage)}
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-800 truncate max-w-[80%]">
                    {storage.name}
                  </h4>
                  <span className="text-sm text-gray-600">
                    {Math.round(
                      calculateDistance(
                        liveLocation.lat,
                        liveLocation.lon,
                        storage.lat,
                        storage.lon
                      )
                    )}{" "}
                    km
                  </span>
                </div>

                <div className="mt-1 flex items-center">
                  {renderRating(storage.rating)}
                </div>

                <div className="mt-2 text-xs text-gray-600 truncate">
                  {storage.vicinity || "Address not available"}
                </div>

                <div className="mt-2 flex items-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                      getStorageTag(storage).color
                    }`}
                  >
                    {getStorageTag(storage).text}
                  </span>
                  {storage.openNow && (
                    <span className="inline-block ml-2 px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                      Open Now
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Map overlay - your location info */}
      {liveLocation && !showListView && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-2">
              <BiCurrentLocation size={18} className="text-white" />
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Your Location</h4>
              <p className="text-xs text-gray-600">
                Showing cold storages near you
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add custom styles for the pulsing effect */}
      <style jsx>{`
        .pulse-animation {
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.7);
          }
          70% {
            transform: scale(1.1);
            box-shadow: 0 0 0 10px rgba(37, 99, 235, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(37, 99, 235, 0);
          }
        }

        /* Custom styles for the popup */
        :global(.mapboxgl-popup-content) {
          padding: 0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          max-width: 320px !important;
        }

        :global(.mapboxgl-popup-close-button) {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default NearbyColdStoragesMap;

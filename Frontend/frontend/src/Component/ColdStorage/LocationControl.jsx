import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";
import { indiaStates, districtsByState } from "./indiaLocations";

const LocationControl = ({
  locationMode,
  setLocationMode,
  liveLocation,
  setLiveLocation,
  manualLocation,
  setManualLocation,
  district,
  setDistrict,
  state,
  setState,
  loading,
  setLoading,
}) => {
  const [selectedState, setSelectedState] = useState("");
  const [availableDistricts, setAvailableDistricts] = useState([]);

  const fetchLiveLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLiveLocation({ lat: latitude, lon: longitude });
          const locationData = await reverseGeocode(latitude, longitude);
          setDistrict(locationData.district);
          setState(locationData.state);
          setSelectedState(locationData.state);
          setAvailableDistricts(districtsByState[locationData.state] || []);
          setLoading(false);
        },
        (error) => {
          console.error("Location error:", error);
          setDistrict("Unable to fetch");
          setState("Unable to fetch");
          setLoading(false);
        }
      );
    }
  };

  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const address = response.data.address;
      return {
        district: address.county || address.city_district || "N/A",
        state: address.state || "N/A",
      };
    } catch (error) {
      return { district: "N/A", state: "N/A" };
    }
  };

  const forwardGeocode = async (district, state) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${district},${state},India`
      );
      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        const coords = { lat: parseFloat(lat), lon: parseFloat(lon) };
        setManualLocation(coords);
        setLiveLocation(coords);
        return coords;
      }
      return null;
    } catch (error) {
      console.error("Error forward geocoding:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleStateChange = (e) => {
    const stateValue = e.target.value;
    setSelectedState(stateValue);
    setState(stateValue);
    setDistrict("");
    setAvailableDistricts(districtsByState[stateValue] || []);
  };

  const handleDistrictChange = (e) => {
    const districtValue = e.target.value;
    setDistrict(districtValue);
    if (selectedState && districtValue) {
      forwardGeocode(districtValue, selectedState);
    }
  };

  useEffect(() => {
    if (locationMode === "live") {
      fetchLiveLocation();
    }
  }, [locationMode]);

  useEffect(() => {
    fetchLiveLocation();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 animate-slideUp">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-green-600" />
          <span className="text-lg font-semibold text-gray-800">
            Your Location:
          </span>
          <span className="text-gray-600">
            {loading ? "Loading..." : `${district || "N/A"}, ${state || "N/A"}`}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setLocationMode("live")}
            className={`px-4 py-2 rounded-lg font-medium ${
              locationMode === "live"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } transition`}
          >
            Live Tracking
          </button>
          <button
            onClick={() => setLocationMode("manual")}
            className={`px-4 py-2 rounded-lg font-medium ${
              locationMode === "manual"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } transition`}
          >
            Manual Entry
          </button>
        </div>
      </div>

      {locationMode === "manual" && (
        <div className="mt-4 grid md:grid-cols-2 gap-4 animate-fadeIn">
          <select
            value={selectedState}
            onChange={handleStateChange}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          >
            <option value="">Select State</option>
            {indiaStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>

          <select
            value={district}
            onChange={handleDistrictChange}
            disabled={!selectedState}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          >
            <option value="">Select District</option>
            {availableDistricts.map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default LocationControl;

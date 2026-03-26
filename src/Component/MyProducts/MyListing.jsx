import React, { useState, useEffect } from "react";
import api from "../../config/axiosInstance";
import { getCurrentUser } from "../../../helper";
import CropCard from "./CropCard";
import Loader from "../Loader/Loader";
import { API_CONFIG } from "../../config/apiConfig";

export const MyListing = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllListings = async () => {
    const user = await getCurrentUser();
    const userContact = user.phoneNumber;
    try {
      const response = await api.get(
        `${API_CONFIG.MARKET_ACCESS}/listings/user/${userContact}`
      );
      setLoading(true);
      setListings(response.data);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllListings();
  }, []);

  return (
    <div className="bg-grady-50 py-6 md:py-12 px-3 sm:px-4 md:px-6 lg:px-8 md:ml-20 min-h-[calc(100vh-3.5rem)] overflow-x-hidden">
      <div className="max-w-full md:max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 md:mb-10 text-center bg-clip-text drop-shadow-md">
          My Crop Listings
        </h1>
        {loading && (
          <div className="flex justify-center items-center min-h-[50vh]">
            <Loader />
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {listings.map((crop) => (
            <CropCard key={crop.id} crop={crop} />
          ))}
        </div>
        {!loading && listings.length === 0 && (
          <p className="text-center text-gray-600 text-md md:text-lg mt-6 md:mt-8 italic">
            No listings available. Add a new crop listing to get started!
          </p>
        )}
      </div>
    </div>
  );
};

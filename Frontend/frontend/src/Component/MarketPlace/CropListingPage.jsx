import React, { useState, useEffect } from "react";
import CropCard from "./CropCard";
import axios from "axios";
import Loader from "../Loader/Loader";
import { getCurrentUser } from "../../../helper";

const BASE_URL = "http://localhost:2527"; // Adjust to your backend URL

export const CropListingPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState({});

  const fetchUser = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
      return user;
    } catch (err) {
      console.error("Failed to fetch current user:", err);
    }
  };

  useEffect(() => {
    fetchUser()
  },[])

  const fetchAllListings = async () => {
    setLoading(true); 

    try {
      const response = await axios.get(`${BASE_URL}/listings/all/active`, {
        withCredentials: true,
      });

      const user = await getCurrentUser(); 

      const listings = response.data.filter(
        (listing) => listing.contactOfFarmer !== user.phoneNumber 
      );

      // Fetch images for each listing (if needed)
      const listingsWithImages = await Promise.all(
        listings.map(async (listing) => ({
          id: listing.id,
          images: listing.images, // Match CropCard structure
          type: listing.productType,
          variety: listing.productName,
          grade: listing.qualityGrade,
          certifications: listing.certifications
            ? listing.certifications.split(", ")
            : [],
          quantity: listing.quantity,
          unit: listing.unitOfQuantity,
          location: listing.location,
          harvestDate: listing.harvestedDate,
          availabilityDate: listing.availabilityDate,
          shelfLife: listing.shelfLifetime,
          price: `₹${listing.finalPrice}`,
          priceUnit: "per " + listing.unitOfQuantity,
          description: listing.productDescription,
          contact: listing.contactOfFarmer,
          lastUpdatedDate: listing.lastUpdatedDate,
          createdDate: listing.createdDate,
          createdTime: listing.createdTime,
          rating: 4.5,
        }))
      );

      setListings(listingsWithImages);
      setError(null);
    } catch (err) {
      setError(
        `Failed to fetch listings: ${err.response?.data || err.message}`
      );
    } finally {
      setLoading(false); // Ensure loading is stopped in all cases
    }
  };


  useEffect(() => {
    fetchAllListings();
  }, []);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 py-6 md:py-12 px-4 md:px-6 lg:px-8 ml-0 md:ml-20 mt-16 md:mt-20 min-h-screen">
      <div className="max-w-full md:max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 md:mb-10 text-center bg-clip-text drop-shadow-md">
          Fresh Produce Marketplace
        </h1>

        {loading && (
          <div className="text-center text-gray-600 text-md md:text-lg">
            <Loader />
          </div>
        )}

        {error && (
          <p className="text-center text-red-500 text-md md:text-lg">{error}</p>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {listings.map((crop) => (
              <CropCard key={crop.id} crop={crop} />
            ))}
          </div>
        )}

        {!loading && !error && listings.length === 0 && (
          <p className="text-center text-gray-600 text-md md:text-lg mt-6 md:mt-8 italic">
            No listings available. Add a new crop listing to get started!
          </p>
        )}
      </div>
    </div>
  );
};

export default CropListingPage;

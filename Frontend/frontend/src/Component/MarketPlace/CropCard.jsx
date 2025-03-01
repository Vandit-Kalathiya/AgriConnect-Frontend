import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import axios from "axios";

// Simple in-memory cache for image URLs
const imageCache = new Map();

const CropCard = ({ crop }) => {
  const listingId = crop.id;
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const imagePromises = crop.images.map((image) => {
        const imageUrl = `http://localhost:2527/image/${image.id}`;

        // Check cache first
        // if (imageCache.has(imageUrl)) {
        //   return Promise.resolve(imageCache.get(imageUrl));
        // }

        // Fetch image if not in cache
        return axios
          .get(imageUrl, {
            withCredentials: true,
            responseType: "blob",
          })
          .then((res) => {
            const url = URL.createObjectURL(res.data);
            // imageCache.set(imageUrl, url); // Cache the URL
            return url;
          });
      });

      const imageUrls = await Promise.all(imagePromises);
      setImages(imageUrls);
    } catch (err) {
      setError("Failed to load images");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Cleanup Blob URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      images.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  // Memoize the date formatting to avoid unnecessary recalculations
  const formattedDate = useMemo(() => {
    return new Date(crop.availabilityDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [crop.availabilityDate]);

  return (
    <Link to={`/crop/${crop.id}`} state={{ cropData: crop, images }}>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full flex flex-col hover:shadow-xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:bg-jewel-50">
        {loading ? (
          <div className="w-full h-48 sm:h-56 md:h-64 bg-gray-200 animate-pulse rounded-t-2xl" />
        ) : (
          <img
            src={
              images[0] || "https://via.placeholder.com/600x400?text=No+Image"
            }
            alt={`${crop.type} - ${crop.variety}`}
            className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-t-2xl transition-opacity duration-300 hover:opacity-90"
          />
        )}
        <div className="p-4 md:p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2 md:mb-3">
              <h2 className="text-md md:text-lg lg:text-xl font-semibold text-gray-800 line-clamp-1">
                {crop.type} - {crop.variety}
              </h2>
              <span className="flex items-center text-yellow-500 text-xs md:text-sm">
                <FaStar className="mr-1" />
                {crop.rating.toFixed(1)}
              </span>
            </div>
            <p className="text-md md:text-lg font-bold text-gray-900 mb-1 md:mb-2">
              {crop.price}{" "}
              <span className="text-xs md:text-sm font-medium text-gray-600">
                {crop.priceUnit}
              </span>
            </p>
            <p className="text-xs md:text-sm text-gray-500 mb-2 md:mb-3 line-clamp-2">
              {crop.description}
            </p>
          </div>
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs md:text-sm text-gray-600 mb-2 md:mb-3 gap-1 sm:gap-0">
              <span className="truncate">{crop.location}</span>
              <span className="whitespace-nowrap">{formattedDate}</span>
            </div>
            {crop.certifications.length > 0 && (
              <div className="mt-1 md:mt-2 flex flex-wrap gap-1 md:gap-2">
                {crop.certifications.map((cert, index) => (
                  <span
                    key={index}
                    className="px-2 md:px-3 py-1 bg-jewel-100 text-jewel-700 text-xs font-medium rounded-full shadow-sm"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CropCard;

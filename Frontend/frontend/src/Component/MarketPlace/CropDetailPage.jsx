import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import CropImageGallery from "./CropImageGallery";
import CropDetails from "./CropDetails";
import CropTimeline from "./CropTimeline";
import FreshnessMeter from "./FreshnessMeter";
import ActionBar from "./ActionBar";

export const CropDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [cropData, setCropData] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if data was passed via state (from CropCard)
  const { cropData: initialCropData, images: initialImages } =
    location.state || {};

  const fetchCropData = async () => {
    try {
      setLoading(true);

      // // Use initial data from state if available (e.g., from CropCard)
      // if (initialCropData && initialImages) {
      //   setCropData(initialCropData);
      //   setImages(initialImages);
      //   setLoading(false);
      //   return;
      // }

      // // Otherwise, fetch from backend
      const response = await axios.get(
        `http://localhost:2527/listings/get/${id}`,
        {
          withCredentials: true,
        }
      );

      const listing = response.data;

      // Map backend fields to frontend structure
      const mappedCropData = {
        id: listing.id,
        images: listing.images, // Array of image objects with id
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
        price: `$${(listing.finalPrice / 100).toFixed(2)}`, // Assuming price is in cents
        priceUnit: `per ${listing.unitOfQuantity}`,
        description: listing.productDescription,
        contact: listing.contactOfFarmer,
        rating: 4.5, // Hardcoded; fetch from backend if available
      };

      setCropData(mappedCropData);

      // Fetch images
      const imagePromises = listing.images.map((image) =>
        axios
          .get(`http://localhost:2527/image/${image.id}`, {
            withCredentials: true,
            responseType: "blob",
          })
          .then((res) => URL.createObjectURL(res.data))
      );

      const imageUrls = await Promise.all(imagePromises);
      setImages(imageUrls);
    } catch (err) {
      setError(
        `Failed to fetch crop data: ${err.response?.data || err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCropData();
  }, []);

  useEffect(() => {
    return () => {
      images.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  if (!cropData) {
    return <div className="text-center py-12">No crop data available</div>;
  }

  // console.log(cropData);

  return (
    <div className="bg-gray-50 py-12 md:ml-20 mt-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CropImageGallery
            images={images}
            type={cropData.type}
            variety={cropData.variety}
          />
          <div className="space-y-6">
            <CropDetails crop={cropData} />
            <CropTimeline
              harvestDate={cropData.harvestDate}
              availabilityDate={cropData.availabilityDate}
            />
            {/* <FreshnessMeter shelfLife={cropData.shelfLife} /> */}
          </div>
        </div>
        <ActionBar crop={cropData} />
      </div>
    </div>
  );
};

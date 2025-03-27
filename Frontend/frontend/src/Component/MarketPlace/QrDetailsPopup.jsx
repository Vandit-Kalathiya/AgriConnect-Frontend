import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { X } from "lucide-react";

const QrDetailsPopup = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cropData, setCropData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCropData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:2527/listings/get/${id}`,
          {
            withCredentials: true,
          }
        );
        const listing = response.data;
        setCropData({
          variety: listing.productName,
          type: listing.productType,
          location: listing.location,
          price: `₹${listing.finalPrice.toFixed(2)}`,
          quantity: `${listing.quantity} ${listing.unitOfQuantity}`,
          available: listing.status === "ACTIVE" ? "Yes" : "No",
          shelfLife: listing.shelfLifetime,
          contact: listing.contactOfFarmer,
          harvestDate: listing.harvestedDate,
        });
      } catch (err) {
        setError(`Failed to fetch data: ${err.response?.data || err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchCropData();
  }, [id]);

  const handleClose = () => {
    navigate(-1); // Go back to previous page
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!cropData) return <div>No data available</div>;

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Product Details
        </h2>
        <div className="space-y-2">
          <p>
            <strong>Variety:</strong> {cropData.variety}
          </p>
          <p>
            <strong>Type:</strong> {cropData.type}
          </p>
          <p>
            <strong>Location:</strong> {cropData.location}
          </p>
          <p>
            <strong>Price:</strong> {cropData.price}
          </p>
          <p>
            <strong>Quantity:</strong> {cropData.quantity}
          </p>
          <p>
            <strong>Available:</strong> {cropData.available}
          </p>
          <p>
            <strong>Shelf Life:</strong> {cropData.shelfLife}
          </p>
          <p>
            <strong>Contact:</strong> {cropData.contact}
          </p>
          <p>
            <strong>Harvest Date:</strong> {cropData.harvestDate}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QrDetailsPopup;

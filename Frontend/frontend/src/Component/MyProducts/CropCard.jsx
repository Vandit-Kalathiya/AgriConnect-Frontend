// CropCard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import axios from "axios";

const CropCard = ({ crop }) => {
  const [images, setImages] = useState([]);
  console.log(crop);

  const getImage = async () => {
    const imageUrl = `http://localhost:2527/image/${crop.images[0].id}`;
    await axios
      .get(imageUrl, {
        withCredentials: true,
        responseType: "blob",
      })
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        setImages(url);
      });
  };

  useEffect(() => {
    getImage();
  })

  return (
    <Link to={`/crop/${crop.id}`}>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full flex flex-col hover:shadow-xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:bg-jewel-50">
        <img
          src={images}
          alt={`${crop.type} - ${crop.variety}`}
          className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-t-2xl transition-opacity duration-300 hover:opacity-90"
        />
        <div className="p-4 md:p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2 md:mb-3">
              <h2 className="text-md md:text-lg lg:text-xl font-semibold text-gray-800 line-clamp-1">
                {crop.productType} - {crop.productName}
              </h2>
              {/* <span className="flex items-center text-yellow-500 text-xs md:text-sm">
                <FaStar className="mr-1" />
                {crop.rating.toFixed(1)}
              </span> */}
            </div>
            <p className="text-md md:text-lg font-bold text-gray-900 mb-1 md:mb-2">
              ₹{crop.finalPrice}{" "}
              <span className="text-xs md:text-sm font-medium text-gray-600">
                per {crop.unitOfQuantity}
              </span>
            </p>
            <p className="text-xs md:text-sm text-gray-500 mb-2 md:mb-3 line-clamp-2">
              {crop.description}
            </p>
          </div>
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs md:text-sm text-gray-600 mb-2 md:mb-3 gap-1 sm:gap-0">
              <span className="truncate">{crop.location}</span>
              <span className="whitespace-nowrap">
                {new Date(crop.availabilityDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="mt-1 md:mt-2 flex flex-wrap gap-1 md:gap-2">
              <span className="px-2 md:px-3 py-1 bg-jewel-100 text-jewel-700 text-xs font-medium rounded-full shadow-sm">
                {crop.certifications}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CropCard;

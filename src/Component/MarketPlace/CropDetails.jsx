import React from "react";
import {
  Star,
  ShieldCheck,
  Award,
  Tag,
  MapPin,
  Leaf,
  Calendar,
  User,
  ChevronRight,
  Phone,
  BarChart,
  Scale,
  Truck,
} from "lucide-react";

const CropDetails = ({ crop }) => {
  // Format price if it's a string with currency symbol
  const formattedPrice =
    typeof crop.price === "string" ? crop.price : `₹${crop.price}`;

  // Function to render star rating with half stars support
  const renderStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        // Full star
        stars.push(
          <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        // Half star
        stars.push(
          <div key={i} className="relative">
            <Star size={18} className="text-gray-300" />
            <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
              <Star size={18} className="text-yellow-400 fill-yellow-400" />
            </div>
          </div>
        );
      } else {
        // Empty star
        stars.push(<Star key={i} size={18} className="text-gray-300" />);
      }
    }

    return stars;
  };

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";

    try {
      const parts = dateStr.split("/");
      if (parts.length === 3) {
        const [day, month, year] = parts;
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      }
      return dateStr;
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              {crop.variety}
            </h1>
            <p className="text-gray-500 mb-3">
              {crop.farmName || "Local Farm"}
            </p>
          </div>
          <div className="bg-green-100 px-4 py-2 rounded-full flex items-center">
            <span className="text-green-800 font-bold">{crop.grade}</span>
            {/* <span className="text-green-600 text-xs ml-1">Grade</span> */}
          </div>
        </div>

        <div className="flex items-center mb-4">
          <div className="flex items-center">
            {renderStarRating(crop.rating)}
          </div>
          <span className="ml-2 text-sm font-medium text-gray-600">
            {crop.rating.toFixed(1)}
          </span>
          <span className="mx-2 text-gray-300">•</span>
          <span className="text-sm text-gray-500">
            Based on {Math.floor(Math.random() * 100) + 20} reviews
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8 mb-4">
          <div className="flex items-center text-gray-700">
            <User size={16} className="mr-2 text-gray-500" />
            <span>{crop.farmerName || "Local Farmer"}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <MapPin size={16} className="mr-2 text-gray-500" />
            <span>{crop.location}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Calendar size={16} className="mr-2 text-gray-500" />
            <span>Harvested on {formatDate(crop.harvestDate)}</span>
          </div>
        </div>

        <div className="border-t border-b border-gray-200 py-4 my-4">
          <div className="flex items-baseline">
            <p className="text-3xl font-bold text-gray-900">{formattedPrice}</p>
            <span className="ml-2 text-sm text-gray-500">{crop.priceUnit}</span>
          </div>

          {crop.quantity && (
            <div className="mt-2 flex items-center">
              <div className="bg-blue-50 px-3 py-1 rounded-full inline-flex items-center">
                <Scale size={14} className="mr-1 text-blue-600" />
                <span className="text-blue-800 font-medium text-sm">
                  Available: {crop.quantity} {crop.unit}
                </span>
              </div>
            </div>
          )}
        </div>

        {crop.certifications && crop.certifications.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Certifications
            </p>
            <div className="flex flex-wrap gap-2">
              {crop.certifications.map((cert) => (
                <span
                  key={cert}
                  className="inline-flex items-center bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full"
                >
                  <ShieldCheck size={14} className="mr-1" />
                  {cert}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-center gap-3">
            <Truck size={24} className="mr-2 text-green-600" />
            <div>
              <p className="text-xs text-gray-500">Delivery</p>
              <p className="font-medium text-gray-800">Free</p>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-center gap-3">
            <BarChart size={24} className="mr-2 text-green-600" />
            <div>
              <p className="text-xs text-gray-500">Quality</p>
              <p className="font-medium text-gray-800">{crop.grade}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-center gap-3">
            <Calendar size={24} className="mr-2 text-green-600" />
            <div>
              <p className="text-xs text-gray-500">Shelf Life</p>
              <p className="font-medium text-gray-800">{crop.shelfLife} days</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Description
        </h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          {crop.description ||
            `Fresh ${crop.variety} from ${crop.location}. Harvested with care at peak ripeness to ensure maximum flavor and nutrition. Our ${crop.variety} is grown using sustainable farming practices to maintain soil health and biodiversity.`}
        </p>

        <div className="flex flex-wrap gap-3 mt-4">
          {/* Farm features - these could come from API in a real app */}
          <div className="bg-gray-50 px-3 py-1.5 rounded-full text-xs font-medium text-gray-700 flex items-center">
            <Leaf size={12} className="mr-1 text-green-600" />
            Pesticide Free
          </div>
          <div className="bg-gray-50 px-3 py-1.5 rounded-full text-xs font-medium text-gray-700 flex items-center">
            <ShieldCheck size={12} className="mr-1 text-green-600" />
            Quality Tested
          </div>
          <div className="bg-gray-50 px-3 py-1.5 rounded-full text-xs font-medium text-gray-700 flex items-center">
            <Award size={12} className="mr-1 text-green-600" />
            Premium Quality
          </div>
        </div>
      </div>

      {crop.contact && (
        <div className="bg-green-50 p-5 rounded-lg mt-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 -mt-10 -mr-10 bg-green-100 rounded-full opacity-50"></div>
          <h3 className="font-semibold text-gray-800 mb-2 relative z-10">
            Farmer Contact
          </h3>
          <p className="text-gray-900 font-medium flex items-center relative z-10 mb-1">
            <Phone size={16} className="mr-2 text-green-600" />
            {crop.contact}
          </p>
          <p className="text-sm text-gray-600 relative z-10">
            Contact the farmer directly for bulk orders or specific inquiries
          </p>
        </div>
      )}
    </div>
  );
};

export default CropDetails;

import React from "react";
import { Star, ShieldCheck, Award, Tag } from "lucide-react";

const CropDetails = ({ crop }) => {
  // Format price if it's a string with currency symbol
  const formattedPrice =
    typeof crop.price === "string" ? crop.price : `₹${crop.price}`;

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-start justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {crop.variety}
            <span className="block text-sm font-medium text-gray-500 mt-1">
              {crop.type}
            </span>
          </h1>
          <div className="bg-green-50 px-3 py-1 rounded-full">
            <span className="text-green-800 font-semibold">{crop.grade}</span>
          </div>
        </div>

        <div className="flex items-center mt-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={`${
                  i < Math.floor(crop.rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">
            {crop.rating.toFixed(1)} rating
          </span>
        </div>
      </div>

      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-baseline">
          <p className="text-3xl font-bold text-gray-900">{formattedPrice}</p>
          <span className="ml-2 text-sm text-gray-500">{crop.priceUnit}</span>
        </div>

        {crop.quantity && (
          <p className="text-sm text-gray-600 mt-1">
            Available: {crop.quantity} {crop.unit}
          </p>
        )}
      </div>

      {crop.certifications.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {crop.certifications.map((cert) => (
            <span
              key={cert}
              className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
            >
              <ShieldCheck size={12} className="mr-1" />
              {cert}
            </span>
          ))}
        </div>
      )}

      <div className="text-sm text-gray-700 leading-relaxed line-clamp-4">
        {crop.description}
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 border-t border-gray-200 pt-4">
        <div className="flex items-start">
          <Tag size={16} className="mr-2 mt-1 text-gray-400" />
          <div>
            <p className="font-medium">Location</p>
            <p>{crop.location}</p>
          </div>
        </div>
        <div className="flex items-start">
          <Award size={16} className="mr-2 mt-1 text-gray-400" />
          <div>
            <p className="font-medium">Quality</p>
            <p>{crop.grade} Grade</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropDetails;

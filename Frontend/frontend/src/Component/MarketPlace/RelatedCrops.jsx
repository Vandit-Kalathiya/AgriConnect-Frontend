import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

const RelatedCrops = ({ cropType, currentCropId }) => {
  const [relatedCrops, setRelatedCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for related crops
  const mockRelatedCrops = [
    {
      id: "crop1",
      type: "Tomato",
      variety: "Roma Tomato",
      price: "₹45.00",
      unit: "kg",
      image: "/api/placeholder/200/200",
      location: "Bangalore",
      grade: "A",
    },
    {
      id: "crop2",
      type: "Tomato",
      variety: "Cherry Tomato",
      price: "₹65.00",
      unit: "kg",
      image: "/api/placeholder/200/200",
      location: "Mysore",
      grade: "A+",
    },
    {
      id: "crop3",
      type: "Tomato",
      variety: "Beef Tomato",
      price: "₹55.00",
      unit: "kg",
      image: "/api/placeholder/200/200",
      location: "Coimbatore",
      grade: "A",
    },
    {
      id: "crop4",
      type: "Tomato",
      variety: "Heirloom Tomato",
      price: "₹75.00",
      unit: "kg",
      image: "/api/placeholder/200/200",
      location: "Kochi",
      grade: "Premium",
    },
  ];

  useEffect(() => {
    // Simulate fetching related crops
    setLoading(true);

    // In a real application, you would fetch from API
    // For now, use mock data filtered to exclude current crop
    setTimeout(() => {
      const filtered = mockRelatedCrops.filter(
        (crop) => crop.id !== currentCropId
      );
      setRelatedCrops(filtered);
      setLoading(false);
    }, 500);
  }, [cropType, currentCropId]);

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Related Products
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse"
            >
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (relatedCrops.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Similar Products</h2>
        <a
          href="#"
          className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center"
        >
          View all
          <ArrowRight size={16} className="ml-1" />
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {relatedCrops.map((crop) => (
          <div
            key={crop.id}
            className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="relative">
              <img
                src={crop.image}
                alt={crop.variety}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-medium">
                {crop.grade}
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-medium text-gray-900">{crop.variety}</h3>
              <p className="text-sm text-gray-500">{crop.type}</p>

              <div className="mt-2 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">{crop.price}</p>
                  <p className="text-xs text-gray-500">per {crop.unit}</p>
                </div>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                  {crop.location}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedCrops;

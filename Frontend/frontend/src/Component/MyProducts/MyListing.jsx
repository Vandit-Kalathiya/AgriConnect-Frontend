import React from "react";
import CropCard from "./CropCard";

const crops = [
  {
    id: 1,
    images: [
      "https://via.placeholder.com/600x400?text=Gala+Apples+1",
      "https://via.placeholder.com/600x400?text=Gala+Apples+2",
      "https://via.placeholder.com/600x400?text=Gala+Apples+3",
    ],
    type: "Apples",
    variety: "Gala",
    grade: "USDA Grade 1",
    certifications: ["Organic"],
    quantity: 500,
    unit: "kg",
    location: "California, USA",
    harvestDate: "2025-02-01",
    availabilityDate: "2025-02-10",
    shelfLife: 14,
    price: "$2.50",
    priceUnit: "per kg",
    description:
      "Sweet, crisp apples perfect for snacking or baking. Grown sustainably in the sunny orchards of California, these Gala apples are hand-picked at peak ripeness for maximum flavor.",
    contact: "farmer.john@example.com",
    rating: 4.5,
  },
  {
    id: 2,
    images: [
      "https://via.placeholder.com/600x400?text=Yellow+Corn+1",
      "https://via.placeholder.com/600x400?text=Yellow+Corn+2",
    ],
    type: "Corn",
    variety: "Yellow",
    grade: "USDA Grade 2",
    certifications: [],
    quantity: 1000,
    unit: "bushels",
    location: "Iowa, USA",
    harvestDate: "2025-01-15",
    availabilityDate: "2025-02-20",
    shelfLife: 30,
    price: "$0.80",
    priceUnit: "per bushel",
    description:
      "High-quality yellow corn ideal for feed or cooking. Harvested from the fertile fields of Iowa, this corn is a staple for both livestock and culinary uses.",
    contact: "cornfarm@example.com",
    rating: 4.2,
  },
  {
    id: 3,
    images: [
      "https://via.placeholder.com/600x400?text=Organic+Wheat+1",
      "https://via.placeholder.com/600x400?text=Organic+Wheat+2",
      "https://via.placeholder.com/600x400?text=Organic+Wheat+3",
    ],
    type: "Wheat",
    variety: "Hard Red Winter",
    grade: "USDA Grade 1",
    certifications: ["Organic", "Non-GMO"],
    quantity: 750,
    unit: "kg",
    location: "Kansas, USA",
    harvestDate: "2025-01-25",
    availabilityDate: "2025-02-15",
    shelfLife: 60,
    price: "$1.20",
    priceUnit: "per kg",
    description:
      "Premium hard red winter wheat for artisan bread. Grown organically in Kansas, this wheat offers exceptional quality for milling and baking enthusiasts.",
    contact: "wheatfield@example.com",
    rating: 4.8,
  },
];

export const MyListing = () => {
  return (
    <div className="bg-grady-50 py-6 md:py-12 px-4 md:px-6 lg:px-8 ml-0 md:ml-20 mt-16 md:mt-20 min-h-screen">
      <div className="max-w-full md:max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 md:mb-10 text-center bg-clip-text drop-shadow-md">
          My Crop Listings
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {crops.map((crop) => (
            <CropCard key={crop.id} crop={crop} />
          ))}
        </div>
        {crops.length === 0 && (
          <p className="text-center text-gray-600 text-md md:text-lg mt-6 md:mt-8 italic">
            No listings available. Add a new crop listing to get started!
          </p>
        )}
      </div>
    </div>
  );
};

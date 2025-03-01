import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const CropPrice = ({ crop, price, change, up }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md flex flex-col items-center hover:shadow-lg transition">
      <h3 className="text-lg font-semibold">{crop}</h3>
      <p className="text-xl font-bold">{price}</p>
      <div
        className={`flex items-center gap-1 ${
          up ? "text-green-600" : "text-red-500"
        }`}
      >
        {up ? <FaArrowUp /> : <FaArrowDown />}
        <span className="font-medium">{change}</span>
      </div>
    </div>
  );
};

export default CropPrice;

import React from "react";
import { FaSpinner } from "react-icons/fa";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <FaSpinner className="animate-spin text-4xl text-green-600" />
    </div>
  );
};

export default Loader;

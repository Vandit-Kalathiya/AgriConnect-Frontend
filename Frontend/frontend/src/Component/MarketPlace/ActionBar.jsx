import React, { useState } from "react";
import TermsAndConditionsModal from "../TermsAndConditions/TermsAndConditionsModal";
import {CropContractAgreement} from "../CropContractAgreement/CropContractAgreement";

const ActionBar = ({ crop }) => {
  const [quantity, setQuantity] = useState(1);
  const [showTerms, setShowTerms] = useState(false);
  const [showContract, setShowContract] = useState(false);

  const handleQuantityChange = (e) => {
    setQuantity(
      Math.max(1, Math.min(crop.quantity, parseInt(e.target.value) || 1))
    );
  };

  const handleBuyNowClick = () => {
    setShowTerms(true);
  };

  const handleCloseTerms = () => {
    setShowTerms(false);
  };

  const handleAcceptTerms = () => {
    setShowTerms(false);
    setShowContract(true);
  };

  const handleContractClose = () => {
    setShowContract(false);
  };

  return (
    <>
      <div className="fixed bottom-0 left-52 right-0 bg-white shadow-lg p-4 max-w-6xl mx-auto mt-8 flex items-center gap-4">
        {/* <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Qty:</label>
          <input
            type="number"
            min="1"
            max={crop.quantity}
            value={quantity}
            onChange={handleQuantityChange}
            className="w-20 p-1 border rounded-md text-center"
          />
        </div> */}
        <button
          className="flex-1 bg-jewel-600 text-white py-2 rounded-md hover:bg-jewel-800 transition-colors"
          onClick={handleBuyNowClick}
        >
          Buy Now
        </button>
        <button className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition-colors">
          Contact Farmer
        </button>
      </div>

      {/* Terms and Conditions Modal */}
      <TermsAndConditionsModal
        isOpen={showTerms}
        onClose={handleCloseTerms}
        onAccept={handleAcceptTerms}
      />

      {/* Contract Agreement */}
      {showContract && (
        <div className="fixed inset-0 bg-opacity-25 z-50 backdrop-blur-sm overflow-y-auto">
          <div className="relative min-h-screen">
            <div className="absolute top-4 right-4 z-51">
              <button
                onClick={handleContractClose}
                className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <CropContractAgreement />
          </div>
        </div>
      )}
    </>
  );
};

export default ActionBar;

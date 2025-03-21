import React from "react";
import { FaSignature, FaCamera } from "react-icons/fa";

const SignatureSection = ({ editMode, signatureUrl, onSignatureUpload }) => (
  <div className="flex flex-col items-center">
    <label className="text-sm md:text-md font-medium text-green-700 mb-1 md:mb-2 flex items-center">
      <FaSignature className="mr-2" /> Signature
    </label>
    <div className="relative">
      {signatureUrl ? (
        <img
          src={signatureUrl}
          alt="Signature"
          className="w-40 h-20 md:w-48 md:h-24 object-contain border border-gray-300 rounded-lg shadow-sm"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/150?text=No+Signature";
          }}
        />
      ) : (
        <div className="w-40 h-20 md:w-48 md:h-24 flex items-center justify-center border border-dashed border-gray-300 rounded-lg text-gray-500">
          No signature uploaded
        </div>
      )}
      {editMode && (
        <label className="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full cursor-pointer hover:bg-green-600 transition-all">
          <FaCamera />
          <input
            type="file"
            accept="image/*"
            onChange={onSignatureUpload}
            className="hidden"
          />
        </label>
      )}
    </div>
  </div>
);

export default SignatureSection;

import React from "react";
import { FaSignature, FaCamera } from "react-icons/fa";

const SIGNATURE_FALLBACK =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='80'><rect width='100%25' height='100%25' fill='%23f3f4f6'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%236b7280' font-family='Arial' font-size='14'>No Signature</text></svg>";

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
            e.currentTarget.onerror = null;
            e.currentTarget.src = SIGNATURE_FALLBACK;
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

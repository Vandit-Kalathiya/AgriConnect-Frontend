import React from "react";

const Signatures = ({
  userType,
  farmerSignature,
  setFarmerSignature,
  buyerSignature,
  setBuyerSignature,
  handleImageUpload,
}) => {
  const currentDate = new Date().toLocaleDateString();
  const userRole = userType;

  const canEditSignature = (role) => userRole === role;

  const renderSignatureBox = (role, signature, setSignature) => {
    const isEditable = canEditSignature(role);
    const roleLabel = role === "farmer" ? "Farmer" : "Buyer";

    return (
      <div
        className={`space-y-4 p-6 rounded-lg border ${
          isEditable ? "bg-white" : "bg-gray-50"
        } ${
          isEditable ? "border-jewel-200" : "border-gray-200"
        } transition-all hover:shadow-md`}
      >
        <div className="text-center">
          <div
            className={`font-semibold text-lg ${
              isEditable ? "text-jewel-700" : "text-gray-700"
            } mb-1`}
          >
            {roleLabel} Signature
          </div>
          <div className="text-sm text-gray-500">Date: {currentDate}</div>
        </div>

        {signature ? (
          <div className="relative group">
            <img
              src={URL.createObjectURL(signature)}
              alt={`${roleLabel} Signature`}
              className="w-full h-24 object-contain mx-auto border p-2 bg-white rounded-md"
            />
            {isEditable && (
              <button
                onClick={() => setSignature(null)}
                className="absolute top-2 right-2 bg-red-100 text-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove signature"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        ) : (
          <div
            className={`w-full h-24 mx-auto border border-dashed ${
              isEditable ? "border-jewel-300" : "border-gray-300"
            } bg-white flex flex-col items-center justify-center rounded-md ${
              isEditable ? "text-jewel-400" : "text-gray-400"
            }`}
          >
            {isEditable ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-jewel-300 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
                <span className="text-sm">Your Signature Required</span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-300 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span className="text-sm">Awaiting {roleLabel} Signature</span>
              </>
            )}
          </div>
        )}

        {isEditable && !signature && (
          <div className="flex justify-center mt-4">
            <label className="cursor-pointer flex items-center justify-center px-4 py-2 bg-jewel-600 text-white rounded-md hover:bg-jewel-700 transition-colors text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Upload Signature
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, setSignature)}
              />
            </label>
          </div>
        )}

        {isEditable && signature && (
          <div className="text-center text-xs text-jewel-600 font-medium">
            Your signature has been added
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 p-8">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Contract Signatures
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Both parties must sign to finalize this contract. You can only sign in
          your designated area.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {renderSignatureBox("farmer", farmerSignature, setFarmerSignature)}
        {renderSignatureBox("buyer", buyerSignature, setBuyerSignature)}
      </div>

      <div className="mt-8 p-4 bg-gray-50 border border-gray-100 rounded-lg text-center text-sm text-gray-600">
        <div className="flex items-center justify-center mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-jewel-500 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-medium">Legal Agreement</span>
        </div>
        By uploading your signature, you confirm that you have read and agree to
        all terms and conditions outlined in this contract. This digital
        signature carries the same legal weight as a physical signature.
      </div>
    </div>
  );
};

export default Signatures;

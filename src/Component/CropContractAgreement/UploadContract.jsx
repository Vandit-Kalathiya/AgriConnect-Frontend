import React from "react";

const UploadContract = ({
  contractFile,
  setContractFile,
  handleContractUpload,
}) => {
  return (
    <div>
      <div className="flex flex-col space-y-2">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setContractFile(e.target.files[0])}
          className="w-full p-2 border rounded-lg"
        />
        <button
          onClick={handleContractUpload}
          disabled={!contractFile}
          className={`px-4 py-2 rounded text-white ${
            !contractFile
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-jewel-600 hover:bg-jewel-700"
          }`}
        >
          Upload Contract
        </button>
      </div>
    </div>
  );
};

export default UploadContract;

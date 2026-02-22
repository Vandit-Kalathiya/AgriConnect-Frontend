import React from "react";
import { FileText, Download } from "lucide-react";

const ContractUpload = ({ contractFile, setContractFile }) => {
  const handleDownloadContract = () => {
    if (!contractFile) {
      alert("No contract file uploaded yet!");
      return;
    }

    // Trigger download of the uploaded file
    const url = window.URL.createObjectURL(contractFile);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Contract_agreement.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    alert("Downloading contract PDF...");
  };

  return (
    <div className="bg-emerald-50 p-4 rounded-md border border-emerald-200">
      <label className="block font-medium mb-2 text-emerald-800">
        Upload Agreement File
      </label>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setContractFile(e.target.files[0])}
        className="w-full p-2 border border-gray-300 rounded-md text-gray-700"
      />
      {contractFile && (
        <div className="mt-2 flex items-center gap-2 text-emerald-600">
          <FileText className="h-4 w-4" />
          <span>{contractFile.name}</span>
          <button
            onClick={handleDownloadContract}
            className="ml-2 text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
        </div>
      )}
      <p className="text-xs text-gray-500 mt-1">
        Please upload the signed contract agreement (PDF format only)
      </p>
    </div>
  );
};

export default ContractUpload;

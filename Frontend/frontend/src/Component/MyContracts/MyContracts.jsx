import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaFileContract,
  FaTable,
  FaTh,
  FaDownload,
  FaSort,
  FaEye,
} from "react-icons/fa";
import { getCurrentUser } from "../../../helper";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader"

const Contracts = () => {
  const [viewMode, setViewMode] = useState("table");
  const [sortField, setSortField] = useState("createDate");
  const [sortOrder, setSortOrder] = useState("desc"); // Default to newest first
  const [filterStatus, setFilterStatus] = useState("All");
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      if (!user) {
        setLoading(false);
        return;
      }
      const response = await axios.get(
        `http://localhost:2526/user/agreements/${user.uniqueHexAddress}`,
        { withCredentials: true }
      );
      console.log("Contracts: ", response.data);
      setContracts(response.data);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      toast.error("Failed to load contracts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const sortContracts = (data) => {
    return [...data].sort((a, b) => {
      if (sortField === "createDate") {
        const dateA = new Date(a[sortField]);
        const dateB = new Date(b[sortField]);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }
      const fieldA = a[sortField];
      const fieldB = b[sortField];
      if (["size"].includes(sortField)) {
        return sortOrder === "asc" ? fieldA - fieldB : fieldB - fieldA;
      }
      return sortOrder === "asc"
        ? String(fieldA).localeCompare(String(fieldB))
        : String(fieldB).localeCompare(String(fieldA));
    });
  };

  const filterContracts = (data) => {
    return data.filter((contract) => {
      // Apply status filter
      const statusMatch =
        filterStatus === "All" ? true : contract.status === filterStatus;

      // Apply search filter
      const searchMatch =
        searchTerm === ""
          ? true
          : Object.values(contract).some((value) =>
              String(value).toLowerCase().includes(searchTerm.toLowerCase())
            );

      return statusMatch && searchMatch;
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "N/A";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Byte";
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
  };

  const truncateAddress = (address) => {
    if (!address) return "N/A";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  const sortedAndFilteredContracts = filterContracts(sortContracts(contracts));

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder(sortField === field && sortOrder === "asc" ? "desc" : "asc");
  };

  const handleDownload = async (downloadUrl, fileName) => {
    try {
      toast.info("Preparing download...");
      const response = await axios.get(downloadUrl, {
        responseType: "blob",
        withCredentials: true,
      });

      // Create and download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName || "agreement.pdf");
      document.body.appendChild(link);
      link.click();

      // Clean up
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }, 100);

      toast.success("Download successful!");
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Download failed. Please try again.");
    }
  };

  const openContractDetails = (contract) => {
    setSelectedContract(contract);
    setShowModal(true);
  };

  const ContractDetailModal = ({ contract, onClose }) => {
    if (!contract) return null;

    return (
      <div className="fixed inset-0 backdrop-blur-sm bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-r from-jewel-600 to-jewel-800 px-6 py-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center">
                <FaFileContract className="mr-2" />
                Contract Details
              </h2>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200"
              >
                <svg
                  className="w-6 h-6"
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
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  General Information
                </h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-semibold">ID:</span> {contract.id}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold break-words">
                      File Name:
                    </span>{" "}
                    {contract.fileName}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">File Size:</span>{" "}
                    {formatFileSize(contract.size)}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Created:</span>{" "}
                    {formatDate(contract.createDate)}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Blockchain Information
                </h3>
                <div className="space-y-2">
                  <p className="text-sm break-words">
                    <span className="font-semibold">Buyer Address:</span>{" "}
                    {contract.buyerAddress}
                  </p>
                  <p className="text-sm break-words">
                    <span className="font-semibold">Farmer Address:</span>{" "}
                    {contract.farmerAddress}
                  </p>
                  <p className="text-sm break-words">
                    <span className="font-semibold">Transaction Hash:</span>{" "}
                    {contract.transactionHash}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={() =>
                  handleDownload(contract.downloadUrl, contract.fileName)
                }
                className="flex items-center justify-center px-6 py-3 bg-jewel-600 text-white rounded-md hover:bg-jewel-700 transition-colors duration-300 shadow-md"
              >
                <FaDownload className="mr-2" />
                Download Contract
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 py-8 md:py-12 px-4 md:px-6 lg:px-8 ml-0 md:ml-20 md:mt-20 min-h-screen">
      <div className="max-w-full md:max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FaFileContract className="text-3xl text-jewel-600" />
            <h1 className="text-3xl font-bold text-gray-900">My Contracts</h1>
          </div>
          <p className="text-gray-600 text-center max-w-2xl">
            Manage and access all your legal agreements in one secure location
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div className="w-full md:w-auto flex items-center space-x-3">
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded-md ${
                    viewMode === "table"
                      ? "bg-blue-100 text-jewel-600"
                      : "bg-gray-200 text-gray-600"
                  } hover:bg-blue-200 transition-colors`}
                  title="Table View"
                >
                  <FaTable className="text-lg" />
                </button>
                <button
                  onClick={() => setViewMode("cards")}
                  className={`p-2 rounded-md ${
                    viewMode === "cards"
                      ? "bg-blue-100 text-jewel-600"
                      : "bg-gray-200 text-gray-600"
                  } hover:bg-blue-200 transition-colors`}
                  title="Card View"
                >
                  <FaTh className="text-lg" />
                </button>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="p-2 text-sm border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:ring-jewel-500 focus:border-jewel-500"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Expired">Expired</option>
              </select>
            </div>

            <div className="w-full md:w-64">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search contracts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 pl-8 text-sm border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:ring-jewel-500 focus:border-jewel-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            {loading
              ? "Loading contracts..."
              : `Showing ${sortedAndFilteredContracts.length} of ${contracts.length} contracts`}
          </div>
        </div>

        {/* Contracts Display */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden min-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-64">
               <Loader />
            </div>
          ) : sortedAndFilteredContracts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 p-6 text-center">
              <div className="text-gray-400 mb-2">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-700">
                No contracts found
              </h3>
              <p className="text-gray-500 mt-1">
                {searchTerm
                  ? "Try adjusting your search or filters"
                  : "Your contracts will appear here once created"}
              </p>
            </div>
          ) : viewMode === "table" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-gray-100 text-gray-700">
                    {[
                      { label: "ID", field: "id" },
                      { label: "Buyer", field: "buyerAddress" },
                      { label: "Farmer", field: "farmerAddress" },
                      { label: "File Name", field: "fileName" },
                      { label: "Size", field: "size" },
                      { label: "Date", field: "createDate" },
                      { label: "Actions", field: "actions" },
                    ].map((col) => (
                      <th
                        key={col.field}
                        onClick={() =>
                          col.field !== "actions" && handleSort(col.field)
                        }
                        className={`py-3 px-4 font-semibold ${
                          col.field !== "actions"
                            ? "cursor-pointer hover:bg-blue-50"
                            : ""
                        }`}
                      >
                        <div className="flex items-center">
                          {col.label}
                          {col.field !== "actions" && (
                            <FaSort
                              className={`ml-1 text-xs ${
                                sortField === col.field
                                  ? "text-jewel-600"
                                  : "text-gray-400"
                              }`}
                            />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedAndFilteredContracts.map((contract) => (
                    <tr
                      key={contract.id}
                      className="border-b border-gray-200 hover:bg-blue-50 transition-colors duration-150"
                    >
                      <td className="py-3 px-4 text-gray-800 truncate max-w-[100px]">
                        {contract.id}
                      </td>
                      <td className="py-3 px-4 text-gray-600 truncate max-w-[100px]">
                        {truncateAddress(contract.buyerAddress)}
                      </td>
                      <td className="py-3 px-4 text-gray-600 truncate max-w-[100px]">
                        {truncateAddress(contract.farmerAddress)}
                      </td>
                      <td className="py-3 px-4 text-gray-800 truncate max-w-[200px]">
                        {contract.fileName}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {formatFileSize(contract.size)}
                      </td>
                      <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                        {formatDate(contract.createDate)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openContractDetails(contract)}
                            className="p-2 text-jewel-600 hover:bg-blue-100 rounded-full transition-colors"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() =>
                              handleDownload(
                                contract.downloadUrl,
                                contract.fileName
                              )
                            }
                            className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors"
                            title="Download Contract"
                          >
                            <FaDownload />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {sortedAndFilteredContracts.map((contract) => (
                <div
                  key={contract.id}
                  className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="bg-gradient-to-r from-jewel-600 to-jewel-700 py-3 px-4">
                    <h3 className="text-lg font-semibold text-white truncate">
                      {contract.fileName || "Unnamed Contract"}
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">ID:</span> {contract.id}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Buyer:</span>{" "}
                        {truncateAddress(contract.buyerAddress)}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Farmer:</span>{" "}
                        {truncateAddress(contract.farmerAddress)}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Size:</span>{" "}
                        {formatFileSize(contract.size)}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Date:</span>{" "}
                        {formatDate(contract.createDate)}
                      </p>
                    </div>
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={() => openContractDetails(contract)}
                        className="px-3 py-2 text-sm font-medium text-jewel-600 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
                      >
                        <FaEye className="inline mr-1" /> View
                      </button>
                      <button
                        onClick={() =>
                          handleDownload(
                            contract.downloadUrl,
                            contract.fileName
                          )
                        }
                        className="px-3 py-2 text-sm font-medium text-white bg-jewel-600 rounded-md hover:bg-jewel-700 transition-colors"
                      >
                        <FaDownload className="inline mr-1" /> Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <ContractDetailModal
          contract={selectedContract}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Contracts;

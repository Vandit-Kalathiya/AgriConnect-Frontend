import React, { useState } from "react";
import { FaFileContract, FaTable, FaTh } from "react-icons/fa";

const Contracts = () => {
  const [viewMode, setViewMode] = useState("table");
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterStatus, setFilterStatus] = useState("All");

  const contractsData = [
    {
      id: "CON001",
      buyer: "FarmFresh Co.",
      crop: "Gala Apples",
      quantity: 200,
      unit: "kg",
      pricePerUnit: 2.5,
      totalAmount: 500.0,
      startDate: "2025-02-01",
      endDate: "2025-03-01",
      status: "Active",
    },
    {
      id: "CON002",
      buyer: "Jane Smith",
      crop: "Yellow Corn",
      quantity: 500,
      unit: "bushels",
      pricePerUnit: 0.8,
      totalAmount: 400.0,
      startDate: "2025-01-15",
      endDate: "2025-02-28",
      status: "Pending",
    },
    {
      id: "CON003",
      buyer: "John Doe",
      crop: "Organic Wheat",
      quantity: 300,
      unit: "kg",
      pricePerUnit: 1.2,
      totalAmount: 360.0,
      startDate: "2025-01-25",
      endDate: "2025-03-15",
      status: "Completed",
    },
    {
      id: "CON004",
      buyer: "Mike Johnson",
      crop: "Gala Apples",
      quantity: 150,
      unit: "kg",
      pricePerUnit: 2.5,
      totalAmount: 375.0,
      startDate: "2025-02-10",
      endDate: "2025-03-10",
      status: "Expired",
    },
    {
      id: "CON004",
      buyer: "Mike Johnson",
      crop: "Gala Apples",
      quantity: 150,
      unit: "kg",
      pricePerUnit: 2.5,
      totalAmount: 375.0,
      startDate: "2025-02-10",
      endDate: "2025-03-10",
      status: "Expired",
    },
    {
      id: "CON004",
      buyer: "Mike Johnson",
      crop: "Gala Apples",
      quantity: 150,
      unit: "kg",
      pricePerUnit: 2.5,
      totalAmount: 375.0,
      startDate: "2025-02-10",
      endDate: "2025-03-10",
      status: "Expired",
    },
    {
      id: "CON004",
      buyer: "Mike Johnson",
      crop: "Gala Apples",
      quantity: 150,
      unit: "kg",
      pricePerUnit: 2.5,
      totalAmount: 375.0,
      startDate: "2025-02-10",
      endDate: "2025-03-10",
      status: "Expired",
    },
    {
      id: "CON004",
      buyer: "Mike Johnson",
      crop: "Gala Apples",
      quantity: 150,
      unit: "kg",
      pricePerUnit: 2.5,
      totalAmount: 375.0,
      startDate: "2025-02-10",
      endDate: "2025-03-10",
      status: "Expired",
    },
    {
      id: "CON004",
      buyer: "Mike Johnson",
      crop: "Gala Apples",
      quantity: 150,
      unit: "kg",
      pricePerUnit: 2.5,
      totalAmount: 375.0,
      startDate: "2025-02-10",
      endDate: "2025-03-10",
      status: "Expired",
    },
    {
      id: "CON004",
      buyer: "Mike Johnson",
      crop: "Gala Apples",
      quantity: 150,
      unit: "kg",
      pricePerUnit: 2.5,
      totalAmount: 375.0,
      startDate: "2025-02-10",
      endDate: "2025-03-10",
      status: "Expired",
    },
    {
      id: "CON004",
      buyer: "Mike Johnson",
      crop: "Gala Apples",
      quantity: 150,
      unit: "kg",
      pricePerUnit: 2.5,
      totalAmount: 375.0,
      startDate: "2025-02-10",
      endDate: "2025-03-10",
      status: "Expired",
    },
    {
      id: "CON004",
      buyer: "Mike Johnson",
      crop: "Gala Apples",
      quantity: 150,
      unit: "kg",
      pricePerUnit: 2.5,
      totalAmount: 375.0,
      startDate: "2025-02-10",
      endDate: "2025-03-10",
      status: "Expired",
    },
    {
      id: "CON004",
      buyer: "Mike Johnson",
      crop: "Gala Apples",
      quantity: 150,
      unit: "kg",
      pricePerUnit: 2.5,
      totalAmount: 375.0,
      startDate: "2025-02-10",
      endDate: "2025-03-10",
      status: "Expired",
    },
    {
      id: "CON004",
      buyer: "Mike Johnson",
      crop: "Gala Apples",
      quantity: 150,
      unit: "kg",
      pricePerUnit: 2.5,
      totalAmount: 375.0,
      startDate: "2025-02-10",
      endDate: "2025-03-10",
      status: "Expired",
    },
  ];

  const sortContracts = (data) => {
    return [...data].sort((a, b) => {
      if (sortField === "startDate" || sortField === "endDate") {
        const dateA = new Date(a[sortField]);
        const dateB = new Date(b[sortField]);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }
      const fieldA = a[sortField];
      const fieldB = b[sortField];
      if (["totalAmount", "pricePerUnit", "quantity"].includes(sortField)) {
        return sortOrder === "asc" ? fieldA - fieldB : fieldB - fieldA;
      }
      return sortOrder === "asc"
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA);
    });
  };

  const filterContracts = (data) => {
    return filterStatus === "All"
      ? data
      : data.filter((contract) => contract.status === filterStatus);
  };

  const sortedAndFilteredContracts = sortContracts(
    filterContracts(contractsData)
  );

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder(sortField === field && sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="bg-gray-50 py-6 md:py-12 px-4 md:px-6 lg:px-8 ml-0 md:ml-20 md:mt-20 bg-gradient-to-br from-green-50 to-gray-50 min-h-screen">
      <div className="max-w-full md:max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-center mb-4 md:mb-8">
          <div className="flex items-center gap-2 md:gap-3">
            <FaFileContract className="text-2xl md:text-3xl text-gray-900" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              My Contracts
            </h1>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 md:gap-6 mb-4 md:mb-6">
          <div className="flex gap-2 md:gap-4">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-md ${
                viewMode === "table"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-200 text-gray-600"
              } hover:bg-blue-200`}
            >
              <FaTable className="text-md md:text-lg" />
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`p-2 rounded-md ${
                viewMode === "cards"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-200 text-gray-600"
              } hover:bg-blue-200`}
            >
              <FaTh className="text-md md:text-lg" />
            </button>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-auto p-2 text-sm md:text-md border-gray-300 rounded-md shadow-sm bg-white text-gray-900"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Expired">Expired</option>
          </select>
        </div>

        {/* Contracts Display */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 min-h-fit">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2 md:mb-4">
            Contract Details
          </h2>

          {viewMode === "table" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm md:text-md">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600">
                    {[
                      { label: "ID", field: "id" },
                      { label: "Buyer", field: "buyer" },
                      { label: "Crop", field: "crop" },
                      { label: "Qty", field: "quantity" },
                      { label: "$/Unit", field: "pricePerUnit" },
                      { label: "Total", field: "totalAmount" },
                      { label: "Date", field: "Date" },
                      // { label: "End", field: "endDate" },
                      { label: "Status", field: "status" },
                    ].map((col) => (
                      <th
                        key={col.field}
                        onClick={() => handleSort(col.field)}
                        className="py-2 md:py-3 px-2 md:px-4 font-medium cursor-pointer hover:text-gray-800 whitespace-nowrap"
                      >
                        {col.label}{" "}
                        {sortField === col.field &&
                          (sortOrder === "asc" ? "↑" : "↓")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedAndFilteredContracts.map((contract) => (
                    <tr
                      key={contract.id}
                      className="border-b border-gray-200 hover:bg-gray-50 group relative"
                    >
                      <td className="py-2 md:py-3 px-2 md:px-4 text-gray-800">
                        {contract.id}
                      </td>
                      <td className="py-2 md:py-3 px-2 md:px-4 text-gray-600 truncate max-w-[100px]">
                        {contract.buyer}
                      </td>
                      <td className="py-2 md:py-3 px-2 md:px-4 text-gray-600 truncate max-w-[100px]">
                        {contract.crop}
                      </td>
                      <td className="py-2 md:py-3 px-2 md:px-4 text-gray-600">
                        {contract.quantity.toLocaleString("en-US")}{" "}
                        {contract.unit}
                      </td>
                      <td className="py-2 md:py-3 px-2 md:px-4 text-gray-800">
                        $
                        {contract.pricePerUnit.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="py-2 md:py-3 px-2 md:px-4 text-gray-800">
                        $
                        {contract.totalAmount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="py-2 md:py-3 px-2 md:px-4 text-gray-600 whitespace-nowrap">
                        {contract.startDate}
                      </td>
                      {/* <td className="py-2 md:py-3 px-2 md:px-4 text-gray-600 whitespace-nowrap">
                        {contract.endDate}
                      </td> */}
                      <td className="py-2 md:py-3 px-2 md:px-4">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                            contract.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : contract.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : contract.status === "Completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {contract.status}
                        </span>
                        <div className="absolute left-0 top-full mt-1 hidden group-hover:block bg-gray-800 text-white text-xs p-2 rounded-md shadow-lg z-10 max-w-xs md:max-w-sm">
                          Duration: {contract.startDate} to {contract.endDate}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {sortedAndFilteredContracts.map((contract) => (
                <div
                  key={contract.id}
                  className="bg-white rounded-lg shadow-md p-3 md:p-4 hover:shadow-lg transition-shadow duration-300 border border-gray-200"
                >
                  <h3 className="text-md md:text-lg font-semibold text-gray-800">
                    {contract.id}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 mt-1">
                    <strong>Buyer:</strong> {contract.buyer}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600">
                    <strong>Crop:</strong> {contract.crop}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600">
                    <strong>Qty:</strong>{" "}
                    {contract.quantity.toLocaleString("en-US")} {contract.unit}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600">
                    <strong>$/Unit:</strong> $
                    {contract.pricePerUnit.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600">
                    <strong>Total:</strong> $
                    {contract.totalAmount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600">
                    <strong>Start:</strong> {contract.startDate}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600">
                    <strong>End:</strong> {contract.endDate}
                  </p>
                  <p className="mt-1 md:mt-2">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        contract.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : contract.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : contract.status === "Completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {contract.status}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contracts;

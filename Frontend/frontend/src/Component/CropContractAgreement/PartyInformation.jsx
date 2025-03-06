import React from "react";
import leafImg from '../../assets/leaf.png'

const PartyInformation = ({ formData, userType, setFormData }) => {
  return (
    <div className="space-y-6 max-w-2xl mx-auto bg-white p-6">
      <div className="flex flex-col items-center gap-y-2 pb-3">
        <div className="flex items-center gap-x-2">
          <img src={leafImg} width={30} alt="AgriConnect logo" />
          <h1 className="text-2xl font-bold text-snowy-mint-900">
            AgriConnect
          </h1>
        </div>
        <div className="bg-jewel-50 w-full text-center mb-2 font-poppins py-2 rounded-md text-snowy-mint-900 font-semibold">
          CROP CONTRACT AGREEMENT
        </div>
      </div>

      <div className="border-b pb-2 mb-4">
        <h2 className="text-lg font-semibold text-jewel-700 flex items-center gap-x-2">
          <span className="bg-jewel-100 h-6 w-6 flex items-center justify-center rounded-full text-sm">
            1
          </span>
          Parties Information
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div className="space-y-4">
          <h3 className="font-medium text-jewel-600 text-sm uppercase tracking-wider">
            Farmer/Supplier Details
          </h3>
          <div>
            <label className="block font-medium text-sm mb-1 text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
              value={formData.farmerInfo.farmerName}
              disabled={userType === "buyer"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  farmerInfo: {
                    ...formData.farmerInfo,
                    farmerName: e.target.value,
                  },
                })
              }
              placeholder="Enter farmer's name"
            />
          </div>
          <div>
            <label className="block font-medium mb-1 text-sm text-gray-700">
              Address
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
              value={formData.farmerInfo.farmerAddress}
              disabled={userType === "buyer"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  farmerInfo: {
                    ...formData.farmerInfo,
                    farmerAddress: e.target.value,
                  },
                })
              }
              placeholder="Enter farmer's address"
            />
          </div>
          <div>
            <label className="block font-medium mb-1 text-sm text-gray-700">
              Contact Number
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
              value={formData.farmerInfo.farmerContact}
              disabled={userType === "buyer"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  farmerInfo: {
                    ...formData.farmerInfo,
                    farmerContact: e.target.value,
                  },
                })
              }
              placeholder="Enter farmer's contact number"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-jewel-600 text-sm uppercase tracking-wider">
            Buyer Details
          </h3>
          <div>
            <label className="block font-medium mb-1 text-sm text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
              value={formData.buyerInfo.buyerName}
              disabled={userType === "farmer"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  buyerInfo: {
                    ...formData.buyerInfo,
                    buyerName: e.target.value,
                  },
                })
              }
              placeholder="Enter buyer's name"
            />
          </div>
          <div>
            <label className="block font-medium mb-1 text-sm text-gray-700">
              Address
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
              value={formData.buyerInfo.buyerAddress}
              disabled={userType === "farmer"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  buyerInfo: {
                    ...formData.buyerInfo,
                    buyerAddress: e.target.value,
                  },
                })
              }
              placeholder="Enter buyer's address"
            />
          </div>
          <div>
            <label className="block font-medium mb-1 text-sm text-gray-700">
              Contact Number
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg focus:ring focus:ring-jewel-300 focus:border-jewel-500 focus:outline-none transition-all duration-200"
              value={formData.buyerInfo.buyerContact}
              disabled={userType === "farmer"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  buyerInfo: {
                    ...formData.buyerInfo,
                    buyerContact: e.target.value,
                  },
                })
              }
              placeholder="Enter buyer's contact number"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartyInformation;

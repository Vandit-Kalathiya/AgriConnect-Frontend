import { useState } from "react";
import KisanMitraHistory from "./KisanMitraHistory";
import CropAdvisoryHistory from "./CropAdvisoryHistory";

const TAB_KISAN_MITRA = "kisan-mitra";
const TAB_CROP_ADVISORY = "crop-advisory";

const HistoryTabs = () => {
  const [activeTab, setActiveTab] = useState(TAB_KISAN_MITRA);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gray-50 pb-8 md:ml-14">
      <div className="mx-auto w-full max-w-5xl px-4 py-4 md:px-6 md:py-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">AI History</h1>
          <p className="text-sm text-gray-600">
            View your Kisan Mitra and Crop Advisory history in separate tabs.
          </p>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <button
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === TAB_KISAN_MITRA
                ? "bg-green-600 text-white"
                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab(TAB_KISAN_MITRA)}
          >
            Kisan Mitra
          </button>
          <button
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === TAB_CROP_ADVISORY
                ? "bg-green-600 text-white"
                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab(TAB_CROP_ADVISORY)}
          >
            Crop Advisory
          </button>
        </div>

        <div className={activeTab === TAB_KISAN_MITRA ? "block" : "hidden"}>
          <KisanMitraHistory />
        </div>
        <div className={activeTab === TAB_CROP_ADVISORY ? "block" : "hidden"}>
          <CropAdvisoryHistory />
        </div>
      </div>
    </div>
  );
};

export default HistoryTabs;

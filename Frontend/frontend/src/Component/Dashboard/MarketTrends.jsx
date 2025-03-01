import React from "react";
import CropPrice from "./CropPrice";

const MarketTrends = () => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold mb-4">📈 Market Trends</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <CropPrice crop="Wheat" price="$320" change="+5%" up />
        <CropPrice crop="Rice" price="$280" change="-2%" />
        <CropPrice crop="Corn" price="$350" change="+8%" up />
        <CropPrice crop="Soybean" price="$290" change="-3%" />
      </div>
    </div>
  );
};

export default MarketTrends;

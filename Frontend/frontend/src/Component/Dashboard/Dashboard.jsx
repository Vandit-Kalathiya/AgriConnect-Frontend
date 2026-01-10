import React from "react";
import WeatherForecast from "./WeatherForecast";
import StatCard from "./StatCard";
import AlertsPanel from "./AlertsPanel";
import TrendingCrops from "../MarketTrends/components/TrendingCrops";
import CurrentMonthHighlights from "../MarketTrends/components/CurrentMonthHighlights";

const Dashboard = () => {
  return (
    <main className="flex-1 p-6 lg:p-8 ml-0 lg:ml-20 mt-16 lg:mt-20 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-green-700">
          Welcome to AgriConnect
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            title="Total Crops Sold"
            value="1,230"
            icon="🌾"
            trend="+12%"
            trendUp
          />
          <StatCard
            title="Market Revenue"
            value="₹24,500"
            icon="💰"
            trend="+8%"
            trendUp
          />
          <StatCard
            title="Active Buyers"
            value="412"
            icon="👥"
            trend="-2%"
            trendUp={false}
          />
          <StatCard
            title="Pending Contracts"
            value="15"
            icon="📝"
            trend="+3%"
            trendUp
          />
        </div>

        <div className="space-y-4">
          <WeatherForecast />
          <AlertsPanel />
        </div>
      </div>
      <CurrentMonthHighlights />
      <TrendingCrops />
    </main>
  );
};

export default Dashboard;

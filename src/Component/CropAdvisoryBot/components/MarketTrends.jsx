import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Badge } from "./ui/Badge";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  Droplets,
  Sun,
  Calendar,
  Clock,
  Leaf,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  CloudRain,
} from "lucide-react";

const generateMarketData = (crop) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentMonth = new Date().getMonth();
  const startMonth = (currentMonth + 6) % 12;

  const currentPrice = crop.currentPrice || Math.floor(Math.random() * 50) + 50;
  const projectedPrice =
    crop.projectedPrice ||
    (crop.marketTrend === "rising"
      ? currentPrice * (1 + crop.marketPriceChange / 100)
      : crop.marketTrend === "stable"
      ? currentPrice * (1 + crop.marketPriceChange / 200)
      : currentPrice * (1 - Math.abs(crop.marketPriceChange) / 100));

  const trendFactor =
    projectedPrice > currentPrice
      ? Math.pow(projectedPrice / currentPrice, 1 / 6)
      : Math.pow(projectedPrice / currentPrice, 1 / 6);

  const priceData = [];
  let price = currentPrice;

  for (let i = 6; i > 0; i--) {
    const monthIndex = (startMonth - i + 12) % 12;
    const pastPrice = price / Math.pow(trendFactor, i);
    const randomFactor = 0.95 + Math.random() * 0.1;

    priceData.push({
      month: months[monthIndex],
      price: Math.round(pastPrice * randomFactor * 100) / 100,
      isProjected: false,
    });
  }

  priceData.push({
    month: months[currentMonth],
    price: currentPrice,
    isProjected: false,
  });

  price = currentPrice;
  for (let i = 1; i <= 5; i++) {
    const monthIndex = (currentMonth + i) % 12;
    price = price * trendFactor;
    const randomFactor = 0.98 + Math.random() * 0.04;

    priceData.push({
      month: months[monthIndex],
      price: Math.round(price * randomFactor * 100) / 100,
      isProjected: true,
    });
  }

  return priceData;
};

const calculateHarvestMonth = (crop) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentMonth = new Date().getMonth();

  const harvestTimeString = crop.harvestTime.replace(/[^0-9.-]/g, "");
  const harvestTimes = harvestTimeString.split("-").map(Number);
  const avgHarvestTime =
    harvestTimes.reduce((a, b) => a + b, 0) / harvestTimes.length;

  const harvestMonthIndex = (currentMonth + Math.round(avgHarvestTime)) % 12;

  return months[harvestMonthIndex];
};

const MarketTrends = ({ crop }) => {
  const marketData = React.useMemo(() => generateMarketData(crop), [crop]);

  const currentPrice = crop.currentPrice || marketData[6].price;
  const projectedPrice = crop.projectedPrice || marketData[11].price;
  const priceChange = ((projectedPrice - currentPrice) / currentPrice) * 100;

  const currentMonthName = marketData[6].month;
  const harvestMonth = calculateHarvestMonth(crop);

  const harvestMonthIndex = marketData.findIndex(
    (data) => data.month === harvestMonth
  );
  const priceAtHarvest =
    harvestMonthIndex !== -1
      ? marketData[harvestMonthIndex].price
      : marketData[marketData.length - 1].price;

  const marketFactors = [
    {
      factor: "Seasonal Demand",
      impact:
        crop.marketTrend === "rising"
          ? "High"
          : crop.marketTrend === "stable"
          ? "Moderate"
          : "Low",
    },
    {
      factor: "Export Potential",
      impact:
        crop.suitabilityScore > 75
          ? "High"
          : crop.suitabilityScore > 50
          ? "Moderate"
          : "Low",
    },
    { factor: "Storage Availability", impact: "Moderate" },
    {
      factor: "Government Policies",
      impact: crop.marketPriceChange > 5 ? "Favorable" : "Neutral",
    },
  ];

  const getWaterIcon = (requirement) => {
    if (requirement.toLowerCase().includes("high"))
      return <Droplets className="h-5 w-5 text-blue-500" />;
    if (requirement.toLowerCase().includes("medium"))
      return <Droplets className="h-5 w-5 text-blue-400" />;
    return <Droplets className="h-5 w-5 text-blue-300" />;
  };

  const formatPriceDisplay = (price, trend) => {
    const color =
      trend > 0
        ? "text-emerald-600"
        : trend < 0
        ? "text-rose-600"
        : "text-amber-600";
    return <span className={color}>₹{price}/kg</span>;
  };

  return (
    <div className="space-y-6 w-full animate-fade-in">
      <Card className="border-0 shadow-md overflow-hidden bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold flex items-center">
              <Leaf className="mr-2 h-6 w-6" />
              {crop.name} Market Outlook
            </CardTitle>
            <Badge className="bg-white text-blue-700 px-3 py-1 text-sm">
              {priceChange >= 0 ? (
                <TrendingUp className="h-4 w-4 inline mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 inline mr-1" />
              )}
              {priceChange >= 0 ? "Rising Market" : "Falling Market"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full bg-white rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">
                Price Summary
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-4 bg-gradient-to-br from-blue-50 to-white border border-blue-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 rounded-bl-full opacity-30"></div>
                  <p className="text-gray-600 text-sm font-medium">
                    Current Price
                  </p>
                  <p className="text-3xl font-bold mt-2 text-blue-700">
                    ₹{currentPrice}/kg
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Today's market rate
                  </p>
                </Card>

                <Card className="p-4 bg-gradient-to-br from-green-50 to-white border border-green-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-green-100 rounded-bl-full opacity-30"></div>
                  <p className="text-gray-600 text-sm font-medium flex items-center">
                    At Harvest{" "}
                    <Badge variant="outline" className="ml-2">
                      {harvestMonth}
                    </Badge>
                  </p>
                  <p className="text-3xl font-bold mt-2 text-green-700">
                    ₹{priceAtHarvest.toFixed(2)}/kg
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Expected when your crop is ready
                  </p>
                </Card>

                <Card
                  className={`p-4 relative overflow-hidden bg-gradient-to-br ${
                    priceChange >= 0
                      ? "from-emerald-50 to-white border border-emerald-100"
                      : "from-rose-50 to-white border border-rose-100"
                  }`}
                >
                  <div
                    className={`absolute top-0 right-0 w-16 h-16 rounded-bl-full opacity-30 ${
                      priceChange >= 0 ? "bg-emerald-100" : "bg-rose-100"
                    }`}
                  ></div>
                  <p className="text-gray-600 text-sm font-medium">
                    Price Change
                  </p>
                  <p
                    className={`text-3xl font-bold mt-2 ${
                      priceChange >= 0 ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {priceChange >= 0 ? "+" : ""}
                    {priceChange.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    From now until harvest
                  </p>
                </Card>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 mt-6">
            <div className="flex-1 bg-white rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2 flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
                Price Trends Over Time
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={marketData}
                    margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorHistorical"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorProjected"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <pattern
                        id="diagonalHatch"
                        patternUnits="userSpaceOnUse"
                        width="4"
                        height="4"
                      >
                        <path
                          d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2"
                          stroke="#10b981"
                          strokeWidth="1"
                          opacity="0.5"
                        />
                      </pattern>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={{ stroke: "#e5e7eb" }}
                    />
                    <YAxis
                      tickFormatter={(value) => `₹${value}`}
                      tickLine={false}
                      axisLine={{ stroke: "#e5e7eb" }}
                    />
                    <Tooltip
                      formatter={(value) => [`₹${value}/kg`, "Price"]}
                      labelFormatter={(label) => `Month: ${label}`}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorHistorical)"
                      strokeWidth={2}
                      activeDot={{ r: 6 }}
                      name="Price"
                      dot={{ strokeWidth: 2 }}
                    />
                    <ReferenceLine
                      x={currentMonthName}
                      stroke="#4f46e5"
                      strokeWidth={2}
                      label={{
                        value: "Today",
                        position: "top",
                        fill: "#4f46e5",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    />
                    <ReferenceLine
                      x={harvestMonth}
                      stroke="#059669"
                      strokeWidth={2}
                      label={{
                        value: "Harvest",
                        position: "top",
                        fill: "#059669",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between text-sm mt-4 bg-gray-50 p-2 rounded-lg">
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  Past Prices
                </span>
                <span className="font-medium">
                  Current:{" "}
                  <span className="text-blue-600 font-bold">
                    ₹{currentPrice}/kg
                  </span>
                </span>
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  Forecast
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">
                  Market Factors
                </h3>
                <div className="space-y-3">
                  {marketFactors.map((item, index) => {
                    const getImpactColor = (impact) => {
                      if (impact === "High" || impact === "Favorable")
                        return "bg-emerald-500";
                      if (impact === "Moderate" || impact === "Neutral")
                        return "bg-amber-500";
                      return "bg-rose-500";
                    };

                    const getImpactWidth = (impact) => {
                      if (impact === "High" || impact === "Favorable")
                        return "w-full";
                      if (impact === "Moderate" || impact === "Neutral")
                        return "w-2/3";
                      return "w-1/3";
                    };

                    return (
                      <div key={index} className="relative">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            {item.factor}
                          </span>
                          <span
                            className={`text-sm font-bold ${
                              item.impact === "High" ||
                              item.impact === "Favorable"
                                ? "text-emerald-600"
                                : item.impact === "Moderate" ||
                                  item.impact === "Neutral"
                                ? "text-amber-600"
                                : "text-rose-600"
                            }`}
                          >
                            {item.impact}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${getImpactColor(
                              item.impact
                            )} ${getImpactWidth(item.impact)}`}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">
                  Growing Requirements
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
                    <div className="bg-amber-100 p-2 rounded-full">
                      <Leaf className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Soil Type</p>
                      <p className="text-sm font-medium text-gray-800">
                        {crop.soilType.join(", ")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                    <div className="bg-blue-100 p-2 rounded-full">
                      {getWaterIcon(crop.waterRequirement)}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Water Needed</p>
                      <p className="text-sm font-medium text-gray-800">
                        {crop.waterRequirement.charAt(0).toUpperCase() +
                          crop.waterRequirement.slice(1)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-green-50 border border-green-100">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Calendar className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Growing Season</p>
                      <p className="text-sm font-medium text-gray-800">
                        {crop.growingSeason}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-purple-50 border border-purple-100">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Time to Harvest</p>
                      <p className="text-sm font-medium text-gray-800">
                        {crop.harvestTime}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4 shadow-lg border border-green-700 mt-8 mb-12">
            <h3 className="text-xl font-bold mb-3 text-green-800 flex items-center">
              <Leaf className="mr-2 h-5 w-5" />
              Farmer Recommendations
            </h3>
            <div className="space-y-2 text-base">
              <div className="flex items-start space-x-2">
                <ArrowRight className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  {priceChange > 5
                    ? `${crop.name} prices are trending upward. Consider planting more if suitable for your land.`
                    : priceChange < -5
                    ? `${crop.name} prices are declining. Consider diversifying with other crops.`
                    : `${crop.name} prices are stable. Maintain current planting strategy.`}
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <ArrowRight className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  Harvest in{" "}
                  <span className="text-green-600">{harvestMonth}</span> when
                  prices are expected to be{" "}
                  {formatPriceDisplay(priceAtHarvest.toFixed(2), priceChange)}.
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <ArrowRight className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  {marketFactors[0].impact === "High"
                    ? "High seasonal demand expected. Plan for proper storage and transportation."
                    : "Moderate to low seasonal demand. Consider post-harvest value addition."}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketTrends;

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  Calendar,
  Clock,
  Download,
  FilePieChart,
  Info,
  Leaf,
  MapPin,
  TrendingDown,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/Tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/Table";
import { Separator } from "../components/ui/Separator";
import {
  generateCropAnalysis,
  generateRecommendations,
} from "../components/GeminiService";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/Dialog";
import { getFormattedCurrentDate } from "../Utils/DateUtils";
import Loader from "../../Loader/Loader";

const CropDetail = () => {
  const { cropId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [cropName, setCropName] = useState("");
  const [cropData, setCropData] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [priceForecast, setPriceForecast] = useState([]);
  const [marketData, setMarketData] = useState([]);
  const [activeChart, setActiveChart] = useState("price");
  const [showRegionalDialog, setShowRegionalDialog] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [dataFetchFailed, setDataFetchFailed] = useState(false);

  useEffect(() => {
    const fetchCropData = async () => {
      setIsLoading(true);
      setDataFetchFailed(false);

      try {
        const formattedName =
          cropId
            ?.split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ") || "";

        setCropName(formattedName);

        const mockPriceHistory = generatePriceHistoryData(formattedName);

        const mockPriceForecast = generatePriceForecastData(formattedName);

        const mockMarketData = generateMarketData(formattedName);

        setPriceHistory(mockPriceHistory);
        setPriceForecast(mockPriceForecast);
        setMarketData(mockMarketData);

        if (formattedName) {
          try {
            const analysisData = await generateCropAnalysis(formattedName);
            console.log("Successfully generated crop analysis:", analysisData);
            setCropData(analysisData);
          } catch (analysisError) {
            console.error("Error in crop analysis:", analysisError);
            setDataFetchFailed(true);

            setCropData({
              predictions: `The market for ${formattedName} is currently showing positive trends with a stable price outlook for the next quarter. Current demand remains strong across major agricultural markets in India.`,
              recommendations: [
                `Consider timing your ${formattedName} harvest to align with the projected price increase in the coming months.`,
                `Monitor weather forecasts closely as current conditions are favorable for ${formattedName} cultivation in most regions.`,
                `Implement targeted irrigation and balanced fertilizer application to maximize ${formattedName} yield and quality.`,
                `Explore local market opportunities where ${formattedName} is in high demand this season.`,
              ],
              marketInsights: `The ${formattedName} market is currently experiencing steady growth due to increased domestic consumption and export opportunities. Prices have remained relatively stable with seasonal fluctuations well within expected ranges. Government support programs and favorable monsoon predictions indicate positive outlook for ${formattedName} producers in the coming months.`,
              priceAnalysis: {
                current: mockPriceHistory[5].price,
                previous: mockPriceHistory[4].price,
                change:
                  ((mockPriceHistory[5].price - mockPriceHistory[4].price) /
                    mockPriceHistory[4].price) *
                  100,
                forecast: mockPriceForecast[0].price,
              },
            });
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching crop data:", error);
        setDataFetchFailed(true);

        if (retryCount === 0) {
          toast.error("Failed to load crop data. Retrying...");
          setRetryCount((prev) => prev + 1);
          setTimeout(() => fetchCropData(), 2000);
        } else {
          toast.error(
            "Could not load complete data. Showing available information."
          );
          setIsLoading(false);
        }
      }
    };

    fetchCropData();
  }, [cropId, retryCount]);

  const generatePriceHistoryData = (crop) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const basePrice = getBasePrice(crop);

    return months.map((month, index) => {
      const volatility = 0.1;
      const randomFactor = 1 + (Math.random() * volatility * 2 - volatility);
      const price = basePrice * randomFactor * (1 + index * 0.03);

      return {
        month,
        price: Math.round(price * 100) / 100,
        volume: Math.floor(10000 + Math.random() * 5000),
      };
    });
  };

  const generatePriceForecastData = (crop) => {
    const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const basePrice = getBasePrice(crop);
    const lastHistorical = basePrice * (1 + 5 * 0.03);

    return months.map((month, index) => {
      const volatility = 0.15;
      const randomFactor = 1 + (Math.random() * volatility * 2 - volatility);
      const seasonalFactor =
        index < 3 ? 1 + index * 0.02 : 1 + (5 - index) * 0.02;
      const price = lastHistorical * randomFactor * seasonalFactor;

      return {
        month,
        price: Math.round(price * 100) / 100,
        volume: Math.floor(9000 + Math.random() * 4000),
        forecast: true,
      };
    });
  };

  const generateMarketData = (crop) => {
    const markets = [
      "Delhi",
      "Mumbai",
      "Kolkata",
      "Chennai",
      "Bangalore",
      "Hyderabad",
      "Ahmedabad",
      "Lucknow",
    ];
    const basePrice = getBasePrice(crop);

    return markets.map((market) => {
      const regionalFactor = 0.9 + Math.random() * 0.3;
      const price = basePrice * regionalFactor;

      return {
        market,
        price: Math.round(price * 100) / 100,
        change: Math.round((Math.random() * 8 - 2) * 10) / 10,
        volume: Math.floor(1500 + Math.random() * 2000),
      };
    });
  };

  const getBasePrice = (crop) => {
    const cropLower = crop.toLowerCase();

    if (cropLower.includes("tomato")) return 60;
    if (cropLower.includes("potato")) return 35;
    if (cropLower.includes("onion")) return 40;
    if (cropLower.includes("rice")) return 55;
    if (cropLower.includes("wheat")) return 30;
    if (cropLower.includes("apple")) return 180;
    if (cropLower.includes("banana")) return 65;
    if (cropLower.includes("orange")) return 95;
    if (cropLower.includes("mango")) return 120;
    if (cropLower.includes("chilli")) return 85;

    return 75;
  };

  const combinedPriceData = [...priceHistory, ...priceForecast];

  const downloadData = () => {
    try {
      const csvData = [
        ["Month", "Price (₹)", "Type"],
        ...priceHistory.map((item) => [item.month, item.price, "Historical"]),
        ...priceForecast.map((item) => [item.month, item.price, "Forecast"]),
      ];

      const csvContent = csvData.map((row) => row.join(",")).join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${cropName.toLowerCase()}-price-data.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Data downloaded successfully");
    } catch (error) {
      console.error("Error downloading data:", error);
      toast.error("Failed to download data");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen md:pt-24 pb-12 md:pl-24">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            <span>Back to home</span>
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold mb-2">{cropName}</h1>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1.5 text-sm">
              <Clock size={14} className="text-muted-foreground" />
              <span>Updated: {getFormattedCurrentDate()}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <MapPin size={14} className="text-muted-foreground" />
              <span>Indian Markets</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <Calendar size={14} className="text-muted-foreground" />
              <span>6-month analysis</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Current Market Price
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ₹{cropData?.priceAnalysis.current || "85"}/kg
              </div>
              <div className="flex items-center mt-1">
                {cropData?.priceAnalysis.change &&
                cropData.priceAnalysis.change > 0 ? (
                  <div className="flex items-center text-green-600 dark:text-green-400">
                    <TrendingUp size={16} className="mr-1" />
                    <span>
                      +{cropData.priceAnalysis.change.toFixed(1)}% from last
                      month
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600 dark:text-red-400">
                    <TrendingDown size={16} className="mr-1" />
                    <span>
                      {cropData?.priceAnalysis.change?.toFixed(1) || "-1.2"}%
                      from last month
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Forecasted Price (Next Month)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ₹{cropData?.priceAnalysis.forecast || "90"}/kg
              </div>
              <div className="flex items-center mt-1 text-muted-foreground text-sm">
                Based on historical data and market trends
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Market Sentiment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">Positive</div>
              <div className="w-full bg-muted rounded-full h-2.5 mt-2">
                <div
                  className="bg-green-500 h-2.5 rounded-full"
                  style={{ width: "75%" }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>Bearish</span>
                <span>Neutral</span>
                <span>Bullish</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Price Analysis */}
        <Card className="mb-8 chart-container">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <FilePieChart className="h-5 w-5 text-primary" />
                  Price Analysis
                </CardTitle>
                <CardDescription>
                  Historical and forecasted prices for {cropName}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={activeChart === "price" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveChart("price")}
                >
                  Price
                </Button>
                <Button
                  variant={activeChart === "volume" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveChart("volume")}
                >
                  Volume
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadData}
                  className="ml-2"
                >
                  <Download size={16} className="mr-1" />
                  <span className="hidden sm:inline">Download</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                {activeChart === "price" ? (
                  <LineChart
                    data={combinedPriceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        `₹${value}/kg`,
                        name === "price" ? "Price" : "Volume",
                      ]}
                      labelFormatter={(label) => `Month: ${label}`}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        borderRadius: "8px",
                        border: "1px solid #e0e0e0",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="price"
                      name="Historical Price"
                      stroke="#69a566"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#69a566" }}
                      activeDot={{ r: 6 }}
                      isAnimationActive={true}
                      animationDuration={1000}
                      connectNulls
                      data={priceHistory}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      name="Forecasted Price"
                      stroke="#69a566"
                      strokeWidth={3}
                      strokeDasharray="5 5"
                      dot={{ r: 4, fill: "#69a566" }}
                      activeDot={{ r: 6 }}
                      isAnimationActive={true}
                      animationDuration={1000}
                      connectNulls
                      data={priceForecast}
                    />
                  </LineChart>
                ) : (
                  <AreaChart
                    data={combinedPriceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "volume"
                          ? `${Number(value).toLocaleString()} tonnes`
                          : value,
                        name === "volume" ? "Volume" : name,
                      ]}
                      labelFormatter={(label) => `Month: ${label}`}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        borderRadius: "8px",
                        border: "1px solid #e0e0e0",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="volume"
                      name="Historical Volume"
                      fill="#b9e6fe80"
                      stroke="#0c9aea"
                      data={priceHistory}
                    />
                    <Area
                      type="monotone"
                      dataKey="volume"
                      name="Forecasted Volume"
                      fill="#b9e6fe50"
                      stroke="#0c9aea"
                      strokeDasharray="5 5"
                      data={priceForecast}
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>

            <div className="mt-6">
              <Tabs defaultValue="table">
                <TabsList>
                  <TabsTrigger value="table">Price Table</TabsTrigger>
                  <TabsTrigger value="markets">Market Comparison</TabsTrigger>
                </TabsList>
                <TabsContent value="table" className="mt-4">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Month</TableHead>
                          <TableHead>Price (₹/kg)</TableHead>
                          <TableHead>Volume (tonnes)</TableHead>
                          <TableHead>Type</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {combinedPriceData.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.month}</TableCell>
                            <TableCell>₹{item.price.toFixed(2)}</TableCell>
                            <TableCell>
                              {item.volume?.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  item.forecast
                                    ? "bg-accent text-accent-foreground"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {item.forecast ? "Forecast" : "Historical"}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                <TabsContent value="markets" className="mt-4">
                  <div className="h-[300px] mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={marketData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="market" />
                        <YAxis />
                        <Tooltip
                          formatter={(value, name) => [
                            name === "price" ? `₹${value}/kg` : value,
                            name === "price" ? "Price" : name,
                          ]}
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            borderRadius: "8px",
                            border: "1px solid #e0e0e0",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Bar
                          dataKey="price"
                          fill="#69a566"
                          name="Price (₹/kg)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Market</TableHead>
                          <TableHead>Price (₹/kg)</TableHead>
                          <TableHead>Change</TableHead>
                          <TableHead>Volume (tonnes)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {marketData.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {item.market}
                            </TableCell>
                            <TableCell>₹{item.price.toFixed(2)}</TableCell>
                            <TableCell>
                              <span
                                className={`flex items-center ${
                                  item.change >= 0
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400"
                                }`}
                              >
                                {item.change >= 0 ? (
                                  <TrendingUp size={16} className="mr-1" />
                                ) : (
                                  <TrendingDown size={16} className="mr-1" />
                                )}
                                {item.change >= 0 ? "+" : ""}
                                {item.change.toFixed(1)}%
                              </span>
                            </TableCell>
                            <TableCell>
                              {item.volume.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="chart-container">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Market Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose dark:prose-invert max-w-none">
                <p>
                  {cropData?.marketInsights ||
                    `The ${cropName} market is currently showing positive trends due to favorable weather conditions and increased export demand. Prices have been relatively stable with a slight upward trajectory expected in the coming months.`}
                </p>

                <p>Key factors affecting the market:</p>
                <ul>
                  <li>Increased export demand from neighboring countries</li>
                  <li>Favorable monsoon predictions for the upcoming season</li>
                  <li>Government procurement policies and MSP announcements</li>
                  <li>Current stock levels in major warehouses across India</li>
                </ul>
              </div>

              <div className="flex items-center p-3 bg-accent/40 rounded-lg border border-accent">
                <Zap
                  size={18}
                  className="text-accent-foreground mr-2 flex-shrink-0"
                />
                <p className="text-sm">
                  {cropData?.predictions ||
                    `${cropName} prices are expected to rise gradually over the next 3 months before stabilizing as the new harvest reaches markets.`}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center">
                  <span>Recent News</span>
                  <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded-full ml-2">
                    Live
                  </span>
                </h3>
                <div className="space-y-3">
                  <div className="border-l-2 border-primary pl-3">
                    <p className="text-sm font-medium">
                      Government Announces New Support Scheme for {cropName}{" "}
                      Farmers
                    </p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </div>
                  <div className="border-l-2 border-primary pl-3">
                    <p className="text-sm font-medium">
                      Export Demand for Indian {cropName} Rises by 15%
                    </p>
                    <p className="text-xs text-muted-foreground">5 days ago</p>
                  </div>
                  <div className="border-l-2 border-primary pl-3">
                    <p className="text-sm font-medium">
                      Weather Department Predicts Favorable Conditions for{" "}
                      {cropName} Cultivation
                    </p>
                    <p className="text-xs text-muted-foreground">1 week ago</p>
                  </div>
                </div>
                <Button variant="link" className="p-0 h-auto mt-2">
                  View all news
                </Button>
              </div>

              <Separator />

              <div className="pt-2">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium mb-2">Expert Analysis Summary</h3>
                  <p className="text-sm text-muted-foreground">
                    Our agricultural experts predict a stable market for{" "}
                    {cropName} with potential for moderate price increases in
                    the next quarter based on historical patterns and current
                    market conditions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="chart-container">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Leaf className="h-5 w-5 text-primary" />
                Recommendations for Farmers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="recommendation-card positive">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mt-0.5">
                  <TrendingUp
                    size={18}
                    className="text-green-600 dark:text-green-400"
                  />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Market Opportunity</h3>
                  <p className="text-sm">
                    {cropData?.recommendations?.[0] ||
                      `Consider timing your ${cropName} harvest to align with the projected price increase in the coming months. Current market trends indicate optimal selling opportunities between August and September.`}
                  </p>
                </div>
              </div>

              <div className="recommendation-card warning">
                <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full mt-0.5">
                  <AlertTriangle
                    size={18}
                    className="text-amber-600 dark:text-amber-400"
                  />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Weather Advisory</h3>
                  <p className="text-sm">
                    {cropData?.recommendations?.[1] ||
                      `Monitor weather forecasts closely as unseasonal rains are predicted in some ${cropName} growing regions. Consider installing temporary protective covers for vulnerable crops to prevent quality degradation.`}
                  </p>
                </div>
              </div>

              <div className="recommendation-card positive">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mt-0.5">
                  <Zap
                    size={18}
                    className="text-green-600 dark:text-green-400"
                  />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Productivity Tip</h3>
                  <p className="text-sm">
                    {cropData?.recommendations?.[2] ||
                      `Implement targeted irrigation and balanced fertilizer application to maximize ${cropName} yield quality, which can command premium prices in the current market environment.`}
                  </p>
                </div>
              </div>

              {cropData?.recommendations?.[3] && (
                <div className="recommendation-card positive">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mt-0.5">
                    <Info
                      size={18}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Additional Insight</h3>
                    <p className="text-sm">{cropData.recommendations[3]}</p>
                  </div>
                </div>
              )}

              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <h3 className="font-medium">
                  Government Schemes for {cropName} Farmers
                </h3>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
                  <p className="text-sm">
                    Pradhan Mantri Fasal Bima Yojana (PMFBY) - Crop insurance
                    scheme
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
                  <p className="text-sm">
                    PM-Kisan Samman Nidhi - ₹6,000 annual income support
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
                  <p className="text-sm">
                    Minimum Support Price (MSP) procurement for eligible crops
                  </p>
                </div>
                <Button variant="link" className="p-0 h-auto">
                  View all schemes
                </Button>
              </div>

              <Separator />

              <div className="pt-2">
                <div className="flex items-center gap-2 p-4 bg-primary/10 rounded-lg text-sm">
                  <Info size={16} className="text-primary flex-shrink-0" />
                  <p>
                    These recommendations are based on historical data patterns,
                    current market conditions, and agricultural expertise.
                    Always consult with local agricultural extension services
                    for region-specific advice.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showRegionalDialog} onOpenChange={setShowRegionalDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Regional Market Analysis for {cropName}</DialogTitle>
            <DialogDescription>
              Detailed price comparison across major agricultural markets in
              India
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="h-[400px] mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[...marketData].sort((a, b) => b.price - a.price)}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis type="number" domain={[0, "dataMax + 10"]} />
                  <YAxis dataKey="market" type="category" width={100} />
                  <Tooltip
                    formatter={(value) => [`₹${value}/kg`, "Current Price"]}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      borderRadius: "8px",
                      border: "1px solid #e0e0e0",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="price"
                    fill="#69a566"
                    radius={[0, 4, 4, 0]}
                    label={{
                      position: "right",
                      formatter: (value) => `₹${value}`,
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-3">
                  Price Trends by Region
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Northern India</span>
                    <span className="text-green-600 dark:text-green-400 flex items-center">
                      <TrendingUp size={14} className="mr-1" />
                      +2.4%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Southern India</span>
                    <span className="text-green-600 dark:text-green-400 flex items-center">
                      <TrendingUp size={14} className="mr-1" />
                      +3.1%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Eastern India</span>
                    <span className="text-red-600 dark:text-red-400 flex items-center">
                      <TrendingDown size={14} className="mr-1" />
                      -1.2%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Western India</span>
                    <span className="text-green-600 dark:text-green-400 flex items-center">
                      <TrendingUp size={14} className="mr-1" />
                      +1.8%
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Regional Insights</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
                    <span>
                      Urban markets show 8-10% higher prices compared to rural
                      mandis
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
                    <span>
                      Direct farm-to-consumer channels offer 15-20% better
                      returns in metro cities
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
                    <span>
                      Export-focused regions (Maharashtra, Gujarat) show
                      stronger price stability
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
                    <span>
                      Regional festivals in Southern India expected to boost
                      demand by 25% in coming weeks
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="fixed bottom-8 right-8">
        <Button
          onClick={() => setShowRegionalDialog(true)}
          size="lg"
          className="shadow-lg"
        >
          View Regional Analysis
        </Button>
      </div>
    </div>
  );
};

export default CropDetail;

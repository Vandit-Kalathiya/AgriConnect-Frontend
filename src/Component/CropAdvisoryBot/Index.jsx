import React, { useState, useEffect, useCallback } from "react";
import {
  ArrowLeftIcon,
  Leaf,
  MapPin,
  TrendingUp,
  Droplets,
  RefreshCw,
  Sun,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import AnimatedBackground from "./components/AnimatedBackground";
import LocationSelector from "./components/LocationSelector";
import ChatInterface from "./components/ChatInterface";
import SoilTips from "./components/SoilTips";
import MarketTrends from "./components/MarketTrends";
import CropCard from "./components/CropCard";
import { Button } from "./components/ui/Button";
import { motion } from "framer-motion";
import { fetchCropAdvisoryHistory } from "../../api/aiHistoryApi";

const Index = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [recommendedCrops, setRecommendedCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [activeTab, setActiveTab] = useState("chat");
  const [showLocationSelector, setShowLocationSelector] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [historyItems, setHistoryItems] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedHistoryKey, setSelectedHistoryKey] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [historySearch, setHistorySearch] = useState("");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setHistoryLoading(true);
        const data = await fetchCropAdvisoryHistory({ page: 0, size: 20 });
        const list = data?.history || [];
        setHistoryItems(Array.isArray(list) ? list : []);
      } catch (error) {
        console.error("Failed to load crop advisory history:", error);
      } finally {
        setHistoryLoading(false);
      }
    };
    loadHistory();
  }, []);

  const filteredHistoryItems = historyItems.filter((item) => {
    const q = historySearch.trim().toLowerCase();
    if (!q) return true;
    const district = String(item?.district || "").toLowerCase();
    const state = String(item?.state || "").toLowerCase();
    const season = String(item?.season || "").toLowerCase();
    const soilType = String(item?.soilType || "").toLowerCase();
    return (
      district.includes(q) ||
      state.includes(q) ||
      season.includes(q) ||
      soilType.includes(q)
    );
  });

  const handleLocationSelect = (location) => {
    setIsLoading(true);
    setSelectedLocation(location);

    // Simulate loading state
    setTimeout(() => {
      setShowLocationSelector(false);
      setIsLoading(false);
    }, 800);

    setSelectedCrop(null);
    setRecommendedCrops([]);
  };

  const handleRecommendationsReceived = useCallback((crops) => {
    setRecommendedCrops(crops);
  }, []);

  const handleCropSelect = (crop) => {
    setSelectedCrop(crop);
    // Scroll to top when selecting a crop
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToRecommendations = () => {
    setSelectedCrop(null);
  };

  const handleChooseNewLocation = () => {
    setShowLocationSelector(true);
    setSelectedLocation(null);
    setRecommendedCrops([]);
    setSelectedCrop(null);
    setSelectedHistoryKey("");
  };

  const handleReuseHistory = (item, index) => {
    const location = {
      district: item?.district || "",
      state: item?.state || "",
      soilType: item?.soilType || "",
      season: item?.season || "",
    };
    setSelectedHistoryKey(`${item?.createdAt || ""}-${index}`);
    setSelectedLocation(location);
    setShowLocationSelector(false);
    setSelectedCrop(null);
    setRecommendedCrops([]);
    setActiveTab("chat");
    setSidebarOpen(false);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] w-full relative overflow-hidden bg-gradient-to-b from-background to-background/80 md:ml-14">
      <AnimatedBackground />

      <main className="container max-w-[1380px] mx-auto px-3 md:px-6 py-6 relative z-10">
        <motion.header
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block px-5 py-2 bg-gradient-to-r from-jewel-200/30 to-jewel-400/30 backdrop-blur-sm rounded-full text-primary font-medium mb-6 shadow-md">
            <div className="flex items-center space-x-2">
              <Leaf className="h-5 w-5" />
              <span className="text-sm md:text-base">
                AI-Powered Crop Advisory
              </span>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-4 bg-gradient-to-r from-jewel-400 via-jewel-500 to-jewel-600 bg-clip-text text-transparent drop-shadow-sm">
            Indian Crop Advisor
          </h1>
          <p className="text-lg md:text-lg text-muted-foreground/90 max-w-2xl mx-auto leading-relaxed">
            Get personalized crop recommendations based on your location, soil
            conditions, and current market trends
          </p>
        </motion.header>

        <motion.div
          className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)] max-w-[1380px] mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="lg:hidden flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="rounded-md text-xs"
            >
              {sidebarOpen ? "Hide advisory chats" : "Show advisory chats"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleChooseNewLocation}
              className="rounded-md text-xs"
            >
              New
            </Button>
          </div>
          <motion.aside
            className={`${sidebarOpen ? "block" : "hidden"} lg:block rounded-2xl border border-white/30 bg-white/90 p-3 shadow-md backdrop-blur-lg h-[72vh] lg:h-[calc(100vh-220px)] overflow-hidden`}
            variants={itemVariants}
          >
            <div className="sticky top-0 z-10 mb-2 flex items-center justify-between bg-white/90 pb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-jewel-700">
                Crop Advisory Chats
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleChooseNewLocation}
                className="h-7 rounded-md px-2 text-xs"
              >
                New
              </Button>
            </div>
            <div className="mb-2">
              <input
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                placeholder="Search history..."
                className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-jewel-200"
              />
            </div>
            <div className="h-[calc(72vh-76px)] lg:h-[calc(100vh-296px)] space-y-2 overflow-y-auto pr-1">
              {historyLoading ? (
                <div className="p-2 text-xs text-gray-500">Loading chats...</div>
              ) : filteredHistoryItems.length === 0 ? (
                <div className="p-2 text-xs text-gray-500">No advisory history found.</div>
              ) : (
                filteredHistoryItems.map((item, index) => {
                  const key = `${item?.createdAt || ""}-${index}`;
                  const active = selectedHistoryKey === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handleReuseHistory(item, index)}
                      className={`w-full rounded-lg border px-3 py-2 text-left transition ${
                        active
                          ? "border-jewel-400 bg-jewel-50 shadow-sm"
                          : "border-gray-200 bg-white hover:bg-gray-50"
                      }`}
                    >
                      <div className="truncate text-sm font-medium text-gray-900">
                        {(item?.district || "-") + ", " + (item?.state || "-")}
                      </div>
                      <div className="mt-1 line-clamp-2 text-xs text-gray-600">
                        {(item?.season ? `Season: ${item.season}` : "") +
                          (item?.soilType ? ` | Soil: ${item.soilType}` : "")}
                      </div>
                      <div className="mt-1 text-[11px] text-gray-500">
                        {item?.createdAt
                          ? new Date(item.createdAt).toLocaleString()
                          : "Unknown time"}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </motion.aside>

          <div>
          {showLocationSelector ? (
            <motion.div
              className="w-full max-w-2xl mx-auto mb-8"
              variants={itemVariants}
            >
              <div className="glass-panel rounded-3xl p-8 shadow-xl border border-white/20 backdrop-blur-lg">
                <h2 className="text-2xl font-semibold mb-6 text-center">
                  Select Your Location
                </h2>
                <LocationSelector onLocationSelect={handleLocationSelect} />
              </div>
            </motion.div>
          ) : (
            <>
              <motion.div
                className="w-full mb-8 flex justify-between items-center"
                variants={itemVariants}
              >
                {selectedLocation && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-jewel-500/10 rounded-full text-sm font-medium shadow-sm">
                    <MapPin className="h-4 w-4 text-jewel-500" />
                    <span className="text-jewel-800">
                      {selectedLocation.district}, {selectedLocation.state}
                    </span>
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleChooseNewLocation}
                  className="ml-auto flex items-center text-sm rounded-full hover:bg-jewel-500/10 hover:text-jewel-700 transition-all duration-300"
                >
                  <RefreshCw className="h-3 w-3 mr-2" />
                  Choose new location
                </Button>
              </motion.div>

              <motion.div
                className="w-full space-y-8"
                variants={containerVariants}
              >
                <motion.div
                  className="w-full glass-panel rounded-3xl p-6 md:p-8 shadow-xl border border-white/20 backdrop-blur-lg"
                  variants={itemVariants}
                >
                  <div className="flex gap-4 mb-6">
                    <Button
                      variant={activeTab === "chat" ? "default" : "outline"}
                      size="lg"
                      onClick={() => setActiveTab("chat")}
                      className={`flex items-center gap-2 rounded-full px-5 py-6 transition-all duration-300 ${
                        activeTab === "chat"
                          ? "bg-jewel-500 hover:bg-jewel-600 text-white shadow-md"
                          : "hover:bg-jewel-500/10 hover:text-jewel-700"
                      }`}
                    >
                      <MessageSquare className="h-5 w-5" />
                      Chat Advisor
                    </Button>
                    <Button
                      variant={activeTab === "tips" ? "default" : "outline"}
                      size="lg"
                      onClick={() => setActiveTab("tips")}
                      className={`flex items-center gap-2 rounded-full px-5 py-6 transition-all duration-300 ${
                        activeTab === "tips"
                          ? "bg-jewel-500 hover:bg-jewel-600 text-white shadow-md"
                          : "hover:bg-jewel-500/10 hover:text-jewel-700"
                      }`}
                    >
                      <Sun className="h-5 w-5" />
                      Soil & Weather Tips
                    </Button>
                  </div>

                  {activeTab === "chat" ? (
                    <ChatInterface
                      selectedLocation={selectedLocation}
                      onRecommendationsReceived={handleRecommendationsReceived}
                      onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
                      sidebarOpen={sidebarOpen}
                    />
                  ) : (
                    <SoilTips location={selectedLocation} />
                  )}
                </motion.div>

                {recommendedCrops.length > 0 && !selectedCrop && (
                  <motion.div
                    className="w-full glass-panel rounded-3xl p-6 md:p-8 shadow-xl border border-white/20 backdrop-blur-lg"
                    variants={itemVariants}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-jewel-500/20 p-2 rounded-full">
                        <TrendingUp className="h-6 w-6 text-jewel-600 dark:text-jewel-400" />
                      </div>
                      <h2 className="text-2xl font-semibold text-jewel-800 dark:text-jewel-300">
                        Recommended Crops
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {recommendedCrops.map((crop, index) => (
                        <motion.div
                          key={crop.id || index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <CropCard
                            crop={crop}
                            index={index}
                            onSelect={handleCropSelect}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {selectedCrop && (
                  <motion.div
                    className="w-full space-y-6"
                    variants={itemVariants}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBackToRecommendations}
                      className="flex items-center text-sm mb-4 rounded-full hover:bg-jewel-500/10 hover:text-jewel-700 transition-all duration-300"
                    >
                      <ArrowLeftIcon className="h-4 w-4 mr-2" />
                      Back to recommendations
                    </Button>

                    <div className="glass-panel rounded-3xl p-6 md:p-8 shadow-xl border border-white/20 backdrop-blur-lg">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="bg-jewel-500/20 p-2 rounded-full">
                          <Leaf className="h-6 w-6 text-jewel-600 dark:text-jewel-400" />
                        </div>
                        <h2 className="text-2xl font-semibold text-jewel-800 dark:text-jewel-300">
                          {selectedCrop.name} Details
                        </h2>
                      </div>

                      <MarketTrends crop={selectedCrop} />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </>
          )}
          </div>
        </motion.div>

        {/* <footer className="mt-16 text-center text-sm text-muted-foreground/70">
          <p>
            © 2025 AgriConnect - Indian Crop Advisor • Helping farmers make data-driven
            decisions
          </p>
        </footer> */}
      </main>
    </div>
  );
};

export default Index;

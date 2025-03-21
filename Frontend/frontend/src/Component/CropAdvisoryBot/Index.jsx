import React, { useState, useEffect } from "react";
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

const Index = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [recommendedCrops, setRecommendedCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [activeTab, setActiveTab] = useState("chat");
  const [showLocationSelector, setShowLocationSelector] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleRecommendationsReceived = (crops) => {
    setRecommendedCrops(crops);
  };

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
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-b from-background to-background/80 mt-20">
      <AnimatedBackground />

      <main className="container max-w-5xl mx-auto px-4 py-12 relative z-10">
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
          className="flex flex-col items-center max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
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
        </motion.div>

        <footer className="mt-16 text-center text-sm text-muted-foreground/70">
          <p>
            © 2025 Indian Crop Advisor • Helping farmers make data-driven
            decisions
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;

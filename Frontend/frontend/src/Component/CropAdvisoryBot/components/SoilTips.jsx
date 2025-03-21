import React from "react";
import { Card, CardContent, CardHeader } from "./ui/Card";
import {
  Droplets,
  Cloud,
  Thermometer,
  Wind,
  Cloud as CloudIcon,
} from "lucide-react";

const getSeasonalInfo = () => {
  const now = new Date();
  const month = now.getMonth();

  if (month >= 2 && month <= 4) return "Summer";
  if (month >= 5 && month <= 8) return "Monsoon";
  if (month >= 9 && month <= 10) return "Post-Monsoon";
  return "Winter";
};

const getSoilInfo = (state) => {
  const soilTypes = {
    Maharashtra: {
      type: "Black Cotton Soil (Regur)",
      characteristics: [
        "High clay content",
        "Retains moisture",
        "High fertility when irrigated",
      ],
      suitableCrops: ["Cotton", "Sugarcane", "Jowar", "Wheat"],
    },
    Punjab: {
      type: "Alluvial Soil",
      characteristics: ["Fertile", "High in potash", "Good for irrigation"],
      suitableCrops: ["Wheat", "Rice", "Sugarcane", "Maize"],
    },
    Karnataka: {
      type: "Red and Black Soil",
      characteristics: [
        "Varying fertility",
        "Iron-rich in some areas",
        "Different water retention properties",
      ],
      suitableCrops: ["Ragi", "Jowar", "Pulses", "Oilseeds"],
    },
    "Uttar Pradesh": {
      type: "Alluvial Soil",
      characteristics: ["Fertile", "Well-drained", "Rich in potash and lime"],
      suitableCrops: ["Wheat", "Rice", "Sugarcane", "Pulses"],
    },
    Gujarat: {
      type: "Alluvial and Black Soil",
      characteristics: [
        "Fertile in some regions",
        "Saline in coastal areas",
        "Retains moisture",
      ],
      suitableCrops: ["Cotton", "Groundnut", "Wheat", "Bajra"],
    },
    Rajasthan: {
      type: "Desert and Arid Soil",
      characteristics: [
        "Sandy texture",
        "Low organic matter",
        "Low water retention",
      ],
      suitableCrops: ["Bajra", "Jowar", "Pulses", "Maize"],
    },
    "Tamil Nadu": {
      type: "Red and Black Soil",
      characteristics: [
        "Red soil poor in nitrogen",
        "Black soil good for cotton",
        "Sandy coastal soil",
      ],
      suitableCrops: ["Rice", "Sugarcane", "Coconut", "Banana"],
    },
    "West Bengal": {
      type: "Alluvial Soil",
      characteristics: [
        "Highly fertile",
        "Rich in nutrients",
        "Good water retention",
      ],
      suitableCrops: ["Rice", "Jute", "Tea", "Vegetables"],
    },
  };

  return (
    soilTypes[state] || {
      type: "Various Soil Types",
      characteristics: [
        "Varies by region",
        "Consult local agricultural department",
        "Soil testing recommended",
      ],
      suitableCrops: [
        "Region-specific crops",
        "Consult local agricultural experts",
      ],
    }
  );
};

const weatherTips = {
  Summer: [
    "Consider drought-resistant varieties for summer planting",
    "Implement water conservation techniques",
    "Use mulching to retain soil moisture",
  ],
  Monsoon: [
    "Ensure proper drainage in fields",
    "Consider raised bed farming in flood-prone areas",
    "Watch for pest outbreaks that thrive in high humidity",
  ],
  "Post-Monsoon": [
    "Good time for rabi crop planting",
    "Check soil moisture levels before planting",
    "Apply appropriate post-monsoon fertilizers",
  ],
  Winter: [
    "Protect sensitive crops from frost",
    "Reduce irrigation frequency",
    "Consider greenhouse cultivation for temperature-sensitive crops",
  ],
};

const SoilTips = ({ location }) => {
  if (!location) return null;

  const { state } = location;
  const soilInfo = getSoilInfo(state);
  const currentSeason = getSeasonalInfo();

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="overflow-hidden bg-white/80 backdrop-blur-sm border border-white/20">
        <CardHeader className="bg-gradient-to-r from-blue-50/50 to-emerald-50/50 border-b border-white/20">
          <div className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-jewel-500" />
            <h3 className="text-xl font-medium">
              Soil Information for {state}
            </h3>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <div className="h-5 w-5 rounded-full bg-amber-600/80" />
              </div>
              <div>
                <h4 className="font-medium text-lg">Predominant Soil Type</h4>
                <p className="text-muted-foreground">{soilInfo.type}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Key Soil Characteristics</h4>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                {soilInfo.characteristics.map((characteristic, index) => (
                  <li key={index}>{characteristic}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Traditionally Suitable Crops</h4>
              <div className="flex flex-wrap gap-2">
                {soilInfo.suitableCrops.map((crop, index) => (
                  <span
                    key={index}
                    className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm"
                  >
                    {crop}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden bg-white/80 backdrop-blur-sm border border-white/20">
        <CardHeader className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-b border-white/20">
          <div className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-jewel-500" />
            <h3 className="text-xl font-medium">Seasonal Weather Guidance</h3>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 h-10 w-10 rounded-full flex items-center justify-center">
                {currentSeason === "Summer" && (
                  <Thermometer className="h-5 w-5 text-amber-500" />
                )}
                {currentSeason === "Monsoon" && (
                  <CloudIcon className="h-5 w-5 text-blue-500" />
                )}
                {currentSeason === "Post-Monsoon" && (
                  <Wind className="h-5 w-5 text-blue-400" />
                )}
                {currentSeason === "Winter" && (
                  <Thermometer className="h-5 w-5 text-blue-500" />
                )}
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Current Season
                </div>
                <div className="font-medium text-lg">{currentSeason}</div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Seasonal Farming Tips</h4>
              <ul className="space-y-2">
                {weatherTips[currentSeason].map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-xs mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-muted-foreground">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SoilTips;

import { postAi } from "../../../services/aiApi";

export const generateCropAnalysis = async (cropName) => {
  try {
    const cachedData = localStorage.getItem(`cropAnalysis_${cropName}`);
    if (cachedData) {
      const parsedCache = JSON.parse(cachedData);
      if (parsedCache?.timestamp && Date.now() - parsedCache.timestamp < 3600000) {
        return parsedCache.data;
      }
    }

    const payload = await postAi("/market/crop-analysis", { cropName }, { signal: AbortSignal.timeout(15000) });
    const sanitized = sanitizeResponse(payload, cropName);
    cacheAnalysisData(cropName, sanitized);
    return sanitized;
  } catch (error) {
    console.error("Error generating crop analysis:", error);

    const cachedData = localStorage.getItem(`cropAnalysis_${cropName}`);
    if (cachedData) {
      try {
        return JSON.parse(cachedData).data;
      } catch {
        // ignore stale cache parse failure
      }
    }

    const fallbackData = createFallbackData(cropName);
    cacheAnalysisData(cropName, fallbackData);
    return fallbackData;
  }
};

const cacheAnalysisData = (cropName, data) => {
  try {
    localStorage.setItem(
      `cropAnalysis_${cropName}`,
      JSON.stringify({ data, timestamp: Date.now() })
    );
  } catch (e) {
    console.error("Error caching data:", e);
  }
};

const sanitizeResponse = (data, cropName) => ({
  predictions:
    data?.predictions || `Market analysis for ${cropName} is currently being processed.`,
  recommendations: Array.isArray(data?.recommendations)
    ? data.recommendations
    : [
        `Monitor market trends before harvesting ${cropName}.`,
        `Track local mandi rates for better price timing.`,
        `Use quality grading to improve selling value.`,
      ],
  marketInsights:
    data?.marketInsights ||
    `Detailed market insights for ${cropName} will be available soon.`,
  priceAnalysis: {
    current:
      typeof data?.priceAnalysis?.current === "number"
        ? data.priceAnalysis.current
        : 0,
    previous:
      typeof data?.priceAnalysis?.previous === "number"
        ? data.priceAnalysis.previous
        : 0,
    change:
      typeof data?.priceAnalysis?.change === "number"
        ? data.priceAnalysis.change
        : 0,
    forecast:
      typeof data?.priceAnalysis?.forecast === "number"
        ? data.priceAnalysis.forecast
        : 0,
  },
});

const createFallbackData = (cropName) => ({
  predictions: `${cropName} market is showing normal seasonal movement with moderate demand.`,
  recommendations: [
    `Monitor mandi prices daily before you sell ${cropName}.`,
    `Store produce safely to avoid distressed selling.`,
    `Explore nearby buyers and cooperatives for better rates.`,
  ],
  marketInsights:
    "Local demand and transport costs are key factors in price realization. Plan harvest and sale windows carefully.",
  priceAnalysis: {
    current: 0,
    previous: 0,
    change: 0,
    forecast: 0,
  },
});

export const generateRecommendations = async (cropType = "general") => {
  try {
    const data = await postAi("/market/recommendations", { cropType });

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.recommendations)) return data.recommendations;

    throw new Error("Invalid recommendations payload from AI backend");
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return getFallbackRecommendations(cropType);
  }
};

const getFallbackRecommendations = (cropType) => {
  const lower = (cropType || "").toLowerCase();

  if (lower.includes("fruit")) {
    return [
      "Focus on quality sorting and grading for better pricing.",
      "Use post-harvest handling to reduce losses.",
      "Compare market rates across nearby mandis before dispatch.",
    ];
  }

  if (lower.includes("vegetable")) {
    return [
      "Use staggered harvesting to avoid market glut.",
      "Track daily demand and sell during peak local demand windows.",
      "Improve shelf-life with proper packaging and ventilation.",
    ];
  }

  return [
    "Diversify crops to reduce market risk.",
    "Track local weather and mandi trends weekly.",
    "Use government support schemes to reduce input costs.",
  ];
};
